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
- **Section rail** — the same list of sections everywhere: the home page lays
  it out inline in its left column, other pages pin it to the left edge on wide
  screens, and a top bar takes over on narrow ones.
- **Ambient background** — a 6s looping plume of particles, tinted phthalo
  green, cut to a 320x180 grid and enlarged as hard pixels. The source is
  720x1280, so at full bleed there is never enough of it and the browser's
  smoothing reads as a mistake; square pixels read as a decision. The clips are
  drawn through a canvas rather than shown directly, because `image-rendering`
  does nothing to a video element in Chromium — it applies to images and
  canvases only. The canvas holds the source crop at 1:1, so the whole
  enlargement is CSS scaling a canvas, where the request for hard pixels is
  honoured. Two clips are shipped, one per theme, each with its colour and its
  theme's background baked in, so a theme change is an alpha blend of two draws
  over the same span the rest of the page fades in. Only the theme on screen is
  fetched; the other waits until you switch to it. The loop is cut with the tail
  cross faded back over the head, so it repeats without a seam. Paused while the
  tab is hidden, and under `prefers-reduced-motion` the posters are served
  alone — images, so they take the same pixelated enlargement natively — and no
  clip is fetched at all.
- **Words over the field** — a scrim weighted to the left column and the bottom
  right corner, plus a halo in the page colour behind the text, so the plume
  can run at full strength and every block still clears 5.8:1 against the
  ground behind it.
- **Quiet entrance** — an opening title on each full load. The curtain fades
  and the name walks out of the middle of it to where the heading sits, growing
  and thinning on the way. The heading itself makes that walk, rather than a
  copy walking there and handing over at the end: a copy has to be placed by
  matching font metrics, and any fraction it gets wrong shows as a jump exactly
  when the walk finishes, where the real element cannot land anywhere but where
  it belongs. Scale carries the size, so nothing below it reflows. The walk is
  scripted and deliberately additive - if it never runs, the curtain still
  clears on its own and the heading still arrives under its own entrance. The rest of the page fades in on a stagger, driven by a
  `--reveal-delay` custom property and switched off entirely for visitors who
  ask for reduced motion. Moving between sections draws a hairline across the
  top and replays the section's own entrance.

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
