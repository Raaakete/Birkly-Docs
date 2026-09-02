# Birkly Docs

**Birkly Docs** is the **single source of truth** for all Birkly CMS documentation. Any documentation you see in the Birkly admin (Help), on the Birkly website, or in other channels should ultimately come from this repository.

## 📦 Repository-Based Distribution

This repository contains the documentation source files (Markdown) and built HTML files. The CMS and website consume docs by pulling from this repository using one of these methods:

- **Git submodule** (recommended) — Versioned dependency, can pin to specific commits
- **Sync script** — Clones repo and copies files to CMS/website
- **NPM package** — Install as dependency (if published)

See **SYNC.md** for detailed integration instructions.

## What's in here

- **DOCS_ARCHITECTURE.md** — How docs are structured, the Summary + Beginner + Advanced Users pattern, and how other systems (CMS, website, etc.) consume this content. Read this first if you maintain or integrate the docs.
- **CONTENTS_INDEX.md** — Index of every topic and file path for maintainers and tooling.
- **01-admin/design-system.md** — Admin mint tokens, neutral scale, icon system, dark mode, and component classes (P41).
- **Numbered topic folders** (`00-overview`, `01-admin`, `02-content`, …) — All actual documentation in Markdown, one topic per file.
- **Built HTML files** — Generated from Markdown via `build-static.js`. These are what CMS and website consume.
- **Content-only HTML** — In the `content/` folder, HTML fragments (no layout) for embedding in custom pages. See "Content-only output" below.

## 📖 For readers

- Start with **00-overview/getting-started.md** and **00-overview/what-is-birkly.md**.
- Each topic has a **Summary** (for everyone), **Beginner** (plain language), and **Advanced Users** (technical) section so you can read only what you need.
- You can also open `index.html` locally to view the full documentation site.

## ✏️ For maintainers

- Edit only the Markdown files (`.md`) in this repository. Do not duplicate content elsewhere.
- Follow the structure in **DOCS_ARCHITECTURE.md**: every feature/concept has Summary + Beginner + Advanced Users.

### On-change update rule (M6)

Update Birkly-Docs **when a CMS platform milestone ships** — not as a parallel project during stabilization.

| Trigger | Action |
|---------|--------|
| CMS milestone merged to `main` (security, templating, API, client) | Add or revise topics affected by that milestone |
| New public API or template syntax | Update `04-integration/` and `03-templating/`; add entry to `meta/changelog-docs.md` |
| No CMS change | No docs PR required |

**Workflow:** edit `.md` → add/update `manifest.json` + `help-topics-meta.json` (for CMS Help) → `npm run build` → update `CONTENTS_INDEX.md` if paths changed → `meta/changelog-docs.md` → commit → PR. `help-manifest.json` is **generated** — do not edit by hand.

| File | Role |
|------|------|
| `manifest.json` | Static site nav — all published topics |
| `help-topics-meta.json` | CMS Help ids, keywords, `ai_topic` (keyed by `.md` path) |
| `help-manifest.json` | **Generated** by `npm run generate:help` |

- After changing or adding docs:
  1. Run `npm run build` (generates help manifest + HTML + content fragments)
  2. Update **CONTENTS_INDEX.md** if you added/renamed topics
  3. Update **meta/changelog-docs.md** with your changes
  4. Commit both `.md`, `.html`, and `content/` files
  5. Push to repository

## 🔗 For integrators (CMS, website, dev portal)

### Option 1: Git submodule (recommended)

In your CMS or website repository:
```bash
git submodule add https://github.com/Raaakete/Birkly-Docs.git docs
```

Then:
- **CMS:** Copy or symlink `docs/` to `admin/docs/` or serve via PHP
- **Website:** Copy to `docs/` folder or build into site
- **Update:** `git submodule update --remote docs` (or pin to specific commit)

### Option 2: Sync script

Create a script in your CMS/website that clones this repo and copies files:
```bash
#!/bin/bash
git clone --depth 1 https://github.com/Raaakete/Birkly-Docs.git temp-docs
cd temp-docs && npm run build
cp -r *.html **/*.html css/ ../admin/docs/  # adjust path
rm -rf temp-docs
```

See **SYNC.md** for complete examples.

### Option 3: Content-only HTML (for website embedding)

The build generates **content-only** HTML files in the `content/` folder. These contain just the doc body (no header, sidebar, or wrapper) and are designed to be embedded in your website's own layout.

**Structure:**
- `content/index.html` — Home page content
- `content/00-overview/what-is-birkly.html` — Doc content (mirrors full HTML path structure)

**Usage in website:**
```javascript
// Fetch and inject content
fetch('docs/content/02-content/collections.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('doc-content').innerHTML = html;
  });
```

The content files preserve the same CSS classes (`doc-summary`, `doc-toggle`, etc.) so you can reuse the docs CSS or style them yourself.

### Option 4: NPM package

```bash
npm install github:Raaakete/Birkly-Docs
```

Then copy the built HTML files to your project.

## 🚀 Local development

1. Clone this repository
2. Run `npm run build` to generate HTML files
3. Open `index.html` in your browser
4. Edit `.md` files and rebuild to see changes

## 📦 Publishing

- **Repository:** Push changes to `main` branch
- **CMS/Website:** Update submodule or run sync script to pull latest
- **NPM:** Run `npm publish` (requires npm account and package name setup)

See **DOCS_ARCHITECTURE.md** for full consumption and linking rules.
