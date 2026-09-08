"use client";

import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
	{ value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
	{ value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
];

const STORAGE_KEY = "theme";

function apply(theme: Theme) {
	const root = document.documentElement;
	root.classList.remove("theme-light", "theme-dark");
	root.classList.add(`theme-${theme}`);
	root.dataset.theme = theme;
	try {
		localStorage.setItem(STORAGE_KEY, theme);
	} catch {
		// Private mode, blocked storage: the choice just will not survive a reload.
	}
}

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
			className="flex items-center gap-0.5 rounded-full border border-line bg-bg/70 p-0.5 backdrop-blur"
			role="group"
			aria-label="Colour theme"
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
						className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
							active
								? "bg-accent/15 text-accent"
								: "text-faint hover:text-fg"
						}`}
					>
						{option.icon}
						<span className="sr-only">{option.label}</span>
					</button>
				);
			})}
		</div>
	);
};
