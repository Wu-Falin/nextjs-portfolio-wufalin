import type { Project } from "@/.contentlayer/generated";
import { Eye } from "lucide-react";
import Link from "next/link";

type Props = {
	project: Project;
	views: number;
	index: number;
};

/**
 * One row of the project list: the title carries the link, and a single quiet
 * line underneath holds the date and the tag it maps to.
 */
export const Article: React.FC<Props> = ({ project, views, index }) => {
	return (
		<li className="group border-b border-line">
			<Link href={`/projects/${project.slug}`} className="flex items-baseline gap-4 py-7">
				<span className="font-mono text-[11px] tabular-nums text-faint transition-colors duration-300 group-hover:text-accent">
					{String(index + 1).padStart(2, "0")}
				</span>

				<div className="min-w-0 flex-1">
					<h2 className="text-xl font-bold tracking-tight text-fg transition-colors duration-300 group-hover:text-accent sm:text-2xl">
						{project.title}
					</h2>

					<p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-faint">
						{project.date ? (
							<time dateTime={new Date(project.date).toISOString()}>
								{Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
									new Date(project.date),
								)}
							</time>
						) : (
							<span>Soon</span>
						)}
						{project.tag ? (
							<>
								<span aria-hidden="true" className="text-line">
									/
								</span>
								<span className="uppercase tracking-[0.12em]">{project.tag}</span>
							</>
						) : null}
					</p>
				</div>

				{views > 0 ? (
					<span className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-faint">
						<Eye className="h-3.5 w-3.5" />
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
					</span>
				) : null}
			</Link>
		</li>
	);
};
