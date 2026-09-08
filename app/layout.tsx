import "../global.css";
import { Inter } from "@next/font/google";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { Intro } from "./components/intro";
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
		default: "Wu Falin",
		template: "%s | Wu Falin",
	},
	description:
		"Information Systems student building security tooling on the way to a junior penetration tester role.",
	openGraph: {
		title: "Wu Falin",
		description:
			"Information Systems student building security tooling on the way to a junior penetration tester role.",
		siteName: "Wu Falin",
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
 *
 * It also decides whether the opening title plays: only on a full load of the
 * home page, and never for a visitor who asks for reduced motion. --intro-hold
 * keeps the page's own entrance behind the curtain, and is cleared once
 * everything has landed so a later visit through the router is not delayed.
 */
const themeBootstrap = `(function(){var r=document.documentElement;try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}r.classList.add("theme-"+t);r.dataset.theme=t;}catch(e){r.classList.add("theme-dark");r.dataset.theme="dark";}try{if(location.pathname==="/"&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){r.dataset.intro="";r.style.setProperty("--intro-hold","1500ms");setTimeout(function(){r.style.removeProperty("--intro-hold");},4000);}}catch(e){}})();`;

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
				{/* First in the body so the curtain is parsed and painted before
				    anything it is meant to cover. */}
				<Intro />

				<Particles className="pointer-events-none fixed inset-0 -z-10" />

				<SideNav />
				<ThemeToggle />

				{children}
			</body>
		</html>
	);
}
