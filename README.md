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
- **Section rail** — a rule and a label per section, the same list everywhere: the home page lays
  it out inline in its left column, other pages pin it to the left edge on wide
  screens, and a top bar takes over on narrow ones.
- **Ambient background** — a 6s looping plume of particles, run through a two
  stop ramp so it reads ember to amber rather than one flat tint, cut to a
  480x270 grid and enlarged as hard pixels — about three across on a desktop
  window. The source is 720x1280, so at full bleed there is never enough of it
  and the browser's smoothing reads as a mistake; square pixels read as a
  decision. The clips are drawn through a canvas rather than shown directly,
  because `image-rendering` does nothing to a video element in Chromium — it
  applies to images and canvases only. The canvas holds the source crop at 1:1,
  so the whole enlargement is CSS scaling a canvas, where the request is
  honoured. A clip hands back no frame for a moment as it comes round to the
  start, so the canvas is only cleared when there is something ready to replace
  it; clearing regardless is what used to leave a blank frame at the seam. Two
  clips are shipped, one per theme, each with its colour and its theme's
  background baked in, so a theme change is an alpha blend of two draws over
  the same span the rest of the page fades in. Only the theme on screen is
  fetched. Paused while the tab is hidden, and under `prefers-reduced-motion`
  the posters are served alone — images, so they take the same pixelated
  enlargement natively — and no clip is fetched at all.
- **Words over the field** — a scrim weighted to the left column and the bottom
  right corner, plus a halo in the page colour behind the text. The scrim
  deliberately leaves the middle open so the field can carry there, so the
  pages that are actually read lay their own ground under their column. Every
  block of text clears 4.8:1 against the ground behind it, in both themes, on a
  desktop and on a phone.
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
