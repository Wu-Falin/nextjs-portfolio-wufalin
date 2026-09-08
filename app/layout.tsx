import "../global.css";
import { Inter } from "@next/font/google";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import Particles from "./components/particles";
import { SideNav } from "./components/side-nav";
import { ThemeToggle } from "./components/theme-toggle";

export const metadata: Metadata = {
	// Set NEXT_PUBLIC_SITE_URL once the site has a domain, so social cards
	// resolve against it instead of localhost.
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
	),
	title: {
		default: "Falindo",
		template: "%s | Falindo",
	},
	description:
		"Information Systems student building security tooling on the way to a junior penetration tester role.",
	openGraph: {
		title: "Falindo",
		description:
			"Information Systems student building security tooling on the way to a junior penetration tester role.",
		siteName: "Falindo",
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		shortcut: "/favicon.svg",
	},
};

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

/**
 * Runs before first paint so the stored theme is on <html> already and the page
 * never flashes the wrong palette. First time visitors follow their system
 * preference for light, and get the dark theme otherwise.
 */
const themeBootstrap = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"&&t!=="mono"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.classList.add("theme-"+t);document.documentElement.dataset.theme=t;}catch(e){document.documentElement.classList.add("theme-dark");document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<head>
				{/* biome-ignore lint: the theme has to be resolved before paint. */}
				<script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
				<Analytics />
			</head>
			<body className="bg-bg text-fg antialiased">
				<Particles className="pointer-events-none fixed inset-0 -z-10" />

				<SideNav />

				<div className="fixed right-6 top-6 z-40">
					<ThemeToggle />
				</div>

				{children}
			</body>
		</html>
	);
}
