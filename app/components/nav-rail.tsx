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
 * The list of sections: a dot that fills in for the section you are on, a rule
 * that grows on hover, and the label. The home page lays this out inside its
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
							<span className="relative flex h-3 w-3 items-center justify-center">
								<span
									className={`block rounded-full transition-all duration-700 ease-out ${
										active
											? "h-2 w-2 bg-accent"
											: "h-1.5 w-1.5 bg-faint/60 group-hover:h-2 group-hover:w-2 group-hover:bg-muted"
									}`}
								/>
								{/* The section you are on pulses on its own; the others borrow
								    the same pulse while the pointer is on them, so every row
								    answers with the same gesture. Held at zero opacity
								    otherwise, since the keyframes carry their own. */}
								<span
									className={
										active
											? "absolute h-3 w-3 rounded-full border border-accent motion-safe:animate-halo"
											: "absolute h-3 w-3 rounded-full border border-muted opacity-0 motion-safe:group-hover:animate-halo"
									}
								/>
							</span>

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
