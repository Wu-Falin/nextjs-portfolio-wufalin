import type { Project } from "@/.contentlayer/generated";
import { Eye } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
	project: Project;
	views: number;
	index: number;
};

/**
 * One row of the project list: the title carries the link, and a single quiet
 * line underneath holds the tag it maps to.
 */
export const Article: React.FC<Props> = ({ project, views, index }) => {
	return (
		<li
			// Falls in behind the header, one row after another.
			style={
				{ "--reveal-delay": `${460 + index * 110}ms` } as React.CSSProperties
			}
			className="reveal group border-b border-line"
		>
			<Link
				href={`/projects/${project.slug}`}
				className="flex items-baseline gap-6 py-10"
			>
				<span className="text-[11px] tabular-nums text-faint transition-colors duration-300 group-hover:text-accent">
					{String(index + 1).padStart(2, "0")}
				</span>

				<div className="min-w-0 flex-1">
					<h2 className="text-xl font-bold tracking-[-0.02em] text-fg transition-colors duration-300 group-hover:text-accent sm:text-2xl">
						{project.title}
					</h2>

					{project.tag ? (
						<p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-faint">
							{project.tag}
						</p>
					) : null}
				</div>

				{views > 0 ? (
					<span className="flex shrink-0 items-center gap-1 text-[11px] text-faint">
						<Eye className="h-3.5 w-3.5" />
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
					</span>
				) : null}
			</Link>
		</li>
	);
};
