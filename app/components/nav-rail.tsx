"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { activeSection, sections } from "./sections";

type Props = {
	/**
	 * When set, the rows fade in one after another starting at this delay in
	 * milliseconds. Left off, they are simply there.
	 */
	stagger?: number;
};

/**
 * The list of sections: a rule that lengthens for the section you are on and
 * grows on hover, and the label. The home page lays this out inside its
 * own left column; every other page pins it to the edge.
 */
export const NavRail: React.FC<Props> = ({ stagger }) => {
	const pathname = usePathname() ?? "/";
	const current = activeSection(pathname);

	return (
		<ol className="flex flex-col gap-9">
			{sections.map((section, index) => {
				const active = current === section.href;
				return (
					<li
						key={section.href}
						className={stagger === undefined ? undefined : "reveal"}
						style={
							stagger === undefined
								? undefined
								: ({
										"--reveal-delay": `${stagger + index * 110}ms`,
								  } as React.CSSProperties)
						}
					>
						<Link
							href={section.href}
							aria-current={active ? "page" : undefined}
							className="group flex items-center gap-4 transition-transform duration-500 ease-out hover:translate-x-1.5"
						>
							<span
								className={`h-px transition-all duration-700 ease-out ${
									active
										? "w-10 bg-accent/60"
										: "w-3 bg-line group-hover:w-8 group-hover:bg-muted/60"
								}`}
							/>

							<span
								className={`on-field text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 ${
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
	);
};
