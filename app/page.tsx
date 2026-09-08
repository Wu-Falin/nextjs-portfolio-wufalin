import Link from "next/link";
import React from "react";

const links = [
	{ name: "Projects", href: "/projects" },
	{ name: "Contact", href: "/contact" },
	{ name: "GitHub", href: "https://github.com/Wu-Falin", external: true },
];

export default function Home() {
	return (
		<main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6">
			<p className="mb-10 font-mono text-[11px] uppercase tracking-[0.35em] text-faint animate-fade-in">
				Information Systems
			</p>

			<div className="h-px w-full max-w-3xl origin-left rule-fade animate-sweep" />

			<h1 className="py-6 text-center text-5xl font-semibold tracking-tight text-fg animate-fade-up sm:text-7xl md:text-8xl">
				Falindo
			</h1>

			<div className="h-px w-full max-w-3xl origin-right rule-fade animate-sweep" />

			<p className="mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted animate-fade-in">
				Building a security-focused portfolio while working toward a junior
				penetration tester role.
			</p>

			<nav className="mt-12 animate-fade-in">
				<ul className="flex items-center justify-center gap-8">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noreferrer" : undefined}
								className="text-[11px] uppercase tracking-[0.2em] text-faint duration-300 hover:text-fg"
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
