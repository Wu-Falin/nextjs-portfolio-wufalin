import Link from "next/link";
import React from "react";
import { NavRail } from "./components/nav-rail";

/**
 * PLACEHOLDER COPY - draft lines, written to be rewritten. Each entry is its
 * own line: the block is a short statement, not a paragraph.
 */
const statement = [
	"Practical security skills, built by making things.",
	"Every project works through part of the OWASP guide.",
	"Notes and code stay public as I go.",
	"Open to junior roles and internships.",
];

/**
 * Each element declares when its entrance starts, so the page settles in
 * reading order: down the left column first, then the footer.
 */
const delay = (ms: number) =>
	({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export default function Home() {
	return (
		<main className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden px-10 pb-20 pt-16 sm:px-20 sm:pb-24 sm:pt-20 lg:px-28">
			{/* A hairline set in from the edge, framing the whole composition.
			    Absolute rather than fixed: on a short window the page scrolls, and
			    a frame pinned to the viewport would cut across its own content. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-5 z-30 border border-line sm:inset-7"
			/>

			<div>
				<p
					style={delay(80)}
					className="reveal font-mono text-[10px] uppercase tracking-[0.45em] text-faint"
				>
					Information Systems
				</p>

				<h1
					style={delay(200)}
					className="reveal mt-8 text-[clamp(3.75rem,14vw,11rem)] font-light leading-[0.88] tracking-[0.015em] text-fg"
				>
					Wu Falin
				</h1>

				<p
					style={delay(340)}
					className="reveal mt-5 text-[0.8125rem] leading-relaxed tracking-[0.02em] text-muted"
				>
					Student &amp; aspiring penetration tester
				</p>

				<nav aria-label="Sections" className="mt-20 sm:mt-24">
					<NavRail stagger={480} />
				</nav>
			</div>

			<div className="mt-24 flex flex-col gap-12 lg:mt-0 lg:flex-row lg:items-end lg:justify-between">
				<div style={delay(840)} className="reveal space-y-3">
					<Link
						href="https://github.com/Wu-Falin"
						target="_blank"
						rel="noreferrer"
						className="block text-[10px] uppercase tracking-[0.28em] text-faint duration-300 hover:text-fg"
					>
						GitHub <span aria-hidden="true">&rarr;</span>
					</Link>
					<p className="text-[10px] uppercase tracking-[0.28em] text-faint">
						&copy; Wu Falin
					</p>
				</div>

				<div style={delay(940)} className="reveal space-y-2 lg:text-right">
					{statement.map((line) => (
						<p
							key={line}
							className="text-[0.8125rem] leading-relaxed text-muted"
						>
							{line}
						</p>
					))}
				</div>
			</div>
		</main>
	);
}
