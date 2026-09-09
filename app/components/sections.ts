/** The site's top level sections, in the order the side navigation lists them. */
export const sections = [
	{ href: "/", label: "index" },
	{ href: "/projects", label: "projects" },
	{ href: "/works", label: "works" },
	{ href: "/contact", label: "contact" },
] as const;

/** Which section a given pathname belongs to. */
export function activeSection(pathname: string): string {
	const match = sections
		.filter((section) => section.href !== "/")
		.find((section) => pathname.startsWith(section.href));

	return match?.href ?? "/";
}
