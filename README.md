# LLWC

Landing page for LLWC: managed social advertising plus a lightweight platform for small business owners.

## Stack

- Astro 5, static output, vanilla CSS with custom properties
- Fonts: Fraunces (display), Geist and Geist Mono (UI) via Google Fonts
- Deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `main`

## Run locally

```sh
npm install
npm run dev
```

## Deploy

Push to `main`. In the repo settings, set Pages → Source to **GitHub Actions**.

The site builds under `/LLWC/`. Once a custom domain is attached, change `SITE_BASE` in the workflow to `/`.

## Placeholders to replace

- Copy, client names, testimonials and numbers in `src/components/*.astro`
- `CAL_URL` and `FORM_ENDPOINT` in `src/components/Book.astro`
- Contact email in `src/components/Footer.astro`
