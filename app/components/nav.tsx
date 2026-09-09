"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { activeSection, sections } from "./sections";

/**
 * Top bar for narrow screens. On large screens the numbered rail on the left
 * takes over, so this collapses away.
 */
export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const pathname = usePathname() ?? "/";
	const current = activeSection(pathname);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref} className="lg:hidden">
			<div
				className={`fixed inset-x-0 top-0 z-30 border-b backdrop-blur duration-200 ${
					isIntersecting ? "border-transparent bg-bg/0" : "border-line bg-bg/80"
				}`}
			>
				<div className="container mx-auto flex flex-row-reverse items-center justify-between p-6">
					{/* Right padding keeps these clear of the fixed theme toggle. */}
					<div className="flex items-center gap-5 pr-14">
						{sections
							.filter((section) => section.href !== "/")
							.map((section) => (
								<Link
									key={section.href}
									href={section.href}
									aria-current={current === section.href ? "page" : undefined}
									className={`text-[11px] uppercase tracking-[0.2em] duration-200 ${
										current === section.href
											? "text-fg"
											: "text-faint hover:text-fg"
									}`}
								>
									{section.label}
								</Link>
							))}
					</div>

					<Link
						href="/"
						aria-label="Back to the index"
						className="text-muted duration-200 hover:text-fg"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</div>
			</div>
		</header>
	);
};
