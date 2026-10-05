# Level Line

Landing page for Level Line Web Co.: Facebook and Instagram ads, booking-ready landing pages and
privacy-safe tracking for Boston-area med spas.

## Stack

- Astro 5, static output, vanilla CSS with custom properties
- Fonts: Fraunces (display), Geist and Geist Mono (UI) via Google Fonts
- Deployed to GitHub Pages by `.github/workflows/deploy.yml`

## Run locally

```sh
npm install
npm run dev
```

## Motion

- **Hero shader** (`src/scripts/hero-shader.ts`): raw WebGL, no library. Renders at half resolution,
  pauses offscreen and in background tabs, lowers resolution on slow devices, and draws one still
  frame under reduced motion. Without WebGL, a CSS glow shows instead.
- **Smooth scroll** (`src/scripts/smooth-scroll.ts`): Lenis on mouse wheel and trackpad. Touch
  scrolling stays native. Turned off under reduced motion. In-page links move keyboard focus to
  their target.

## Spec ads

The three sample ads in `public/spec/` are rendered from the "Website sample ads" page of the
Level Line concept-ads design canvas, at 1080×1350 plus a 540-wide copy. To swap one, export
a new 4:5 image at both sizes with the same file names.

## Editing content

Prices, terms, founder details and contact info live in `src/data/site.ts`. Change them there
and every section updates. A `null` value renders a dashed brass `[placeholder]` on the page.

## Before launch

These are placeholders on the page right now. Each one shows as a dashed `[label]` or a dashed frame.

| Item | Where to set it |
| --- | --- |
| Photo of Poli (square, at least 112×112) | Add to `public/`, set `founder.photo` in `src/data/site.ts` |
| Notice period from the Standard Terms | `terms.noticePeriod` in `src/data/site.ts` |
| Missed-deadline credit, in the agreement's exact wording | `terms.deadlineCredit`; set to `''` to drop it |
| Contact email | `email` in `src/data/site.ts` |
| Cal.com booking link | `calUrl` in `src/data/site.ts` |
| Form endpoint (Formspree or similar) | `formEndpoint` in `src/data/site.ts` |

## Ideas to test on calls, not on the site yet

- Groupon and discount-site patients: do they rebook, or only come for the deal?

## Deploy

In the repo settings, set Pages, then Source, to **GitHub Actions**. Pushes to `main` or the
current working branch deploy automatically. The site builds under `/LLWC/`. Once a custom domain
is attached, change `SITE_BASE` in the workflow to `/`.
