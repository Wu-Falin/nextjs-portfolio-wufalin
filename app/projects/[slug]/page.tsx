import { allProjects } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Mdx } from "@/app/components/mdx";
import { getView } from "@/util/redis";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";

export const revalidate = 60;

type Props = {
	params: {
		slug: string;
	};
};

export async function generateStaticParams(): Promise<Props["params"][]> {
	return allProjects
		.filter((p) => p.published)
		.map((p) => ({
			slug: p.slug,
		}));
}

export async function generateMetadata({ params }: Props) {
	const project = allProjects.find((p) => p.slug === params?.slug);
	if (!project) {
		return {};
	}
	return {
		title: project.title,
		description: project.description,
	};
}

export default async function PostPage({ params }: Props) {
	const slug = params?.slug;
	const project = allProjects.find((project) => project.slug === slug);

	if (!project) {
		notFound();
	}

	const views = await getView(slug);

	return (
		<div className="min-h-screen">
			{/* Pass only what the header renders, so unused frontmatter (the sort
			    order date) never reaches the client payload. */}
			<Header
				project={{
					title: project.title,
					description: project.description,
					url: project.url,
					repository: project.repository,
					tag: project.tag,
				}}
				views={views}
			/>
			<ReportView slug={project.slug} />

			<article className="mx-auto max-w-3xl px-6 py-16">
				<div className="prose prose-quoteless prose-theme">
					<Mdx code={project.body.code} />
				</div>
			</article>
		</div>
	);
}
