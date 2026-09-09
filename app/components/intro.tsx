"use client";

import React, { useEffect } from "react";

/**
 * The opening title, and its hand off to the page.
 *
 * The markup ships on every load and stays hidden until the bootstrap script
 * marks the document for it, so a visitor whose script is blocked simply
 * arrives at the site rather than sitting behind a curtain that never lifts.
 * The curtain itself is a CSS animation that ends at zero opacity with no
 * pointer events, so there is no state in which it can cover the page.
 *
 * On top of that, the name walks from the middle of the curtain to where the
 * heading sits, growing and thinning as it goes. The heading itself makes that
 * walk - it is lifted over the curtain, carried back to the title's place and
 * released - rather than a copy walking there and handing over at the end. A
 * copy has to be positioned by matching font metrics, and any fraction it gets
 * wrong shows up as a jump exactly when the walk finishes; the real element
 * cannot land anywhere but where it belongs.
 *
 * Scale carries the size rather than font-size, so nothing below it reflows,
 * and weight rides alongside: a glyph set at the heading's size and scaled down
 * is the same shape as one set small, so the two match at the start without
 * having to be measured against each other.
 *
 * All of it is additive: if it never runs, the curtain still clears on its own
 * and the heading still arrives under its own entrance.
 */
const delay = (ms: number) =>
	({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

/** Matches the curtain's own timing in global.css. */
const TRAVEL_MS = 900;

/** The text's own box, rather than the block it sits in. */
const textRect = (el: Element) => {
	const range = document.createRange();
	range.selectNodeContents(el);
	return range.getBoundingClientRect();
};

export const Intro: React.FC = () => {
	useEffect(() => {
		const root = document.documentElement;
		// Absent when the visitor asked for reduced motion, or when this is a
		// move through the router rather than a load.
		if (!root.hasAttribute("data-intro")) return;

		const name = document.querySelector<HTMLElement>(".intro-name");
		const heading = document.querySelector<HTMLElement>(".hero-name");
		if (!name || !heading || typeof name.animate !== "function") return;

		let walked = false;

		const walk = () => {
			if (walked) return;
			walked = true;

			const from = textRect(name);
			const to = textRect(heading);
			const box = heading.getBoundingClientRect();
			if (!from.width || !to.width) return;

			const a = getComputedStyle(name);
			const b = getComputedStyle(heading);
			const shrink =
				Number.parseFloat(a.fontSize) / Number.parseFloat(b.fontSize);
			if (!Number.isFinite(shrink) || shrink <= 0) return;

			for (const running of heading.getAnimations()) running.cancel();
			// Scaled about the text's own corner, so that corner is the fixed point
			// and the offset below is simply the distance between the two.
			heading.style.transformOrigin = `${to.left - box.left}px ${
				to.top - box.top
			}px`;
			// Over the curtain for the length of the walk, so it is the same name
			// carrying on rather than a second one fading up behind the first.
			heading.style.position = "relative";
			heading.style.zIndex = "60";
			heading.style.opacity = "1";
			name.style.visibility = "hidden";

			const release = heading.animate(
				[
					{
						transform: `translate(${from.left - to.left}px, ${
							from.top - to.top
						}px) scale(${shrink})`,
						fontWeight: a.fontWeight,
					},
					{ transform: "none", fontWeight: b.fontWeight },
				],
				{
					duration: TRAVEL_MS,
					easing: "cubic-bezier(0.62, 0, 0.2, 1)",
					fill: "forwards",
				},
			);

			const land = () => {
				// Hand the element back to its own styles. Nothing moves: the walk
				// ended on the position the stylesheet already gives it.
				release.cancel();
				heading.style.transform = "";
				heading.style.transformOrigin = "";
				heading.style.fontWeight = "";
				heading.style.position = "";
				heading.style.zIndex = "";
				heading.style.opacity = "1";
			};

			release.finished.then(land, land);
		};

		// The curtain's own clear is the cue, so the two stay in step without
		// this having to guess at the delay.
		const curtain = document.querySelector<HTMLElement>(".intro");
		const onStart = (event: AnimationEvent) => {
			if (event.animationName === "intro-clear") walk();
		};
		curtain?.addEventListener("animationstart", onStart);

		// Hydration can land after the curtain has already begun clearing, in
		// which case that event is spent and the walk starts now.
		const clearing = curtain
			?.getAnimations()
			.find((a) => (a as CSSAnimation).animationName === "intro-clear");
		if (clearing && Number(clearing.currentTime ?? 0) > 1500) walk();

		return () => curtain?.removeEventListener("animationstart", onStart);
	}, []);

	return (
		<div
			aria-hidden="true"
			className="intro pointer-events-none fixed inset-0 z-50 items-center justify-center bg-bg px-10 text-center"
		>
			<p className="text-2xl tracking-[0.01em] sm:text-3xl">
				<span
					style={delay(200)}
					className="intro-word intro-name inline-block font-semibold text-fg"
				>
					Ng Falin
				</span>
				<span
					style={delay(700)}
					className="intro-word ml-4 inline-block font-light text-muted sm:ml-5"
				>
					Portfolio
				</span>
			</p>
		</div>
	);
};
