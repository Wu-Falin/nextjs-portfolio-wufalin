"use client";

import { usePathname } from "next/navigation";
import React from "react";

/**
 * A hairline that draws itself across the top of the window each time the
 * section changes. Keyed on the path so it is a fresh element per navigation,
 * which is what makes the animation run again rather than sit finished.
 */
export const RouteSweep: React.FC = () => {
	const pathname = usePathname() ?? "/";
	return <span key={pathname} className="route-sweep" aria-hidden="true" />;
};
