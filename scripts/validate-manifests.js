#!/usr/bin/env node
/**
 * Validate Birkly-Docs manifest coverage (P72-M3).
 *
 * Fails when:
 * - A numbered-topic .md exists but is not in manifest.json
 * - A help-manifest topic has no corresponding .md source
 * - help-manifest topic is missing from manifest.json (static site)
 *
 * Usage: node scripts/validate-manifests.js
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const SECTION_PREFIXES = [
  '00-overview',
  '01-admin',
  '02-content',
  '03-templating',
  '04-integration',
  '04-studio',
  '05-automation',
  '06-extensibility',
  '06-plugin-economy',
  '07-operations',
];

/** Legacy stubs superseded by plugins/commerce.md — remove when consolidated (P72+). */
const ORPHAN_ALLOWLIST = new Set([
  '06-extensibility/commerce-coexistence.md',
  '06-extensibility/commerce-fieldtype.md',
  '06-extensibility/commerce-plugin.md',
  '06-extensibility/events-plugin.md',
  '06-extensibility/payment-shelf-api.md',
  '06-extensibility/payments-plugin.md',
  '06-extensibility/shopping-cart-plugin.md',
]);

/** @type {Set<string>} */
const manifestPaths = new Set();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
for (const section of manifest.sections) {
  for (const item of section.items) {
    manifestPaths.add(item.path.replace(/\\/g, '/'));
  }
}

const helpManifest = JSON.parse(fs.readFileSync(path.join(root, 'help-manifest.json'), 'utf8'));
const helpTopics = helpManifest.topics || [];

let failures = 0;

function fail(msg) {
  console.error('FAIL:', msg);
  failures++;
}

function pass(msg) {
  console.log('PASS:', msg);
}

// Orphan .md in topic folders
for (const prefix of SECTION_PREFIXES) {
  const dir = path.join(root, prefix);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const rel = `${prefix}/${file}`;
    if (ORPHAN_ALLOWLIST.has(rel)) continue;
    if (!manifestPaths.has(rel)) {
      fail(`Orphan topic not in manifest.json: ${rel}`);
    }
  }
}

// help-manifest topics must have .md and be in manifest.json
for (const topic of helpTopics) {
  const docsPath = String(topic.docs_path || '');
  const mdPath = docsPath.replace(/\.html$/, '.md');
  const abs = path.join(root, mdPath);
  if (!fs.existsSync(abs)) {
    fail(`help-manifest topic "${topic.id}" missing source: ${mdPath}`);
    continue;
  }
  if (!manifestPaths.has(mdPath)) {
    fail(`help-manifest topic "${topic.id}" not in manifest.json: ${mdPath}`);
    continue;
  }
  pass(`help topic "${topic.id}" → ${mdPath}`);
}

console.log(`\nManifest: ${manifestPaths.size} topics · Help: ${helpTopics.length} topics`);

if (failures > 0) {
  console.error(`\n${failures} validation failure(s).`);
  process.exit(1);
}

console.log('\nAll manifest checks passed.');
process.exit(0);
