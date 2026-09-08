"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { activeSection, sections } from "./sections";

/**
 * A slim numbered rail pinned to the left edge on wide screens. Each entry
 * carries its index, a dot that fills in for the section you are on, and a
 * short rule that grows on hover. Small screens get the top bar instead.
 */
export const SideNav: React.FC = () => {
	const pathname = usePathname() ?? "/";
	const current = activeSection(pathname);

	return (
		<nav
			aria-label="Sections"
			className="fixed left-10 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-16"
		>
			<ol className="flex flex-col gap-9">
				{sections.map((section, index) => {
					const active = current === section.href;
					return (
						<li key={section.href}>
							<Link
								href={section.href}
								aria-current={active ? "page" : undefined}
								className="group flex items-center gap-4"
							>
								<span
									className={`w-5 font-mono text-[10px] tabular-nums transition-colors duration-300 ${
										active ? "text-accent" : "text-faint group-hover:text-muted"
									}`}
								>
									{String(index + 1).padStart(2, "0")}
								</span>

								<span className="relative flex h-3 w-3 items-center justify-center">
									<span
										className={`block rounded-full transition-all duration-300 ${
											active
												? "h-2 w-2 bg-accent"
												: "h-1.5 w-1.5 bg-faint/60 group-hover:bg-muted"
										}`}
									/>
									{active ? (
										<span className="absolute h-3 w-3 rounded-full border border-accent motion-safe:animate-halo" />
									) : null}
								</span>

								<span
									className={`h-px transition-all duration-300 ${
										active
											? "w-6 bg-accent/60"
											: "w-3 bg-line group-hover:w-6 group-hover:bg-muted/60"
									}`}
								/>

								<span
									className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
										active ? "text-fg" : "text-faint group-hover:text-muted"
									}`}
								>
									{section.label}
								</span>
							</Link>
						</li>
					);
				})}
			</ol>
		</nav>
	);
};
