"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * The ambient background: a slow plume of particles, tinted to the theme and
 * looping without a seam.
 *
 * Two clips rather than one clip and a tint layer. Each carries the field
 * green and its own theme's background already baked in, so crossing between
 * themes is a plain opacity fade the browser can interpolate; a blend mode
 * could tint a single clip, but blend modes do not animate, and the background
 * would snap while everything around it faded.
 *
 * Only the theme you are actually looking at is downloaded. The other clip
 * holds its poster until the first time you switch to it, which keeps a visit
 * that never touches the toggle to one clip instead of two.
 *
 * The clips are cut to a 320x180 grid and drawn without smoothing, so the
 * enlargement lands as square pixels rather than as the soft interpolation
 * that made the plume look like a mistake. Small enough, at that size, that
 * quality costs nothing.
 *
 * A visitor who asks for reduced motion is served the still frames alone and
 * never downloads a clip at all.
 */
type ThemeName = "dark" | "light";

const clips = [
	{
		theme: "dark" as ThemeName,
		src: "/field-dark.mp4",
		poster: "/field-dark.png",
		// Written out rather than built from the theme name: Tailwind only keeps
		// the classes it can find as whole strings in the source.
		className: "field-clip field-clip-dark",
	},
	{
		theme: "light" as ThemeName,
		src: "/field-light.mp4",
		poster: "/field-light.png",
		className: "field-clip field-clip-light",
	},
];

const readTheme = (): ThemeName =>
	document.documentElement.dataset.theme === "light" ? "light" : "dark";

export const Field: React.FC<{ className?: string }> = ({ className = "" }) => {
	const ref = useRef<HTMLDivElement>(null);
	// Both start false so the server and the first client render agree on the
	// still frames; the clips are swapped in once we know motion is welcome.
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
		const root = ref.current;
		if (!root || !moving) return;

		const players = Array.from(root.querySelectorAll("video"));

		const settle = () => {
			for (const player of players) {
				if (!player.getAttribute("src")) continue;
				if (document.hidden) {
					player.pause();
				} else {
					// A refused play() only means the browser declined autoplay, and
					// the poster frame stands in for it. Nothing to report.
					player.play().catch(() => undefined);
				}
			}
		};

		settle();
		document.addEventListener("visibilitychange", settle);
		return () => document.removeEventListener("visibilitychange", settle);
	}, [moving, wanted]);

	return (
		<div className={className} ref={ref} aria-hidden="true">
			{clips.map((clip) =>
				moving ? (
					<video
						key={clip.theme}
						className={clip.className}
						poster={clip.poster}
						// Held back until this theme is actually on screen.
						src={wanted.includes(clip.theme) ? clip.src : undefined}
						muted
						loop
						playsInline
						preload="auto"
					/>
				) : (
					<img
						key={clip.theme}
						className={clip.className}
						src={clip.poster}
						alt=""
					/>
				),
			)}

			{/* Sits over the clips and under the page: see global.css. */}
			<div className="field-scrim" />
		</div>
	);
};
