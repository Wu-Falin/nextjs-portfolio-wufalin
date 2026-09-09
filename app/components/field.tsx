"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * The ambient background: a plume of particles, cut to a coarse grid and
 * enlarged as hard pixels.
 *
 * The clips are drawn through a canvas rather than shown directly. CSS
 * image-rendering has no effect on a video element in Chromium - it applies to
 * images and canvases only - so a video left to the browser is smoothed however
 * the property is set, which is what made a 320x180 clip look like a mistake
 * rather than a decision. Drawn into a canvas whose backing store is the source
 * crop at 1:1, the whole enlargement is CSS scaling a canvas, where the
 * property is honoured and every source pixel lands as one square block.
 *
 * Two clips rather than one and a tint layer: each carries the field green and
 * its own theme's background already baked in, so crossing between themes is an
 * alpha blend of two draws, which is exact, rather than a blend mode, which
 * cannot animate at all.
 *
 * Only the theme you are looking at is fetched. A visitor who asks for reduced
 * motion is served the still frames alone and never fetches a clip; the posters
 * are images, so they take the same pixelated enlargement natively.
 */
type ThemeName = "dark" | "light";

const clips = [
	{
		theme: "dark" as ThemeName,
		src: "/field-dark.mp4",
		alt: "/field-dark.webm",
		poster: "/field-dark.png",
		// Written out rather than built from the theme name: Tailwind only keeps
		// the classes it can find as whole strings in the source.
		className: "field-clip field-clip-dark",
	},
	{
		theme: "light" as ThemeName,
		src: "/field-light.mp4",
		alt: "/field-light.webm",
		poster: "/field-light.png",
		className: "field-clip field-clip-light",
	},
];

/** Matches the theme cross fade elsewhere on the page. */
const BLEND_MS = 750;

const readTheme = (): ThemeName =>
	document.documentElement.dataset.theme === "light" ? "light" : "dark";

const weightFor = (theme: ThemeName) => {
	const styles = getComputedStyle(document.documentElement);
	const value = Number.parseFloat(
		styles.getPropertyValue(
			theme === "light" ? "--field-light" : "--field-dark",
		),
	);
	return Number.isFinite(value) ? value : 0.8;
};

export const Field: React.FC<{ className?: string }> = ({ className = "" }) => {
	const holder = useRef<HTMLDivElement>(null);
	const surface = useRef<HTMLCanvasElement>(null);
	// Starts false so the server and the first client render agree on the still
	// frames; the clips are swapped in once we know motion is welcome.
	const [moving, setMoving] = useState(false);
	const [wanted, setWanted] = useState<ThemeName[]>([]);

	const want = useCallback((theme: ThemeName) => {
		setWanted((held) => (held.includes(theme) ? held : [...held, theme]));
	}, []);

	useEffect(() => {
		const quiet = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setMoving(!quiet.matches);
		sync();
		quiet.addEventListener("change", sync);
		return () => quiet.removeEventListener("change", sync);
	}, []);

	// Ask for the theme on screen now, and for any theme switched to later.
	useEffect(() => {
		if (!moving) return;
		want(readTheme());
		const watch = new MutationObserver(() => want(readTheme()));
		watch.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
		return () => watch.disconnect();
	}, [moving, want]);

	useEffect(() => {
		const box = holder.current;
		const canvas = surface.current;
		if (!box || !canvas || !moving) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const players = Array.from(box.querySelectorAll<HTMLVideoElement>("video"));
		if (!players.length) return;

		let frame = 0;
		let last = 0;
		let crop = { sx: 0, sy: 0, sw: 0, sh: 0 };
		// One weight per clip, tweened so a theme change crosses rather than cuts.
		// A fixed span with the same shape as the page's own fade, rather than a
		// decay: the field is most of what you see, so if it settles ahead of the
		// page the background arrives before everything on it.
		const weight = clips.map((clip) =>
			clip.theme === readTheme() ? weightFor(clip.theme) : 0,
		);
		const target = weight.slice();
		let from = weight.slice();
		let since = 0;

		const retarget = () => {
			const now = readTheme();
			from = weight.slice();
			since = performance.now();
			clips.forEach((clip, i) => {
				target[i] = clip.theme === now ? weightFor(clip.theme) : 0;
			});
		};

		const fit = () => {
			const width = box.clientWidth;
			const height = box.clientHeight;
			const source = players.find((p) => p.videoWidth > 0);
			const vw = source?.videoWidth || 320;
			const vh = source?.videoHeight || 180;
			if (!width || !height) return;

			// Crop the source to the window's shape and make the canvas exactly
			// that many source pixels, so nothing is resampled on the way in and
			// the only scaling left is the browser enlarging square blocks.
			const scale = Math.min(vw / width, vh / height);
			const sw = Math.max(1, Math.round(width * scale));
			const sh = Math.max(1, Math.round(height * scale));
			crop = {
				sx: Math.round((vw - sw) / 2),
				sy: Math.round((vh - sh) / 2),
				sw,
				sh,
			};
			if (canvas.width !== sw || canvas.height !== sh) {
				canvas.width = sw;
				canvas.height = sh;
			}
			ctx.imageSmoothingEnabled = false;
		};

		const paint = (now: number) => {
			frame = window.requestAnimationFrame(paint);
			last = now;

			const step = since ? Math.min(1, (now - since) / BLEND_MS) : 1;
			const ease = step * step * (3 - 2 * step);

			players.forEach((player, i) => {
				weight[i] = from[i] + (target[i] - from[i]) * ease;
			});

			// A clip hands back no frame for a moment as it comes round to the
			// start again. Clearing first and finding nothing to draw is what put
			// a blank frame in the loop; if nothing is ready, the last good frame
			// stays up instead and the seam passes unseen.
			const ready = players.filter(
				(player, i) => weight[i] >= 0.004 && player.readyState >= 2,
			);
			if (!ready.length) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (const player of ready) {
				ctx.globalAlpha = weight[players.indexOf(player)];
				ctx.drawImage(
					player,
					crop.sx,
					crop.sy,
					crop.sw,
					crop.sh,
					0,
					0,
					canvas.width,
					canvas.height,
				);
			}
			ctx.globalAlpha = 1;
		};

		const settle = () => {
			for (const player of players) {
				if (!player.currentSrc && !player.querySelector("source")) continue;
				if (document.hidden) {
					player.pause();
				} else {
					// A refused play() only means the browser declined autoplay, and
					// the poster stands in for it. Nothing to report.
					player.play().catch(() => undefined);
				}
			}
		};

		const onResize = () => fit();
		const themeWatch = new MutationObserver(retarget);
		themeWatch.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme"],
		});

		fit();
		settle();
		last = performance.now();
		frame = window.requestAnimationFrame(paint);

		for (const player of players) {
			player.addEventListener("loadedmetadata", fit);
		}
		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", settle);

		return () => {
			if (frame) window.cancelAnimationFrame(frame);
			themeWatch.disconnect();
			for (const player of players) {
				player.removeEventListener("loadedmetadata", fit);
			}
			window.removeEventListener("resize", onResize);
			document.removeEventListener("visibilitychange", settle);
		};
	}, [moving, wanted]);

	return (
		<div className={className} ref={holder} aria-hidden="true">
			{moving ? (
				<>
					{clips.map((clip) => (
						<video
							key={clip.theme}
							className="field-source"
							muted
							loop
							playsInline
							preload="auto"
						>
							{wanted.includes(clip.theme) ? (
								<>
									<source src={clip.src} type="video/mp4" />
									<source src={clip.alt} type="video/webm" />
								</>
							) : null}
						</video>
					))}
					<canvas className="field-canvas" ref={surface} />
				</>
			) : (
				clips.map((clip) => (
					<img
						key={clip.theme}
						className={clip.className}
						src={clip.poster}
						alt=""
					/>
				))
			)}

			{/* Sits over the field and under the page: see global.css. */}
			<div className="field-scrim" />
		</div>
	);
};
