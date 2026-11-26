#!/usr/bin/env node
/**
 * Generate sitemap.xml and robots.txt for the static docs site.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_BASE = (process.env.DOCS_SITE_URL || 'https://docs.birkly.io').replace(/\/$/, '');
const SKIP_DIRS = new Set(['node_modules', '.git', 'media', 'deploy', 'scripts', 'content']);
const SKIP_FILES = new Set(['404.html']);

function walkHtml(dir, base = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('.')) {
      continue;
    }
    const full = path.join(dir, name);
    const rel = path.posix.join(base, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(name)) {
        continue;
      }
      out.push(...walkHtml(full, rel));
      continue;
    }
    if (!name.endsWith('.html')) {
      continue;
    }
    if (SKIP_FILES.has(name)) {
      continue;
    }
    const urlPath = '/' + rel.split(path.sep).join('/');
    out.push({ loc: SITE_BASE + urlPath, file: full });
  }
  return out;
}

const entries = walkHtml(ROOT);
entries.sort((a, b) => a.loc.localeCompare(b.loc));

const urlNodes = entries
  .map((e) => {
    const mtime = fs.statSync(e.file).mtime.toISOString();
    return `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${mtime}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`;
  })
  .join('\n');

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urlNodes +
  '\n</urlset>\n';

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${SITE_BASE}/sitemap.xml\n`
);

console.log(`Wrote sitemap.xml with ${entries.length} URLs and robots.txt`);