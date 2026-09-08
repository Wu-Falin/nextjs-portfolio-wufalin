"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { NavRail } from "./nav-rail";

/**
 * The rail pinned to the left edge on wide screens. The home page lays the same
 * rail out inline as part of its own column, so this stays out of its way; on
 * small screens the top bar takes over instead.
 */
export const SideNav: React.FC = () => {
	const pathname = usePathname() ?? "/";
	if (pathname === "/") return null;

	return (
		<nav
			aria-label="Sections"
			className="fixed left-10 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-16"
		>
			<NavRail />
		</nav>
	);
};
