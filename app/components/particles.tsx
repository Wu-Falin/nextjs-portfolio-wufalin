"use client";

import React, { useEffect, useRef } from "react";

interface ParticlesProps {
	className?: string;
	/** Particles per million square pixels of canvas. */
	density?: number;
	/** Hard ceiling, so a 4K monitor does not spawn thousands of dots. */
	maxCount?: number;
}

/*
 * An ambient drift field.
 *
 * Each particle reads its heading from a slowly evolving 3D value-noise field
 * (x, y, time). Neighbouring particles therefore sample almost the same angle
 * and move together, which reads as a soft tinted current rather than
 * random jitter. The technique is the standard "flow field over Perlin/value
 * noise" recipe you find in generative art write-ups; the noise below is a
 * compact value-noise implementation with a fifth order fade curve.
 *
 * Colour comes from the theme: --field carries the RGB channels and
 * --field-opacity scales the whole field, which lets the same pigment sit at a
 * different weight on a near black background than on a near white one.
 *
 * Budget notes: capped device pixel ratio, capped particle count, a 30fps
 * throttle, no work while the tab is hidden, and a single static frame when the
 * visitor asks for reduced motion.
 */

const TAU = Math.PI * 2;
const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;
/** How tightly the field swirls. Smaller = broader, calmer currents. */
const FIELD_SCALE = 0.0016;
/** How fast the field itself morphs, per throttled frame. */
const FIELD_DRIFT = 0.0022;
const MAX_DPR = 1.5;
/** How far the field moves towards a new theme's colour per drawn frame. */
const TINT_EASE = 0.18;

// --- value noise ----------------------------------------------------------

const PERM = new Uint8Array(512);

(() => {
	// Deterministic shuffle, so the field looks the same on server-less reloads.
	const table = new Uint8Array(256);
	for (let i = 0; i < 256; i++) {
		table[i] = i;
	}
	let seed = 20240917;
	for (let i = 255; i > 0; i--) {
		seed = (seed * 1664525 + 1013904223) >>> 0;
		const j = seed % (i + 1);
		const swap = table[i];
		table[i] = table[j];
		table[j] = swap;
	}
	for (let i = 0; i < 512; i++) {
		PERM[i] = table[i & 255];
	}
})();

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const corner = (x: number, y: number, z: number) =>
	PERM[(PERM[(PERM[x & 255] + y) & 255] + z) & 255] / 255;

function noise3(x: number, y: number, z: number): number {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const zi = Math.floor(z);
	const u = fade(x - xi);
	const v = fade(y - yi);
	const w = fade(z - zi);

	const c000 = corner(xi, yi, zi);
	const c100 = corner(xi + 1, yi, zi);
	const c010 = corner(xi, yi + 1, zi);
	const c110 = corner(xi + 1, yi + 1, zi);
	const c001 = corner(xi, yi, zi + 1);
	const c101 = corner(xi + 1, yi, zi + 1);
	const c011 = corner(xi, yi + 1, zi + 1);
	const c111 = corner(xi + 1, yi + 1, zi + 1);

	const x00 = lerp(c000, c100, u);
	const x10 = lerp(c010, c110, u);
	const x01 = lerp(c001, c101, u);
	const x11 = lerp(c011, c111, u);

	return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}

// --- component ------------------------------------------------------------

type Particle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
	alpha: number;
	age: number;
	ttl: number;
	speed: number;
};

export default function Particles({
	className = "",
	density = 55,
	maxCount = 140,
}: ParticlesProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

		let width = 0;
		let height = 0;
		let dpr = 1;
		let particles: Particle[] = [];
		let fieldTime = 0;
		let frame = 0;
		let lastFrame = 0;
		// Held as numbers rather than a colour string so a theme change can be
		// crossed to over a few frames, matching the fade the rest of the page
		// does, instead of the field snapping to the new colour on its own.
		const tint = [128, 128, 128];
		const target = [128, 128, 128];
		let tintOpacity = 1;
		let targetOpacity = 1;

		const readTheme = () => {
			const styles = getComputedStyle(document.documentElement);
			// Fall back to the foreground colour rather than a fixed one: a missing
			// --field must not leave the field painting white onto a white page.
			const channels =
				styles.getPropertyValue("--field").trim() ||
				styles.getPropertyValue("--fg").trim();
			const parsed = channels.split(/[\s,]+/).map(Number);
			if (parsed.length === 3 && parsed.every(Number.isFinite)) {
				target[0] = parsed[0];
				target[1] = parsed[1];
				target[2] = parsed[2];
			}
			const opacity = Number.parseFloat(
				styles.getPropertyValue("--field-opacity"),
			);
			targetOpacity = Number.isFinite(opacity) ? opacity : 1;
		};

		/** Take the new colour immediately, with no cross fade. */
		const snapTint = () => {
			tint[0] = target[0];
			tint[1] = target[1];
			tint[2] = target[2];
			tintOpacity = targetOpacity;
		};

		const spawn = (fresh: boolean): Particle => ({
			x: Math.random() * width,
			y: Math.random() * height,
			vx: 0,
			vy: 0,
			radius: Math.random() * 1.05 + 0.65,
			// Kept clear of zero so no particle is drawn too faint to see; the
			// per theme --field-opacity is what dials the field back down.
			alpha: Math.random() * 0.42 + 0.28,
			// Stagger the initial ages so the first fade-in is not synchronised.
			age: fresh ? Math.random() * 240 : 0,
			ttl: 420 + Math.random() * 480,
			speed: 0.35 + Math.random() * 0.65,
		});

		const populate = () => {
			const target = Math.min(
				maxCount,
				Math.max(24, Math.round(((width * height) / 1_000_000) * density)),
			);
			particles = Array.from({ length: target }, () => spawn(true));
		};

		const resize = () => {
			width = container.clientWidth;
			height = container.clientHeight;
			dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			populate();
		};

		const step = () => {
			fieldTime += FIELD_DRIFT;

			tint[0] += (target[0] - tint[0]) * TINT_EASE;
			tint[1] += (target[1] - tint[1]) * TINT_EASE;
			tint[2] += (target[2] - tint[2]) * TINT_EASE;
			tintOpacity += (targetOpacity - tintOpacity) * TINT_EASE;

			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				// Two turns of the field give the current a little more character
				// than a single sweep from 0 to 2pi.
				const angle =
					noise3(p.x * FIELD_SCALE, p.y * FIELD_SCALE, fieldTime) * TAU * 2;

				// Ease towards the field heading instead of snapping to it.
				p.vx = p.vx * 0.94 + Math.cos(angle) * p.speed * 0.06;
				p.vy = p.vy * 0.94 + Math.sin(angle) * p.speed * 0.06;
				p.x += p.vx;
				p.y += p.vy;
				p.age += 1;

				const offscreen =
					p.x < -8 || p.x > width + 8 || p.y < -8 || p.y > height + 8;
				if (offscreen || p.age > p.ttl) {
					particles[i] = spawn(false);
				}
			}
		};

		const draw = () => {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = `rgb(${Math.round(tint[0])}, ${Math.round(
				tint[1],
			)}, ${Math.round(tint[2])})`;

			for (const p of particles) {
				// Fade in over the first ~2s and back out over the last ~2s of life.
				const rise = Math.min(p.age / 60, 1);
				const fall = Math.min((p.ttl - p.age) / 60, 1);
				const envelope = Math.max(0, Math.min(rise, fall));
				ctx.globalAlpha = p.alpha * envelope * tintOpacity;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, TAU);
				ctx.fill();
			}

			ctx.globalAlpha = 1;
		};

		const loop = (now: number) => {
			frame = window.requestAnimationFrame(loop);
			const elapsed = now - lastFrame;
			if (elapsed < FRAME_MS) return;
			lastFrame = now - (elapsed % FRAME_MS);
			step();
			draw();
		};

		const stop = () => {
			if (frame) {
				window.cancelAnimationFrame(frame);
				frame = 0;
			}
		};

		const start = () => {
			stop();
			if (reduceMotion.matches) {
				// One quiet, still frame: the texture without the movement.
				draw();
				return;
			}
			lastFrame = performance.now();
			frame = window.requestAnimationFrame(loop);
		};

		const onVisibility = () => {
			if (document.hidden) {
				stop();
			} else {
				start();
			}
		};

		const onResize = () => {
			resize();
			start();
		};

		// The tint lives in a CSS custom property, so follow theme changes.
		const themeObserver = new MutationObserver(() => {
			readTheme();
			// A still field has no frames to cross over, so it takes the new
			// colour at once and repaints.
			if (reduceMotion.matches) {
				snapTint();
				draw();
			}
		});
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		readTheme();
		snapTint();
		resize();
		start();

		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", onVisibility);
		reduceMotion.addEventListener("change", start);

		return () => {
			stop();
			themeObserver.disconnect();
			window.removeEventListener("resize", onResize);
			document.removeEventListener("visibilitychange", onVisibility);
			reduceMotion.removeEventListener("change", start);
		};
	}, [density, maxCount]);

	return (
		<div className={className} ref={containerRef} aria-hidden="true">
			<canvas ref={canvasRef} />
		</div>
	);
}
