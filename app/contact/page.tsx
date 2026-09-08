"use client";

import { Github, Linkedin, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Card } from "../components/card";
import { Navigation } from "../components/nav";

// Only real, verified handles belong here. Placeholder for later: a CV link or
// a security platform profile, once those URLs actually exist.
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
	{
		icon: <Linkedin size={18} />,
		href: "https://www.linkedin.com/in/ng-falin-493363260",
		label: "LinkedIn",
		handle: "ng-falin",
	},
	{
		icon: <Phone size={18} />,
		// tel: wants the number in international form with nothing between the
		// digits; the label keeps the spacing a person would read.
		href: "tel:+6285210812017",
		label: "Phone",
		handle: "(+62) 0852 1081 2017",
	},
];

/**
 * The section's entrance. Runs on arrival and again on every navigation back,
 * since the page is mounted fresh each time.
 */
const delay = (ms: number) =>
	({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export default function ContactPage() {
	return (
		<div className="relative min-h-screen">
			<Navigation />

			<main className="mx-auto max-w-3xl px-6 pb-32 pt-36 lg:pt-44">
				<header>
					<p
						style={delay(80)}
						className="reveal text-[10px] uppercase tracking-[0.45em] text-faint"
					>
						03 / contact
					</p>
					<h1
						style={delay(200)}
						className="reveal mt-8 text-3xl font-medium tracking-[-0.02em] text-fg sm:text-4xl"
					>
						Get in touch
					</h1>
					<p
						style={delay(320)}
						className="reveal mt-6 max-w-md text-[0.9375rem] leading-[1.9] text-muted"
					>
						Open to junior penetration testing roles, internships, and anything
						else where I can keep learning offensive security in practice.
					</p>
				</header>

				<div
					style={delay(460)}
					className="reveal mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2"
				>
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
									<span className="text-[11px] uppercase tracking-[0.2em] text-faint">
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
