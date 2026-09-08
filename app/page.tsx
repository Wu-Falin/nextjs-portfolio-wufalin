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
		<main className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden px-8 pb-14 pt-28 sm:px-12 sm:pt-32 lg:px-20 lg:pb-16">
			<div className="max-w-2xl">
				<p
					style={delay(120)}
					className="reveal font-mono text-[10px] uppercase tracking-[0.45em] text-faint"
				>
					Information Systems
				</p>

				<h1
					style={delay(260)}
					className="reveal mt-8 text-6xl font-medium leading-[0.95] tracking-[-0.04em] text-fg sm:text-7xl lg:text-8xl"
				>
					Falindo
				</h1>

				<p
					style={delay(420)}
					className="reveal mt-7 text-[0.9375rem] leading-relaxed text-muted"
				>
					Building security tooling toward a junior penetration tester role.
				</p>

				<nav aria-label="Sections" className="mt-16 sm:mt-20">
					<NavRail stagger={580} />
				</nav>
			</div>

			<div className="mt-24 flex flex-col gap-12 lg:mt-0 lg:flex-row lg:items-end lg:justify-between">
				<Link
					href="https://github.com/Wu-Falin"
					target="_blank"
					rel="noreferrer"
					style={delay(980)}
					className="reveal text-[10px] uppercase tracking-[0.28em] text-faint duration-300 hover:text-fg"
				>
					GitHub <span aria-hidden="true">&rarr;</span>
				</Link>

				<div style={delay(1100)} className="reveal space-y-2 lg:text-right">
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
