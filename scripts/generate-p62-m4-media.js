#!/usr/bin/env node
/** One-shot generator for P62-M4 templating SVG assets. Re-runnable. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'media', '03-templating');
const overviewRoot = path.join(__dirname, '..', 'media', '00-overview', 'getting-started', 'screenshots');

const ink = '#1f2a24';
const muted = '#5c665f';
const line = '#c5c0b4';
const panelDark = '#ebe6db';
const okBg = '#e8f0ea';
const okBorder = '#3d6b4f';
const okLabel = '#2a4f38';
const badBg = '#f3e8e6';
const badBorder = '#8a4538';
const badLabel = '#6b3228';
const accent = '#2f5d4a';
const white = '#fbfaf7';
const codeBg = '#f7f4ed';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function codeLines(lines, x, y, lineH = 16) {
  return lines
    .map(
      (ln, i) =>
        `<text x="${x}" y="${y + i * lineH}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" fill="${ink}">${esc(ln)}</text>`
    )
    .join('\n');
}

function labelBadge(x, y, w, h, text, kind) {
  const bg = kind === 'ok' ? okBg : kind === 'bad' ? badBg : panelDark;
  const bd = kind === 'ok' ? okBorder : kind === 'bad' ? badBorder : line;
  const fg = kind === 'ok' ? okLabel : kind === 'bad' ? badLabel : muted;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${bg}" stroke="${bd}" stroke-width="1.5"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="13" font-weight="700" fill="${fg}">${esc(text)}</text>`;
}

function panelBox(x, y, w, h, title) {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${white}" stroke="${line}" stroke-width="1.5"/>
  <rect x="${x}" y="${y}" width="${w}" height="32" rx="8" fill="${panelDark}"/>
  <rect x="${x}" y="${y + 20}" width="${w}" height="12" fill="${panelDark}"/>
  <text x="${x + 14}" y="${y + 21}" font-family="Georgia, 'Times New Roman', serif" font-size="13" font-weight="700" fill="${ink}">${esc(title)}</text>`;
}

function arrow(x1, y1, x2, y2) {
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${accent}" stroke-width="2" fill="none" marker-end="url(#arrow)"/>`;
}

const defs = `
<defs>
  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
    <path d="M0,0 L6,3 L0,6 Z" fill="${accent}"/>
  </marker>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#f7f5ef"/>
    <stop offset="100%" stop-color="#efebe2"/>
  </linearGradient>
</defs>`;

const files = {};

files[path.join(root, 'detail-pages-and-url-context/screenshots/list-detail-correct-vs-antipattern.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="920" height="420" viewBox="0 0 920 420" role="img" aria-labelledby="title desc">
<title id="title">Detail page: correct URL context vs looping the collection</title>
<desc id="desc">Side-by-side comparison of wrong detail loop and correct single-entry markup</desc>
${defs}
<rect width="920" height="420" fill="url(#bg)"/>
<text x="40" y="36" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">Detail pages: list loop vs URL context</text>
<text x="40" y="58" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">List links use ?collection=&amp;slug= — the detail page must not wrap the body in a collection loop.</text>
${panelBox(40, 80, 400, 300, 'Anti-pattern (wrong)')}
${labelBadge(54, 122, 72, 24, 'Avoid', 'bad')}
<rect x="54" y="160" width="372" height="190" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    '<!-- detail.html — WRONG -->',
    "{for each entry in 'blog'}",
    '  <h1>{title}</h1>',
    "  <div>{'content'}</div>",
    '{endfor}',
    '',
    'Always shows a list / wrong item',
  ],
  68,
  186
)}
${panelBox(480, 80, 400, 300, 'Correct pattern')}
${labelBadge(494, 122, 78, 24, 'Correct', 'ok')}
<rect x="494" y="160" width="372" height="190" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    '<!-- post.html?collection=blog&slug=… -->',
    '<meta name="birkly-collection" content="blog">',
    '<h1>{title}</h1>',
    "<div>{'content'}</div>",
    '<script src="/birkly-client.js"></script>',
    '',
    'Reads the current entry from the URL',
  ],
  508,
  186
)}
</svg>`;

files[path.join(root, 'client-setup/screenshots/script-tag-setup.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="880" height="360" viewBox="0 0 880 360" role="img" aria-labelledby="title desc">
<title id="title">birkly-client.js script tag setup</title>
<desc id="desc">Same-host and external-site script tag examples</desc>
${defs}
<rect width="880" height="360" fill="url(#bg)"/>
<text x="36" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">Load birkly-client.js on every templated page</text>
<text x="36" y="56" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">Without the script, visitors see raw {for each…} text.</text>
${panelBox(36, 78, 390, 240, 'Same host (project / CMS)')}
<rect x="50" y="128" width="362" height="160" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    '<script src="/birkly-client.js"></script>',
    '',
    'Optional helpers:',
    '<script src="/birkly-components.js"></script>',
  ],
  64,
  158
)}
${panelBox(454, 78, 390, 240, 'External website')}
<rect x="468" y="128" width="362" height="160" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    '<script',
    '  src="https://cms.example.com/birkly-client.js"',
    '  data-cms-url="https://cms.example.com">',
    '</script>',
    '',
    'data-cms-url must point at the CMS',
  ],
  482,
  158
)}
</svg>`;

files[path.join(root, 'client-setup/screenshots/client-pipeline.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="280" viewBox="0 0 900 280" role="img" aria-labelledby="title desc">
<title id="title">Client render pipeline</title>
<desc id="desc">HTML templates to client to API page_bundle to rendered DOM</desc>
${defs}
<rect width="900" height="280" fill="url(#bg)"/>
<text x="36" y="36" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">Client pipeline</text>
<text x="36" y="58" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">HTML with {…} → birkly-client.js → public API / page_bundle → filled DOM</text>
${[
  ['HTML', 'templates', 60],
  ['birkly-', 'client.js', 270],
  ['API /', 'page_bundle', 480],
  ['Rendered', 'DOM', 690],
]
  .map(
    ([a, b, x], i) => `
  <rect x="${x}" y="100" width="150" height="100" rx="10" fill="${white}" stroke="${accent}" stroke-width="2"/>
  <text x="${x + 75}" y="142" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="${ink}">${esc(a)}</text>
  <text x="${x + 75}" y="164" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="${ink}">${esc(b)}</text>
  ${i < 3 ? arrow(x + 158, 150, x + 202, 150) : ''}`
  )
  .join('')}
<text x="60" y="240" font-family="ui-monospace, Menlo, monospace" font-size="12" fill="${muted}">DevTools → Network: look for page_bundle / public collection requests after the script runs.</text>
</svg>`;

files[path.join(root, 'public-forms-templating/screenshots/entry-for-form.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="860" height="420" viewBox="0 0 860 420" role="img" aria-labelledby="title desc">
<title id="title">Public form with entry for markup</title>
<desc id="desc">Example contact form using entry for and matching field slugs</desc>
${defs}
<rect width="860" height="420" fill="url(#bg)"/>
<text x="36" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">Public forms: {entry for} markup</text>
<text x="36" y="56" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">Collection Entry method = Public API. Field name="{slug}" must match the schema.</text>
${panelBox(36, 78, 520, 310, 'Template')}
<rect x="50" y="128" width="492" height="240" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    "{entry for 'contact'}",
    '  <input type="text" name="{name}" required>',
    '  <input type="email" name="{email}" required>',
    '  <textarea name="{message}" required></textarea>',
    '  <div data-birkly-form-status hidden></div>',
    '  <button type="submit">Send</button>',
    '{endentry}',
    '<script src="/birkly-client.js"></script>',
  ],
  64,
  156
)}
${panelBox(580, 78, 244, 310, 'Checklist')}
${[
  ['1', 'Public API entry method'],
  ['2', 'Fields: name, email, message'],
  ['3', 'name="{slug}" matches schema'],
  ['4', 'Load birkly-client.js'],
  ['5', 'Prefer over custom fetch'],
]
  .map(
    ([n, t], i) => `
  <circle cx="608" cy="${148 + i * 42}" r="12" fill="${okBg}" stroke="${okBorder}"/>
  <text x="608" y="${152 + i * 42}" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="${okLabel}">${n}</text>
  <text x="630" y="${153 + i * 42}" font-family="system-ui, sans-serif" font-size="12" fill="${ink}">${esc(t)}</text>`
  )
  .join('')}
</svg>`;

files[path.join(root, 'loops-and-lists/screenshots/ordered-by-with-status.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="400" viewBox="0 0 900 400" role="img" aria-labelledby="title desc">
<title id="title">Loop with status filter and ordered by</title>
<desc id="desc">Published entries listed with ordered by newest</desc>
${defs}
<rect width="900" height="400" fill="url(#bg)"/>
<text x="36" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">Loops: with status + ordered by</text>
<text x="36" y="56" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">Filter published entries, then sort — newest uses created_at.</text>
${panelBox(36, 78, 500, 280, 'List template')}
<rect x="50" y="128" width="472" height="204" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    "{for each entry in 'blog'",
    '  with status = published',
    '  ordered by newest}',
    '  <article>',
    '    <h2><a href="post.html?collection=blog&slug={slug}">{title}</a></h2>',
    "    <p>{'excerpt'}</p>",
    '  </article>',
    '{endfor}',
  ],
  64,
  154
)}
${panelBox(560, 78, 304, 280, 'Example entries')}
${[
  ['Welcome post', 'published', '2025-03-12'],
  ['Studio notes', 'published', '2025-02-01'],
  ['Draft ideas', 'draft', '— hidden —'],
]
  .map(([t, s, d], i) => {
    const draft = s === 'draft';
    return `
  <rect x="574" y="${128 + i * 70}" width="276" height="58" rx="6" fill="${draft ? badBg : okBg}" stroke="${draft ? badBorder : okBorder}"/>
  <text x="590" y="${152 + i * 70}" font-family="Georgia, serif" font-size="14" fill="${ink}">${esc(t)}</text>
  <text x="590" y="${172 + i * 70}" font-family="system-ui, sans-serif" font-size="12" fill="${muted}">${esc(s)} · ${esc(d)}</text>`;
  })
  .join('')}
</svg>`;

files[path.join(root, 'templating-overview/screenshots/templating-mental-model.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="920" height="320" viewBox="0 0 920 320" role="img" aria-labelledby="title desc">
<title id="title">Templating architecture overview</title>
<desc id="desc">Your HTML, client script, CMS API, and rendered DOM</desc>
${defs}
<rect width="920" height="320" fill="url(#bg)"/>
<text x="36" y="36" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">How templating fits together</text>
<text x="36" y="58" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">Light DOM HTML holds plain-English tags; the client fills them from published CMS data.</text>
${[
  ['Your HTML', 'Layout + {for each…}', "{title} · {'excerpt'}", 48],
  ['birkly-client.js', 'Discover regions', 'Fetch + processTemplates', 258],
  ['Public API', 'page_bundle /', 'entries by collection', 468],
  ['Live DOM', 'Tags replaced', 'Events fire', 678],
]
  .map(
    ([title, b1, b2, x], i) => `
  <rect x="${x}" y="90" width="190" height="150" rx="10" fill="${white}" stroke="${line}" stroke-width="1.5"/>
  <rect x="${x}" y="90" width="190" height="36" rx="10" fill="${panelDark}"/>
  <rect x="${x}" y="114" width="190" height="12" fill="${panelDark}"/>
  <text x="${x + 16}" y="114" font-family="Georgia, serif" font-size="14" fill="${ink}">${esc(title)}</text>
  <text x="${x + 16}" y="160" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">${esc(b1)}</text>
  <text x="${x + 16}" y="182" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">${esc(b2)}</text>
  ${i < 3 ? arrow(x + 198, 165, x + 250, 165) : ''}`
  )
  .join('')}
<text x="48" y="280" font-family="system-ui, sans-serif" font-size="12" fill="${muted}">List pages loop a collection. Detail pages read one entry from ?collection=&amp;slug=. Shared chrome uses &lt;birkly-region&gt;.</text>
</svg>`;

files[path.join(root, 'canonical-syntax/screenshots/valid-vs-invalid-syntax.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="920" height="400" viewBox="0 0 920 400" role="img" aria-labelledby="title desc">
<title id="title">Valid Birkly syntax versus invalid Jinja-style syntax</title>
<desc id="desc">Single braces and plain English versus double braces and Jinja</desc>
${defs}
<rect width="920" height="400" fill="url(#bg)"/>
<text x="36" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">Canonical syntax: valid vs invalid</text>
<text x="36" y="56" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">Single braces + plain English. No Jinja, Liquid, or Blade.</text>
${panelBox(36, 78, 420, 290, 'Valid (Birkly)')}
${labelBadge(50, 122, 70, 24, 'Valid', 'ok')}
<rect x="50" y="158" width="392" height="184" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    "{for each entry in 'blog'",
    '  with status = published',
    '  ordered by newest}',
    '  <h2>{title}</h2>',
    "  <p>{'excerpt'}</p>",
    '{endfor}',
  ],
  64,
  186
)}
${panelBox(480, 78, 404, 290, 'Invalid (phantoms)')}
${labelBadge(494, 122, 78, 24, 'Invalid', 'bad')}
<rect x="494" y="158" width="376" height="184" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    '{% for item in items %}',
    '  {{ item.title }}',
    '{% endfor %}',
    '',
    '{title truncate 80}',
    "{entry 'blog'.'slug'}…{endentry}",
  ],
  508,
  186
)}
</svg>`;

files[path.join(root, 'dates-and-formatting/screenshots/format-filter-examples.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="860" height="360" viewBox="0 0 860 360" role="img" aria-labelledby="title desc">
<title id="title">Date format filter examples</title>
<desc id="desc">Same timestamp rendered with three format strings</desc>
${defs}
<rect width="860" height="360" fill="url(#bg)"/>
<text x="36" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">Dates: one timestamp, three formats</text>
<text x="36" y="56" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">Source value: created_at = 2025-01-05 16:45:00 — format filter only (no truncate / strip_tags).</text>
${panelBox(36, 78, 788, 240, 'Examples')}
${[
  ['{created_at}', '2025-01-05', 'Default Y-m-d'],
  ['{created_at format "F j, Y"}', 'January 5, 2025', 'Readable'],
  ['{created_at format "Y-m-d H:i"}', '2025-01-05 16:45', 'Date + time'],
]
  .map(
    ([tpl, out, note], i) => `
  <rect x="54" y="${122 + i * 58}" width="752" height="50" rx="6" fill="${codeBg}" stroke="${line}"/>
  <text x="70" y="${142 + i * 58}" font-family="ui-monospace, Menlo, monospace" font-size="13" fill="${ink}">${esc(tpl)}</text>
  <text x="70" y="${162 + i * 58}" font-family="system-ui, sans-serif" font-size="12" fill="${muted}">${esc(note)}</text>
  <text x="780" y="${152 + i * 58}" text-anchor="end" font-family="Georgia, serif" font-size="15" fill="${accent}">${esc(out)}</text>`
  )
  .join('')}
</svg>`;

files[path.join(root, 'web-components/screenshots/birkly-region-header.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="880" height="400" viewBox="0 0 880 400" role="img" aria-labelledby="title desc">
<title id="title">birkly-region header and list markup</title>
<desc id="desc">Shared chrome and list regions using birkly-region</desc>
${defs}
<rect width="880" height="400" fill="url(#bg)"/>
<text x="36" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">Regions: &lt;birkly-region&gt;</text>
<text x="36" y="56" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">Shared header/footer on every page; list regions accept ordered="newest" or ordered="order".</text>
${panelBox(36, 78, 400, 280, 'Entry region (chrome)')}
<rect x="50" y="128" width="372" height="204" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    '<birkly-region',
    '  collection="site_elements"',
    '  entry="header">',
    '  <header class="site-header">',
    "    {'content'}",
    '  </header>',
    '</birkly-region>',
  ],
  64,
  156
)}
${panelBox(460, 78, 384, 280, 'List region')}
<rect x="474" y="128" width="356" height="204" rx="6" fill="${codeBg}" stroke="${line}"/>
${codeLines(
  [
    '<birkly-region',
    '  collection="blog"',
    '  list',
    '  ordered="newest">',
    '  <article><h2>{title}</h2></article>',
    '</birkly-region>',
    '<script src="/birkly-client.js"></script>',
  ],
  488,
  156
)}
</svg>`;

files[path.join(root, 'cheat-sheet/screenshots/syntax-sheet.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="920" height="560" viewBox="0 0 920 560" role="img" aria-labelledby="title desc">
<title id="title">Birkly templating syntax sheet</title>
<desc id="desc">Printable overview of valid syntax and phantoms to avoid</desc>
${defs}
<rect width="920" height="560" fill="url(#bg)"/>
<text x="36" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="${ink}">Birkly template syntax sheet</text>
<text x="36" y="56" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">Single braces · quote collections &amp; user fields · TEMPLATE_LANGUAGE_SPEC v1.0</text>
${panelBox(36, 78, 280, 220, 'Output')}
${codeLines(
  [
    '{title}  {slug}',
    "{'excerpt'}",
    '{created_at}',
    '{created_at format "F j, Y"}',
    '{current.language}',
    "{query.'slug'}",
  ],
  50,
  128,
  22
)}
${panelBox(332, 78, 280, 220, 'Loops')}
${codeLines(
  [
    "{for each entry in 'blog'}",
    '  with status = published',
    '  ordered by newest',
    '  limit 5',
    "{for each entry in 'comments'",
    "  of 'blog'.current}",
    '{endfor}',
  ],
  346,
  128,
  22
)}
${panelBox(628, 78, 256, 220, 'From / if / forms')}
${codeLines(
  [
    "{from 'site_elements'",
    "  get entry 'header'}",
    '{endget}',
    "{if entry has 'price'}",
    "{entry for 'contact'}",
    '{endentry}',
  ],
  642,
  128,
  22
)}
${panelBox(36, 318, 576, 200, 'Detail + regions')}
${codeLines(
  [
    'post.html?collection=blog&slug={slug}',
    "Detail body: {title} / {'content'} — no collection loop",
    '<birkly-region collection="site_elements" entry="header"></birkly-region>',
    '<script src="/birkly-client.js"></script>',
  ],
  50,
  368,
  28
)}
${panelBox(628, 318, 256, 200, 'Phantoms — avoid')}
${labelBadge(642, 362, 78, 22, 'Invalid', 'bad')}
${codeLines(
  ['{{ title }}', '{% for %}', '{title truncate 80}', "{entry 'x'.'y'}…{endentry}"],
  642,
  404,
  22
)}
</svg>`;

files[path.join(overviewRoot, 'install-zip-docker.svg')] = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="860" height="320" viewBox="0 0 860 320" role="img" aria-labelledby="title desc">
<title id="title">Supported install paths: zip and Docker</title>
<desc id="desc">Product install is release zip or Docker only</desc>
${defs}
<rect width="860" height="320" fill="url(#bg)"/>
<text x="36" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="${ink}">Install Birkly: zip or Docker</text>
<text x="36" y="56" font-family="system-ui, sans-serif" font-size="13" fill="${muted}">Supported product paths. Composer, npm, and cPanel installers are not documented channels.</text>
${panelBox(36, 78, 380, 200, 'Release zip')}
${codeLines(
  [
    '1. Download Birkly-*.zip',
    '2. Extract next to admin/, api/, core/',
    '3. Open START_HERE.html',
    '4. Local: ./start-server.sh',
    '   or upload to your host',
  ],
  50,
  128,
  24
)}
${panelBox(444, 78, 380, 200, 'Docker')}
${codeLines(
  [
    '1. Run the Birkly image / Dockerfile',
    '2. Mount persistent /app/data',
    '3. Open /admin → first user',
    '4. Settings → Hosting URLs',
    'See Dokploy hosting guide',
  ],
  458,
  128,
  24
)}
</svg>`;

for (const [file, svg] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg);
  console.log('wrote', path.relative(path.join(__dirname, '..'), file), Buffer.byteLength(svg), 'bytes');
}
console.log('total', Object.keys(files).length);
