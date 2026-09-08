import React from "react";

/**
 * The opening title.
 *
 * This is plain markup on every page load and stays hidden until the bootstrap
 * script marks the document for it, so a visitor whose script is blocked simply
 * arrives at the site rather than sitting behind a curtain that never lifts.
 * It needs no client JavaScript of its own: the wipe is a CSS animation that
 * ends off screen, which means there is no state in which it can get stuck.
 */
const delay = (ms: number) =>
	({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export const Intro: React.FC = () => (
	<div
		aria-hidden="true"
		className="intro pointer-events-none fixed inset-0 z-50 items-center bg-bg px-10 sm:px-20 lg:px-28"
	>
		<p className="text-2xl tracking-[0.01em] sm:text-3xl">
			<span
				style={delay(200)}
				className="intro-word inline-block font-semibold text-fg"
			>
				Wu Falin
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
