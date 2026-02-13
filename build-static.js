#!/usr/bin/env node
/**
 * Generate static HTML docs (no server, no runtime build).
 * Run once: node build-static.js
 * Then open index.html in your browser.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rel(fromPage, toPath) {
  const fromDir = path.dirname(fromPage) || '.';
  return path.relative(fromDir, toPath).split(path.sep).join('/') || 'index.html';
}

function mdToHtml(md) {
  const out = [];
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  const escape = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const inline = (s) => {
    s = escape(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => '<a href="' + escape(u) + '">' + escape(t) + '</a>');
    return s;
  };
  const block = (s) => {
    s = s.trim();
    if (!s) return '';
    if (/^#{1,4}\s/.test(s)) {
      const m = s.match(/^(#{1,4})\s+(.+)$/);
      if (m) return '<h' + m[1].length + '>' + inline(m[2]) + '</h' + m[1].length + '>';
    }
    if (s.startsWith('> ')) return '<blockquote><p>' + inline(s.slice(2)) + '</p></blockquote>';
    if (/^[-*]\s/.test(s)) return '<li>' + inline(s.slice(2).trim()) + '</li>';
    if (/^\d+\.\s/.test(s)) return '<li>' + inline(s.replace(/^\d+\.\s+/, '')) + '</li>';
    return '<p>' + inline(s) + '</p>';
  };
  while (i < lines.length) {
    const line = lines[i];
    if (/^#{1,4}\s/.test(line)) { out.push(block(line)); i++; continue; }
    if (/^>\s/.test(line)) {
      const q = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        q.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push('<blockquote>' + q.map((p) => '<p>' + inline(p) + '</p>').join('') + '</blockquote>');
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      out.push('<ul>');
      while (i < lines.length && /^[-*]\s/.test(lines[i])) { out.push(block(lines[i])); i++; }
      out.push('</ul>');
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      out.push('<ol>');
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { out.push(block(lines[i])); i++; }
      out.push('</ol>');
      continue;
    }
    if (/^```/.test(line)) {
      i++;
      const code = [];
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(escape(lines[i])); i++; }
      if (i < lines.length) i++;
      out.push('<pre><code>' + code.join('\n') + '</code></pre>');
      continue;
    }
    if (line.trim() === '') { i++; continue; }
    const para = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,4}\s/.test(lines[i]) && !/^[-*]\s/.test(lines[i]) && !/^\d+\.\s/.test(lines[i]) && !lines[i].startsWith('>') && !lines[i].startsWith('```')) {
      para.push(lines[i]);
      i++;
    }
    if (para.length) out.push('<p>' + inline(para.join(' ')) + '</p>');
  }
  return out.join('\n');
}

/** Split doc by ## Summary / ## Beginner / ## Advanced Users / ## Related and render with toggles */
function mdToHtmlWithToggles(md, currentPage) {
  const sections = {};
  const re = /(?:^|\n)## (Summary|Beginner|Advanced Users|Related)\s*\n/i;
  let rest = '\n' + md.replace(/^\s*#\s*[^\n]+\n+/, '').trim(); // ensure \n before first ##
  const parts = rest.split(re);
  if (parts.length >= 2) {
    // parts[0] = content before first section (maybe empty), parts[1]=section name, parts[2]=content, ...
    let i = 0;
    if (parts[0].trim()) sections.intro = mdToHtml(parts[0].trim());
    i++;
    while (i < parts.length - 1) {
      const name = parts[i].trim();
      const content = parts[i + 1].trim();
      if (content) sections[name.toLowerCase().replace(/\s+/g, '_')] = { name, html: mdToHtml(content) };
      i += 2;
    }
  }
  const out = [];
  if (sections.intro) out.push(sections.intro);
  if (sections.summary) out.push('<div class="doc-summary">' + sections.summary.html + '</div>');
  if (sections.beginner) out.push('<details class="doc-toggle doc-toggle-beginner"><summary>Beginner</summary><div class="doc-toggle-inner">' + sections.beginner.html + '</div></details>');
  if (sections.advanced_users) out.push('<details class="doc-toggle doc-toggle-advanced"><summary>Advanced Users</summary><div class="doc-toggle-inner">' + sections.advanced_users.html + '</div></details>');
  if (sections.related) out.push('<div class="doc-related">' + sections.related.html + '</div>');
  if (out.length === 0) out.push(mdToHtml(md)); // fallback: no sections, render all
  let html = out.join('\n');
  // Fix .md links to .html (relative links stay relative)
  html = html.replace(/href="([^"]*)([^"\/]+)\.md(#[^"]*)?"/g, (_, prefix, name, hash) => 'href="' + prefix + name + '.html' + (hash || '') + '"');
  return html;
}

function buildNav(manifest, currentPage) {
  const parts = [];
  parts.push('<div class="nav-section"><a href="' + rel(currentPage, 'index.html') + '" class="nav-link' + (currentPage === 'index.html' ? ' active' : '') + '">Home</a></div>');
  manifest.sections.forEach((section) => {
    parts.push('<div class="nav-section"><div class="nav-section-title">' + escapeHtml(section.label) + '</div>');
    section.items.forEach((item) => {
      const href = item.path.replace(/\.md$/, '.html');
      const isActive = currentPage === href;
      parts.push('<a href="' + rel(currentPage, href) + '" class="nav-link' + (isActive ? ' active' : '') + '">' + escapeHtml(item.label) + '</a>');
    });
    parts.push('</div>');
  });
  return parts.join('\n');
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const allPaths = [];
manifest.sections.forEach((s) => s.items.forEach((i) => allPaths.push(i.path)));
['DOCS_ARCHITECTURE.md', 'README.md', 'CONTENTS_INDEX.md'].forEach((p) => {
  if (!allPaths.includes(p)) allPaths.push(p);
});

function template(title, navHtml, bodyHtml, currentPage) {
  const cssRel = rel(currentPage, 'css/style.css');
  const indexRel = rel(currentPage, 'index.html');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — Birkly Docs</title>
  <link rel="stylesheet" href="${escapeHtml(cssRel)}">
</head>
<body>
  <div class="layout">
    <header class="header">
      <div class="header-inner">
        <a href="${escapeHtml(indexRel)}" class="logo">Birkly Docs</a>
        <p class="tagline">Single source of truth for Birkly CMS documentation</p>
      </div>
    </header>
    <aside class="sidebar" id="sidebar">
      <button type="button" class="sidebar-close" id="sidebarClose" aria-label="Close menu">×</button>
      <nav class="nav" aria-label="Documentation">
${navHtml.split('\n').map((l) => '        ' + l).join('\n')}
      </nav>
    </aside>
    <button type="button" class="sidebar-toggle" id="sidebarToggle" aria-label="Open menu">≡</button>
    <main class="main">
      <div class="content doc-body">
        <div class="doc-content">${bodyHtml}</div>
      </div>
    </main>
  </div>
  <script>
    (function(){
      var sb = document.getElementById('sidebar');
      var openBtn = document.getElementById('sidebarToggle');
      var closeBtn = document.getElementById('sidebarClose');
      if (openBtn) openBtn.onclick = function() { sb && sb.classList.add('is-open'); };
      if (closeBtn) closeBtn.onclick = function() { sb && sb.classList.remove('is-open'); };
    })();
  </script>
</body>
</html>`;
}

allPaths.forEach((p) => {
  const dir = path.join(root, path.dirname(p.replace(/\.md$/, '.html')));
  if (dir !== root && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const homeBody = '<h1>Birkly Docs</h1><p>Use the sidebar to open a topic. Each doc has a <strong>Shortcut</strong> (quick, non-technical) and a <strong>Detailed</strong> section.</p><p>No server or build step—just open <code>index.html</code> in your browser.</p>';
fs.writeFileSync(path.join(root, 'index.html'), template('Home', buildNav(manifest, 'index.html'), homeBody, 'index.html'), 'utf8');

allPaths.forEach((p) => {
  const full = path.join(root, p);
  if (!fs.existsSync(full)) return;
  const md = fs.readFileSync(full, 'utf8');
  const htmlPath = p.replace(/\.md$/, '.html');
  const title = path.basename(p, '.md').replace(/-/g, ' ');
  const body = mdToHtmlWithToggles(md, htmlPath);
  fs.writeFileSync(path.join(root, htmlPath), template(title, buildNav(manifest, htmlPath), body, htmlPath), 'utf8');
});

console.log('Static HTML written. Open index.html in your browser.');
