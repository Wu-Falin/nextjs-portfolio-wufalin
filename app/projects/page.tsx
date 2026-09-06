import { allProjects } from "contentlayer/generated";
import React from "react";
import { getViews } from "@/util/redis";
import { Navigation } from "../components/nav";
import { Article } from "./article";

export const revalidate = 60;

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

			<main className="mx-auto max-w-3xl px-6 pb-24 pt-28 lg:pt-32">
				<header>
					<p className="font-mono text-[11px] uppercase tracking-[0.35em] text-faint">
						02 / work
					</p>
					<h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
						Projects
					</h1>
					<p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
						Tools I build to work through web application testing methodology
						hands on. Each one maps to a section of the OWASP Web Security
						Testing Guide.
					</p>
				</header>

				<ol className="mt-14 border-t border-line">
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
