import Link from "next/link";
import React from "react";

const links = [
	{ name: "Projects", href: "/projects" },
	{ name: "Contact", href: "/contact" },
	{ name: "GitHub", href: "https://github.com/Wu-Falin", external: true },
];

/**
 * Each element of the hero declares when its entrance starts, so the stack
 * settles in reading order: label, rule, name, rule, tagline, then the links.
 */
const delay = (ms: number) =>
	({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export default function Home() {
	return (
		<main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-32">
			<p
				style={delay(120)}
				className="reveal font-mono text-[10px] uppercase tracking-[0.45em] text-faint"
			>
				Information Systems
			</p>

			<div
				style={delay(320)}
				className="reveal-rule mt-16 h-px w-full max-w-3xl origin-left rule-fade"
			/>

			<h1
				style={delay(420)}
				className="reveal py-12 text-center text-6xl font-medium tracking-[-0.03em] text-fg sm:py-16 sm:text-7xl md:text-8xl"
			>
				Falindo
			</h1>

			<div
				style={delay(520)}
				className="reveal-rule h-px w-full max-w-3xl origin-right rule-fade"
			/>

			<p
				style={delay(760)}
				className="reveal mt-16 max-w-lg text-center text-[0.9375rem] leading-[1.9] text-muted"
			>
				Building a security-focused portfolio while working toward a junior
				penetration tester role.
			</p>

			<nav className="mt-20">
				<ul className="flex items-center justify-center gap-10 sm:gap-12">
					{links.map((link, index) => (
						<li
							key={link.href}
							style={delay(980 + index * 120)}
							className="reveal"
						>
							<Link
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noreferrer" : undefined}
								className="text-[10px] uppercase tracking-[0.28em] text-faint duration-300 hover:text-fg"
							>
								{link.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</main>
	);
}
