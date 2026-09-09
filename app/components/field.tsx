"use client";

import React, { useEffect, useRef } from "react";

/*
 * The ambient background: a drifting field of particles, drawn rather than
 * filmed.
 *
 * A clip of this is capped at its own resolution, and full bleed the browser
 * has to stretch it - which is what turned every particle into a smudge on a
 * dense screen. Drawing to a canvas sized in device pixels means each particle
 * is placed at whatever density the display actually has, so it stays a point
 * at 1x, 2x or 4k, and the whole thing costs a few kilobytes instead of a few
 * megabytes.
 *
 * Motion comes from a curl noise flow field: velocity is taken as the curl of
 * a scalar potential, which makes it divergence free, so particles wind around
 * each other in filaments instead of collecting in sinks. Neighbours read
 * almost the same heading, which is what reads as a current rather than
 * scattered drift.
 */

/** Backing store cap, so a 3x phone does not render nine times the pixels. */
const MAX_DPR = 2;
/**
 * Share of the existing trail erased per sixtieth of a second. High enough
 * that a particle leaves a short wisp rather than a long comb stroke: the
 * subject is the specks, not the paths they took.
 */
const FADE = 0.17;
/** Spatial frequency of the flow. Smaller is broader and calmer. */
const FIELD_SCALE = 0.0021;
/** A finer second turn of the field, to break up the broad one. */
const DETAIL_SCALE = 0.0075;
/** How fast the flow itself evolves, per millisecond. */
const FIELD_DRIFT = 0.00006;
/** Base travel in CSS pixels per second. */
const SPEED = 21;
/** One particle per this many square CSS pixels. */
const DENSITY = 135;
const MAX_PARTICLES = 12000;
/** Frequency of the masses particles gather into. */
const CLUMP_SCALE = 0.0016;
/** How far each particle is allowed to wander off the shared heading. */
const WANDER = 0.55;
/** How far the colour moves toward a new theme each frame. */
const TINT_EASE = 0.09;

// --- value noise -----------------------------------------------------------

const PERM = new Uint8Array(512);

(() => {
	// Deterministic shuffle, so the field looks the same on every reload.
	const table = new Uint8Array(256);
	for (let i = 0; i < 256; i++) table[i] = i;
	let seed = 20240917;
	for (let i = 255; i > 0; i--) {
		seed = (seed * 1664525 + 1013904223) >>> 0;
		const j = seed % (i + 1);
		const swap = table[i];
		table[i] = table[j];
		table[j] = swap;
	}
	for (let i = 0; i < 512; i++) PERM[i] = table[i & 255];
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

	const x00 = lerp(corner(xi, yi, zi), corner(xi + 1, yi, zi), u);
	const x10 = lerp(corner(xi, yi + 1, zi), corner(xi + 1, yi + 1, zi), u);
	const x01 = lerp(corner(xi, yi, zi + 1), corner(xi + 1, yi, zi + 1), u);
	const x11 = lerp(
		corner(xi, yi + 1, zi + 1),
		corner(xi + 1, yi + 1, zi + 1),
		u,
	);

	return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}

// --- component -------------------------------------------------------------

type Particle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	age: number;
	ttl: number;
	size: number;
	alpha: number;
	speed: number;
	bias: number;
};

export const Field: React.FC<{ className?: string }> = ({ className = "" }) => {
	const holder = useRef<HTMLDivElement>(null);
	const surface = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const box = holder.current;
		const canvas = surface.current;
		if (!box || !canvas) return;

		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;

		const quiet = window.matchMedia("(prefers-reduced-motion: reduce)");

		let width = 0;
		let height = 0;
		let particles: Particle[] = [];
		let flowTime = 0;
		let frame = 0;
		let last = 0;

		const tint = [120, 200, 165];
		const target = [120, 200, 165];
		let strength = 1;
		let targetStrength = 1;

		const readTheme = () => {
			const styles = getComputedStyle(document.documentElement);
			const channels = (
				styles.getPropertyValue("--field").trim() ||
				styles.getPropertyValue("--fg").trim()
			)
				.split(/[\s,]+/)
				.map(Number);
			if (channels.length === 3 && channels.every(Number.isFinite)) {
				target[0] = channels[0];
				target[1] = channels[1];
				target[2] = channels[2];
			}
			const alpha = Number.parseFloat(styles.getPropertyValue("--field-alpha"));
			targetStrength = Number.isFinite(alpha) ? alpha : 1;
		};

		const snapTint = () => {
			tint[0] = target[0];
			tint[1] = target[1];
			tint[2] = target[2];
			strength = targetStrength;
		};

		const place = (p: Particle, seeded: boolean) => {
			// Weighted toward the lower right, which leaves the upper left - where
			// the name and the rail sit - open without needing a heavy scrim.
			// Rejection sampled against a slow field on top of that, so particles
			// gather into masses with clear space between them the way a plume
			// does, instead of spreading evenly over the page.
			let x = width * Math.sqrt(Math.random());
			let y = height * Math.sqrt(Math.random());
			for (let tries = 0; tries < 6; tries++) {
				if (noise3(x * CLUMP_SCALE, y * CLUMP_SCALE, flowTime * 0.35) > 0.44) {
					break;
				}
				x = width * Math.sqrt(Math.random());
				y = height * Math.sqrt(Math.random());
			}
			p.x = x;
			p.y = y;
			p.vx = 0;
			p.vy = 0;
			p.age = seeded ? Math.random() * 220 : 0;
			p.ttl = 130 + Math.random() * 260;
			p.size = 0.5 + Math.random() ** 1.7 * 1.6;
			p.alpha = 0.35 + Math.random() * 0.65;
			p.speed = 0.35 + Math.random() * 1.1;
			// A fixed lean of its own, so neighbours sharing a heading still
			// separate instead of combing into one stroke.
			p.bias = (Math.random() - 0.5) * WANDER;
		};

		const populate = () => {
			const want = Math.min(
				MAX_PARTICLES,
				Math.max(300, Math.round((width * height) / DENSITY)),
			);
			particles = Array.from({ length: want }, () => {
				const p = {} as Particle;
				place(p, true);
				return p;
			});
		};

		const resize = () => {
			width = box.clientWidth;
			height = box.clientHeight;
			const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			// Work in CSS pixels; the backing store keeps the device's density, so
			// a particle lands on a real pixel rather than a stretched one.
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			populate();
		};

		const step = (dt: number) => {
			flowTime += FIELD_DRIFT * dt;

			tint[0] += (target[0] - tint[0]) * TINT_EASE;
			tint[1] += (target[1] - tint[1]) * TINT_EASE;
			tint[2] += (target[2] - tint[2]) * TINT_EASE;
			strength += (targetStrength - strength) * TINT_EASE;

			const travel = (SPEED * dt) / 1000;
			// Ease toward the field heading rather than snapping to it, framerate
			// independent so the motion is the same on a 60 and a 120hz screen.
			const turn = 1 - Math.exp(-dt / 90);

			for (const p of particles) {
				const nUp = noise3(
					p.x * FIELD_SCALE,
					(p.y + 1.2) * FIELD_SCALE,
					flowTime,
				);
				const nDown = noise3(
					p.x * FIELD_SCALE,
					(p.y - 1.2) * FIELD_SCALE,
					flowTime,
				);
				const nRight = noise3(
					(p.x + 1.2) * FIELD_SCALE,
					p.y * FIELD_SCALE,
					flowTime,
				);
				const nLeft = noise3(
					(p.x - 1.2) * FIELD_SCALE,
					p.y * FIELD_SCALE,
					flowTime,
				);

				// Curl of the potential, so the flow is divergence free.
				let dx = nUp - nDown;
				let dy = -(nRight - nLeft);
				const len = Math.hypot(dx, dy);
				if (len > 0.00001) {
					dx /= len;
					dy /= len;
				}

				// Turn by this particle's own lean plus a finer turn of the field,
				// which is what keeps the cloud churning rather than streaming.
				const detail =
					noise3(
						p.x * DETAIL_SCALE,
						p.y * DETAIL_SCALE,
						flowTime * 2.4 + 31.7,
					) - 0.5;
				const swing = p.bias + detail * 1.7;
				const cos = Math.cos(swing);
				const sin = Math.sin(swing);
				const ax = dx * cos - dy * sin;
				const ay = dx * sin + dy * cos;

				p.vx += (ax - p.vx) * turn;
				p.vy += (ay - p.vy) * turn;
				p.x += p.vx * travel * p.speed;
				p.y += p.vy * travel * p.speed;
				p.age += dt / 16.6667;

				if (
					p.age > p.ttl ||
					p.x < -12 ||
					p.x > width + 12 ||
					p.y < -12 ||
					p.y > height + 12
				) {
					place(p, false);
				}
			}
		};

		const draw = (dt: number) => {
			// Erase a slice of what is already there instead of clearing: the
			// residue is what draws the filaments out behind each particle.
			const erase = 1 - (1 - FADE) ** (dt / 16.6667);
			ctx.globalCompositeOperation = "destination-out";
			ctx.globalAlpha = 1;
			ctx.fillStyle = `rgba(0, 0, 0, ${erase})`;
			ctx.fillRect(0, 0, width, height);

			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = `rgb(${Math.round(tint[0])}, ${Math.round(
				tint[1],
			)}, ${Math.round(tint[2])})`;

			for (const p of particles) {
				const rise = Math.min(p.age / 24, 1);
				const fall = Math.min((p.ttl - p.age) / 46, 1);
				const envelope = Math.max(0, Math.min(rise, fall));
				if (envelope <= 0) continue;
				ctx.globalAlpha = p.alpha * envelope * strength;
				ctx.fillRect(p.x, p.y, p.size, p.size);
			}

			ctx.globalAlpha = 1;
		};

		const loop = (now: number) => {
			frame = window.requestAnimationFrame(loop);
			// Clamp so a backgrounded tab does not resume with one enormous step.
			const dt = Math.min(now - last, 48);
			last = now;
			step(dt);
			draw(dt);
		};

		const stop = () => {
			if (frame) {
				window.cancelAnimationFrame(frame);
				frame = 0;
			}
		};

		const still = () => {
			// No frames to build filaments over, so run the simulation forward
			// without painting, then lay down a single settled frame.
			ctx.clearRect(0, 0, width, height);
			snapTint();
			for (let i = 0; i < 90; i++) step(16.6667);
			for (let i = 0; i < 26; i++) draw(16.6667);
		};

		const start = () => {
			stop();
			if (quiet.matches) {
				still();
				return;
			}
			last = performance.now();
			frame = window.requestAnimationFrame(loop);
		};

		const onVisibility = () => (document.hidden ? stop() : start());
		const onResize = () => {
			resize();
			start();
		};

		// The colour lives in a custom property, so follow the theme.
		const watch = new MutationObserver(() => {
			readTheme();
			if (quiet.matches) still();
		});
		watch.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme"],
		});

		readTheme();
		snapTint();
		resize();
		start();

		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", onVisibility);
		quiet.addEventListener("change", start);

		return () => {
			stop();
			watch.disconnect();
			window.removeEventListener("resize", onResize);
			document.removeEventListener("visibilitychange", onVisibility);
			quiet.removeEventListener("change", start);
		};
	}, []);

	return (
		<div className={className} ref={holder} aria-hidden="true">
			<canvas ref={surface} />
			{/* Sits over the field and under the page: see global.css. */}
			<div className="field-scrim" />
		</div>
	);
};
