import Link from "next/link";
import React from "react";
import { NavRail } from "./components/nav-rail";

/** The profiles worth reaching from the front page. */
const elsewhere = [
	{ name: "GitHub", href: "https://github.com/Wu-Falin" },
	{
		name: "LinkedIn",
		href: "https://www.linkedin.com/in/ng-falin-493363260",
	},
];

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
					className="reveal text-[10px] uppercase tracking-[0.45em] text-faint"
				>
					Information Systems
				</p>

				<h1
					style={delay(200)}
					className="reveal mt-8 pb-[0.16em] text-[clamp(3.75rem,14vw,11rem)] font-light leading-[1.02] tracking-[0.015em] text-fg"
				>
					Ng Falin
				</h1>

				<p
					style={delay(340)}
					className="reveal mt-6 text-[0.8125rem] leading-relaxed tracking-[0.06em] text-muted"
				>
					Student &amp; aspiring penetration tester
				</p>

				<nav aria-label="Sections" className="mt-20 sm:mt-24">
					<NavRail stagger={480} />
				</nav>
			</div>

			<div className="mt-24 flex flex-col gap-12 lg:mt-0 lg:flex-row lg:items-end lg:justify-between">
				<div style={delay(840)} className="reveal space-y-3">
					{elsewhere.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noreferrer"
							className="block text-[10px] uppercase tracking-[0.28em] text-faint duration-300 hover:text-fg"
						>
							{link.name} <span aria-hidden="true">&rarr;</span>
						</Link>
					))}
					<p className="text-[10px] uppercase tracking-[0.28em] text-faint">
						&copy; Ng Falin
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
