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
 * heading sits, growing and thinning as it goes. That part is scripted, and
 * deliberately additive: if it never runs, the curtain still clears on its own
 * and the heading still arrives under its own entrance.
 */
const delay = (ms: number) =>
	({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

/** Matches the curtain's own timing in global.css. */
const TRAVEL_MS = 900;
const SETTLE_MS = 180;

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

		let flier: HTMLElement | null = null;
		let started = false;

		const walk = () => {
			if (started) return;
			started = true;

			const from = textRect(name);
			const to = textRect(heading);
			if (!from.width || !to.width) return;

			const a = getComputedStyle(name);
			const b = getComputedStyle(heading);

			// The heading holds still and empty until the walk lands on it.
			for (const running of heading.getAnimations()) running.cancel();
			heading.style.opacity = "0";

			flier = document.createElement("span");
			flier.textContent = name.textContent;
			flier.setAttribute("aria-hidden", "true");
			// Parked where the heading will be, then carried back to the middle,
			// so it arrives on the heading's own left edge rather than near it.
			flier.style.cssText = `position:fixed;left:${to.left}px;top:${to.top}px;z-index:60;pointer-events:none;white-space:nowrap;font-family:${a.fontFamily};margin:0;`;
			document.body.appendChild(flier);
			name.style.visibility = "hidden";

			const travel = flier.animate(
				[
					{
						transform: `translate(${from.left - to.left}px, ${
							from.top - to.top
						}px)`,
						fontSize: a.fontSize,
						fontWeight: a.fontWeight,
						letterSpacing: a.letterSpacing,
						lineHeight: a.lineHeight,
						color: a.color,
					},
					{
						transform: "translate(0px, 0px)",
						fontSize: b.fontSize,
						fontWeight: b.fontWeight,
						letterSpacing: b.letterSpacing,
						lineHeight: b.lineHeight,
						color: b.color,
					},
				],
				{
					duration: TRAVEL_MS,
					easing: "cubic-bezier(0.62, 0, 0.2, 1)",
					fill: "forwards",
				},
			);

			travel.finished
				.then(() => {
					// The two are the same words at the same size by now, so this only
					// has to cover whatever fraction of a pixel they disagree on.
					heading.animate([{ opacity: 0 }, { opacity: 1 }], {
						duration: SETTLE_MS,
						fill: "forwards",
					});
					heading.style.opacity = "1";
					flier
						?.animate([{ opacity: 1 }, { opacity: 0 }], {
							duration: SETTLE_MS,
							fill: "forwards",
						})
						.finished.then(() => flier?.remove());
				})
				.catch(() => {
					// Interrupted, by a resize or by leaving the page. Put the heading
					// back rather than leaving it blank.
					heading.style.opacity = "1";
					flier?.remove();
				});
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
