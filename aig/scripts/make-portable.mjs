// Rewrites root-absolute asset URLs in dist/ to relative ones, so the built
// site works from any folder or host (used for preview links).
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
for (const file of walk('dist').filter((f) => /\.(html|css|js)$/.test(f))) {
  const src = readFileSync(file, 'utf8');
  const out = src
    .replace(/(["'(])\/_astro\//g, '$1./_astro/')
    .replace(/href="\/(favicon\.svg|privacy\.html)"/g, 'href="./$1"')
    .replace(/href="\/"/g, 'href="./index.html"');
  if (out !== src) writeFileSync(file, out);
}
console.log('portable paths written');
