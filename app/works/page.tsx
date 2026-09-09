import React from "react";
import { Navigation } from "../components/nav";
import { Entry } from "./entry";

/**
 * The section's entrance. Runs on arrival and again on every navigation back,
 * since the page is mounted fresh each time.
 */
const delay = (ms: number) =>
	({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export const metadata = {
	title: "Works",
	description: "Security work currently underway, ahead of being written up.",
};

const works = [
	{
		title: "University Network Security Assessment",
		summary:
			"Scoping an authorized security assessment for my university's IT faculty network, currently finalizing scope and approval with faculty stakeholders.",
	},
	{
		title: "OWASP Juice Shop — WSTG-Mapped Pentest",
		summary:
			"Working through a full penetration test against a self-hosted Juice Shop instance, documenting each finding against the OWASP Web Security Testing Guide.",
	},
	{
		title: "Hack The Box",
		summary:
			"Building hands-on exploitation experience through HTB machines as ongoing practice.",
	},
];

export default function WorksPage() {
	return (
		<div className="relative min-h-screen">
			<Navigation />

			<main className="reading-ground mx-auto max-w-3xl px-6 pb-32 pt-36 lg:pt-44">
				<header>
					<p
						style={delay(80)}
						className="reveal on-field text-[10px] uppercase tracking-[0.45em] text-faint"
					>
						works
					</p>
					<h1
						style={delay(200)}
						className="reveal on-field mt-8 text-3xl font-medium tracking-[-0.02em] text-fg sm:text-4xl"
					>
						Works
					</h1>
					<p
						style={delay(320)}
						className="reveal on-field mt-6 max-w-md text-[0.9375rem] leading-[1.9] text-muted"
					>
						Things I&apos;m actively working on, not finished yet &mdash; check
						back as these get written up properly.
					</p>
				</header>

				<ol className="mt-20 border-t border-line">
					{works.map((work, index) => (
						<Entry
							key={work.title}
							title={work.title}
							summary={work.summary}
							index={index}
						/>
					))}
				</ol>
			</main>
		</div>
	);
}
