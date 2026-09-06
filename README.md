# Portfolio — Falindo

Personal site of an Information Systems student working toward a junior
penetration tester role. It lists the security tooling I build and maps each
project to the section of the OWASP Web Security Testing Guide it practises.

Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
and [Contentlayer](https://www.contentlayer.dev/), with an optional
[Upstash](https://upstash.com) Redis pageview counter.

## Design notes

- **Three themes** — light, dark and monospace. The monospace theme swaps the
  body font for a monospace stack, which suits a portfolio built around security
  tooling. The choice persists in `localStorage` and is applied before first
  paint so the page never flashes the wrong palette.
- **Numbered side rail** — a slim vertical nav on wide screens marking the
  current section; a top bar takes over on narrow ones.
- **Ambient background** — a canvas flow field where each particle takes its
  heading from slowly evolving 3D value noise. Capped particle count and device
  pixel ratio, throttled to 30fps, paused while the tab is hidden, and reduced to
  a single static frame under `prefers-reduced-motion`.

## Running locally

```sh-session
git clone https://github.com/Wu-Falin/nextjs-portfolio-wufalin.git
cd nextjs-portfolio-wufalin
pnpm install
pnpm dev
```

The pageview counter is optional. To enable it, copy [`.env.example`](./.env.example)
to `.env` and fill in your Upstash credentials — without them the counter simply
stays at zero and everything else works as normal.

## Adding a project

Drop an `.mdx` file into `content/projects/`:

```yaml
---
title: Project name
description: One or two sentences.
date: "2026-01-01"
published: true
repository: Wu-Falin/repo-name
tag: WSTG-XXXX-00
---
```

`tag` is the short label shown next to the date in the project list, and `url`
is available for projects with a live site.

## License

MIT — see [LICENSE](./LICENSE).
