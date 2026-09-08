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
			// so the same class works in light, dark and mono.
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
			animation: {
				"fade-in": "fade-in 1.2s ease-out forwards",
				"fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
				sweep: "sweep 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
				halo: "halo 3.5s ease-out infinite",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(0.75rem)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				sweep: {
					"0%": { opacity: "0", transform: "scaleX(0)" },
					"100%": { opacity: "1", transform: "scaleX(1)" },
				},
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
