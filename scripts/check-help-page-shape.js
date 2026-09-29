#!/usr/bin/env node
/**
 * P104-M3 — every Help topic must use the public toggle headings and
 * include one worked example inside Beginner.
 *
 * Beginner passes when it contains a fenced block or a numbered list
 * of at least three steps.
 *
 * Usage: node scripts/check-help-page-shape.js
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'help-manifest.json'), 'utf8'));
const failures = [];

function beginnerBody(markdown) {
  const match = markdown.match(/^## Beginner\s*$/m);
  if (!match) return '';
  const start = match.index + match[0].length;
  const rest = markdown.slice(start);
  const next = rest.search(/^## /m);
  return next === -1 ? rest : rest.slice(0, next);
}

function beginnerHasExample(body) {
  if (/^```/m.test(body)) return true;
  const steps = body.match(/^\d+\.\s+\S/gm);
  return !!(steps && steps.length >= 3);
}

for (const topic of manifest.topics || []) {
  const docsPath = String(topic.docs_path || '');
  const mdPath = docsPath.replace(/\.html$/, '.md');
  const abs = path.join(root, mdPath);
  const id = topic.id || mdPath;
  if (!fs.existsSync(abs)) {
    failures.push(`${id}: missing source ${mdPath}`);
    continue;
  }
  const markdown = fs.readFileSync(abs, 'utf8');
  const missing = [];
  if (!/^## Summary\s*$/m.test(markdown)) missing.push('Summary');
  if (!/^## Beginner\s*$/m.test(markdown)) missing.push('Beginner');
  if (!/^## Advanced Users\s*$/m.test(markdown)) missing.push('Advanced Users');
  if (missing.length) {
    failures.push(`${id}: missing heading(s): ${missing.join(', ')} (${mdPath})`);
    continue;
  }
  if (!beginnerHasExample(beginnerBody(markdown))) {
    failures.push(`${id}: Beginner has no fenced example and no 3-step list (${mdPath})`);
  }
}

if (failures.length) {
  console.error(`Help page shape: ${failures.length} topic(s) failed\n`);
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Help page shape OK (${(manifest.topics || []).length} topics)`);
