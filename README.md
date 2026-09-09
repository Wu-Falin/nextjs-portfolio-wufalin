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
- **Ambient background** — a 4.5s looping plume of particles, tinted
  phthalo green. The source is 720x1280, so the clips are enlarged to 2560x1440
  with lanczos and sharpened at encode time rather than left for the browser to
  stretch: full bleed on a 2x laptop the browser was blowing 720p up by 2.7x,
  which is what turned each particle to mush. It now draws them at or below
  their own size on every common screen. Two clips are shipped, one per theme,
  each with its colour and its theme's background baked in, so switching themes is an opacity cross fade
  rather than a blend mode that cannot animate. Only the theme on screen is
  downloaded; the other waits on its poster until the first time you switch to
  it. The loop is cut with the tail cross faded back over the head, so it
  repeats without a seam. Paused while the tab is hidden, and under
  `prefers-reduced-motion` the still frame is served on its own and no clip is
  downloaded at all.
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
