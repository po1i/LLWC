import { defineConfig } from 'astro/config';

// GitHub Pages: served from https://<user>.github.io/LLWC/ unless a custom domain is set.
// Set SITE_BASE="/" in the workflow once a custom domain points at the repo.
const base = process.env.SITE_BASE ?? '/LLWC/';

export default defineConfig({
  site: 'https://po1i.github.io',
  base,
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
