import React from "react";

type Props = {
	title: string;
	summary: string;
	index: number;
};

/**
 * One row of the works list. Deliberately quieter than a project row and
 * without a link, since none of these have anything to open yet.
 */
export const Entry: React.FC<Props> = ({ title, summary, index }) => {
	return (
		<li
			// Falls in behind the header, one row after another.
			style={
				{ "--reveal-delay": `${460 + index * 110}ms` } as React.CSSProperties
			}
			className="reveal border-b border-line"
		>
			<div className="flex items-baseline gap-6 py-10">
				<span className="on-field text-[11px] tabular-nums text-faint">
					{String(index + 1).padStart(2, "0")}
				</span>

				<div className="min-w-0 flex-1">
					<h2 className="on-field text-xl font-bold tracking-[-0.02em] text-muted sm:text-2xl">
						{title}
					</h2>

					<p className="on-field mt-3 text-[11px] uppercase tracking-[0.16em] text-faint">
						In progress
					</p>

					<p className="on-field mt-5 max-w-xl text-[0.9375rem] leading-[1.9] text-muted">
						{summary}
					</p>
				</div>
			</div>
		</li>
	);
};
