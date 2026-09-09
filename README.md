# Portfolio — Ng Falin

Personal site of an Information Systems student working toward a junior
penetration tester role. It lists the security tooling I build and maps each
project to the section of the OWASP Web Security Testing Guide it practises.

Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
and [Contentlayer](https://www.contentlayer.dev/), with an optional
[Upstash](https://upstash.com) Redis pageview counter. Deployed on Vercel.

## Design notes

- **Two themes** — light and dark. The choice persists in `localStorage` and is
  applied before first paint so the page never flashes the wrong palette.
- **Numbered rail** — the same list of sections everywhere: the home page lays
  it out inline in its left column, other pages pin it to the left edge on wide
  screens, and a top bar takes over on narrow ones.
- **Ambient background** — a field of particles drawn to a canvas rather than
  filmed. A clip is capped at its own resolution and has to be stretched to
  fill the window, which is what left every particle a smudge on a dense
  screen; the canvas is sized in device pixels, so each particle is a point at
  1x, 2x or 4k, and the whole thing is a few kilobytes instead of a few
  megabytes. Motion is a curl noise flow field - velocity taken as the curl of
  a potential, so it is divergence free and winds into filaments rather than
  collecting in sinks - with a per particle lean and a finer second turn so
  neighbours separate instead of combing into one stroke. Particles gather into
  masses by rejection sampling, weighted toward the lower right to leave the
  name and the rail their space. Paused while the tab is hidden, and under
  `prefers-reduced-motion` it settles one still frame and stops.
- **Words over the field** — a scrim weighted to the left column and the bottom
  right corner, plus a halo in the page colour behind the text, so the plume
  can run at full strength and every block still clears 5.8:1 against the
  ground behind it.
- **Quiet entrance** — an opening title on each full load, then the page fades
  in on a stagger, driven by a `--reveal-delay` custom property and switched
  off entirely for visitors who ask for reduced motion. Moving between sections
  draws a hairline across the top and replays the section's own entrance.

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

`tag` is the short label shown under the title in the project list, and `url`
is available for projects with a live site. `date` is only used to order the
list - it is never displayed.

## License

MIT — see [LICENSE](./LICENSE).
