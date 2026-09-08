"use client";

import { ArrowLeft, Eye, Github } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type Props = {
	project: {
		url?: string;
		title: string;
		description: string;
		repository?: string;
		tag?: string;
	};

	views: number;
};

export const Header: React.FC<Props> = ({ project, views }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	const links: { label: string; href: string }[] = [];
	if (project.repository) {
		links.push({
			label: "Repository",
			href: `https://github.com/${project.repository}`,
		});
	}
	if (project.url) {
		links.push({
			label: "Website",
			href: project.url,
		});
	}

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref} className="relative isolate border-b border-line">
			<div
				className={`fixed inset-x-0 top-0 z-30 border-b backdrop-blur duration-200 ${
					isIntersecting ? "border-transparent bg-bg/0" : "border-line bg-bg/80"
				}`}
			>
				<div className="container mx-auto flex flex-row-reverse items-center justify-between p-6">
					<div className="flex items-center gap-6 pr-32">
						<span
							title="Views of this page"
							className="flex items-center gap-1 font-mono text-[11px] text-faint"
						>
							<Eye className="h-4 w-4" />
							{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
						</span>
						<Link
							target="_blank"
							rel="noreferrer"
							href="https://github.com/Wu-Falin"
							aria-label="GitHub profile"
							className="text-faint duration-200 hover:text-fg"
						>
							<Github className="h-4 w-4" />
						</Link>
					</div>

					<Link
						href="/projects"
						aria-label="Back to the project list"
						className="text-muted duration-200 hover:text-fg"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</div>
			</div>

			<div className="mx-auto max-w-3xl px-6 pb-16 pt-32">
				{project.tag ? (
					<p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
						{project.tag}
					</p>
				) : null}

				<h1 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-5xl">
					{project.title}
				</h1>

				<p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
					{project.description}
				</p>

				{links.length > 0 ? (
					<div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
						{links.map((link) => (
							<Link
								target="_blank"
								rel="noreferrer"
								key={link.label}
								href={link.href}
								className="text-[11px] uppercase tracking-[0.2em] text-faint duration-300 hover:text-accent"
							>
								{link.label} <span aria-hidden="true">&rarr;</span>
							</Link>
						))}
					</div>
				) : null}
			</div>
		</header>
	);
};
