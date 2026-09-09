"use client";

import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

export type Theme = "light" | "dark";

/** Listed in the order they read from the bottom of the vertical rail up. */
export const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] =
	[
		{ value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
		{ value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
	];

const STORAGE_KEY = "theme";

/** Matches the fade length in global.css, with a little slack on the end. */
const SWITCH_MS = 480;

let switchTimer: number | undefined;

function apply(theme: Theme) {
	const root = document.documentElement;

	// Arm the cross fade first and flush it, so the browser has the transition
	// in hand before the palette changes underneath it rather than in the same
	// style pass. Taken off again once the fade is done, so it never slows the
	// ordinary hover transitions.
	root.classList.add("theme-switching");
	root.getBoundingClientRect();
	window.clearTimeout(switchTimer);
	switchTimer = window.setTimeout(() => {
		root.classList.remove("theme-switching");
	}, SWITCH_MS);

	root.classList.remove("theme-light", "theme-dark");
	root.classList.add(`theme-${theme}`);
	root.dataset.theme = theme;
	try {
		localStorage.setItem(STORAGE_KEY, theme);
	} catch {
		// Private mode, blocked storage: the choice just will not survive a reload.
	}
}

/**
 * Set in the bottom left margin as a pair of upright labels, each with a small
 * square that fills for the theme you are on. Narrow screens have no margin to
 * spare: there it shrinks to two icons in the top corner, narrow enough to sit
 * beside the section links in the top bar rather than across them.
 */
export const ThemeToggle: React.FC = () => {
	// Rendered inert on the server; the inline bootstrap script in the document
	// head has already picked a theme by the time this hydrates.
	const [theme, setTheme] = useState<Theme | null>(null);

	useEffect(() => {
		const current = document.documentElement.dataset.theme as Theme | undefined;
		setTheme(current ?? "dark");
	}, []);

	const select = (next: Theme) => {
		apply(next);
		setTheme(next);
	};

	return (
		<div
			role="group"
			aria-label="Colour theme"
			className="fixed right-6 top-5 z-40 flex items-center gap-3 sm:bottom-12 sm:left-11 sm:right-auto sm:top-auto sm:gap-5 sm:flex-col-reverse sm:items-start"
		>
			{THEMES.map((option) => {
				const active = theme === option.value;
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => select(option.value)}
						aria-pressed={active}
						title={option.label}
						className="group flex items-center gap-2 sm:flex-col-reverse sm:gap-3"
					>
						<span
							className={`hidden h-[7px] w-[7px] border transition-colors duration-300 sm:block ${
								active
									? "border-accent bg-accent"
									: "border-faint/70 group-hover:border-muted"
							}`}
						/>
						<span
							className={`on-field transition-colors duration-300 sm:hidden ${
								active ? "text-accent" : "text-faint"
							}`}
						>
							{option.icon}
						</span>
						<span
							className={`on-field hidden text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 sm:block sm:rotate-180 sm:[writing-mode:vertical-rl] ${
								active ? "text-fg" : "text-faint group-hover:text-muted"
							}`}
						>
							{option.label}
						</span>
						<span className="sr-only">{option.label}</span>
					</button>
				);
			})}
		</div>
	);
};
