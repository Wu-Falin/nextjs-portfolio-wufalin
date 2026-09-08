const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./mdx-components.tsx",
		"content/**/*.mdx",
	],

	theme: {
		extend: {
			// Semantic colours only - each one resolves to a themed custom property,
			// so the same class works in both light and dark.
			colors: {
				bg: "rgb(var(--bg) / <alpha-value>)",
				soft: "rgb(var(--bg-soft) / <alpha-value>)",
				fg: "rgb(var(--fg) / <alpha-value>)",
				muted: "rgb(var(--fg-muted) / <alpha-value>)",
				faint: "rgb(var(--fg-faint) / <alpha-value>)",
				line: "rgb(var(--line) / <alpha-value>)",
				accent: "rgb(var(--accent) / <alpha-value>)",
			},
			typography: {
				DEFAULT: {
					css: {
						"code::before": {
							content: '""',
						},
						"code::after": {
							content: '""',
						},
					},
				},
				quoteless: {
					css: {
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
			fontFamily: {
				sans: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
				mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
			},
			// The hero entrance lives in global.css, where it can be staggered with
			// a custom property and switched off cleanly for reduced motion.
			animation: {
				halo: "halo 3.5s ease-out infinite",
			},
			keyframes: {
				halo: {
					"0%": { opacity: "0.6", transform: "scale(0.6)" },
					"70%, 100%": { opacity: "0", transform: "scale(1.6)" },
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-debug-screens"),
	],
};
