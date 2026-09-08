"use client";

import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useSpring,
} from "framer-motion";
import { PropsWithChildren } from "react";

/**
 * A bordered panel with a soft highlight that tracks the pointer. The highlight
 * is drawn from theme tokens, so it stays subtle in every theme.
 */
export const Card: React.FC<PropsWithChildren> = ({ children }) => {
	const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
	const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

	function onMouseMove({ currentTarget, clientX, clientY }: any) {
		const { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	const maskImage = useMotionTemplate`radial-gradient(220px at ${mouseX}px ${mouseY}px, white, transparent)`;
	const style = { maskImage, WebkitMaskImage: maskImage };

	return (
		<div
			onMouseMove={onMouseMove}
			className="group relative overflow-hidden rounded-lg border border-line duration-500 hover:border-muted/50"
		>
			<div className="pointer-events-none">
				<motion.div
					className="absolute inset-0 z-0 bg-fg/[0.04] opacity-0 transition duration-500 group-hover:opacity-100"
					style={style}
				/>
			</div>

			{children}
		</div>
	);
};
