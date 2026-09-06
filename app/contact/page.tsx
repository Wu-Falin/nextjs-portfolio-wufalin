"use client";

import { Github, Mail } from "lucide-react";
import Link from "next/link";
import { Card } from "../components/card";
import { Navigation } from "../components/nav";

// Only real, verified handles belong here. Placeholder for later: add LinkedIn,
// a CV link, or a security platform profile once those URLs actually exist.
const socials = [
	{
		icon: <Mail size={18} />,
		href: "mailto:valynndo@gmail.com",
		label: "Email",
		handle: "valynndo@gmail.com",
	},
	{
		icon: <Github size={18} />,
		href: "https://github.com/Wu-Falin",
		label: "GitHub",
		handle: "Wu-Falin",
	},
];

export default function ContactPage() {
	return (
		<div className="relative min-h-screen">
			<Navigation />

			<main className="mx-auto max-w-3xl px-6 pb-24 pt-28 lg:pt-32">
				<header>
					<p className="font-mono text-[11px] uppercase tracking-[0.35em] text-faint">
						03 / contact
					</p>
					<h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
						Get in touch
					</h1>
					<p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
						Open to junior penetration testing roles, internships, and anything
						else where I can keep learning offensive security in practice.
					</p>
				</header>

				<div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{socials.map((social) => (
						<Card key={social.label}>
							<Link
								href={social.href}
								target={social.href.startsWith("http") ? "_blank" : undefined}
								rel={social.href.startsWith("http") ? "noreferrer" : undefined}
								className="relative flex flex-col gap-6 p-8"
							>
								<span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted duration-500 group-hover:border-accent/60 group-hover:text-accent">
									{social.icon}
								</span>

								<span className="relative z-10 flex flex-col gap-1">
									<span className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
										{social.label}
									</span>
									<span className="break-all text-base font-medium text-fg duration-500 group-hover:text-accent">
										{social.handle}
									</span>
								</span>
							</Link>
						</Card>
					))}
				</div>
			</main>
		</div>
	);
}
