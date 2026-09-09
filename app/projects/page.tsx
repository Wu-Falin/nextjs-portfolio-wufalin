import { allProjects } from "contentlayer/generated";
import React from "react";
import { getViews } from "@/util/redis";
import { Navigation } from "../components/nav";
import { Article } from "./article";

export const revalidate = 60;

/**
 * The section's entrance. Runs on arrival and again on every navigation back,
 * since the page is mounted fresh each time.
 */
const delay = (ms: number) =>
	({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export const metadata = {
	title: "Work",
	description:
		"Security tooling built to practise web application testing methodology.",
};

export default async function ProjectsPage() {
	const projects = allProjects
		.filter((project) => project.published)
		.sort(
			(a, b) =>
				new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
				new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
		);

	const views = await getViews(projects.map((project) => project.slug));

	return (
		<div className="relative min-h-screen">
			<Navigation />

			<main className="reading-ground mx-auto max-w-3xl px-6 pb-32 pt-36 lg:pt-44">
				<header>
					<p
						style={delay(80)}
						className="reveal on-field text-[10px] uppercase tracking-[0.45em] text-faint"
					>
						work
					</p>
					<h1
						style={delay(200)}
						className="reveal on-field mt-8 text-3xl font-medium tracking-[-0.02em] text-fg sm:text-4xl"
					>
						Projects
					</h1>
					<p
						style={delay(320)}
						className="reveal on-field mt-6 max-w-md text-[0.9375rem] leading-[1.9] text-muted"
					>
						Tools I build to work through web application testing methodology
						hands on. Each one maps to a section of the OWASP Web Security
						Testing Guide.
					</p>
				</header>

				<ol className="mt-20 border-t border-line">
					{projects.map((project, index) => (
						<Article
							key={project.slug}
							project={project}
							views={views[project.slug] ?? 0}
							index={index}
						/>
					))}
				</ol>
			</main>
		</div>
	);
}
