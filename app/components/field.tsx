"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * The ambient background: a slow plume of particles, tinted to the theme and
 * looping without a seam.
 *
 * Two clips rather than one clip and a tint layer. Each carries its own colour
 * against its own theme's background, which means crossing between themes is
 * a plain opacity fade the browser can interpolate; a blend mode could tint a
 * single clip, but blend modes do not animate, and the swap would snap while
 * the rest of the page faded.
 *
 * A visitor who asks for reduced motion is served the still frame on its own
 * and never downloads the clips at all.
 */
const clips = [
	{
		theme: "dark",
		mp4: "/field-dark.mp4",
		webm: "/field-dark.webm",
		poster: "/field-dark.jpg",
		// Written out rather than built from the theme name: Tailwind only keeps
		// the classes it can find as whole strings in the source.
		className: "field-clip field-clip-dark",
	},
	{
		theme: "light",
		mp4: "/field-light.mp4",
		webm: "/field-light.webm",
		poster: "/field-light.jpg",
		className: "field-clip field-clip-light",
	},
] as const;

export const Field: React.FC<{ className?: string }> = ({ className = "" }) => {
	const ref = useRef<HTMLDivElement>(null);
	// Starts false so the server and the first client render agree on the still
	// frame; the clips are swapped in once we know motion is welcome.
	const [moving, setMoving] = useState(false);

	useEffect(() => {
		const quiet = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setMoving(!quiet.matches);
		sync();
		quiet.addEventListener("change", sync);
		return () => quiet.removeEventListener("change", sync);
	}, []);

	useEffect(() => {
		const root = ref.current;
		if (!root || !moving) return;

		const players = Array.from(root.querySelectorAll("video"));

		const settle = () => {
			for (const player of players) {
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
	}, [moving]);

	return (
		<div className={className} ref={ref} aria-hidden="true">
			{clips.map((clip) =>
				moving ? (
					<video
						key={clip.theme}
						className={clip.className}
						poster={clip.poster}
						muted
						loop
						playsInline
						preload="auto"
					>
						{/* H.264 first: every browser that ships it takes the smaller
						    file, and the VP9 copy covers builds without it. */}
						<source src={clip.mp4} type="video/mp4" />
						<source src={clip.webm} type="video/webm" />
					</video>
				) : (
					<img
						key={clip.theme}
						className={clip.className}
						src={clip.poster}
						alt=""
					/>
				),
			)}
		</div>
	);
};
