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
- **Numbered topic folders** (`00-overview`, `01-admin`, `02-content`, …) — All actual documentation in Markdown, one topic per file.
- **Built HTML files** — Generated from Markdown via `build-static.js`. These are what CMS and website consume.

## 📖 For readers

- Start with **00-overview/getting-started.md** and **00-overview/what-is-birkly.md**.
- Each topic has a **Summary** (for everyone), **Beginner** (plain language), and **Advanced Users** (technical) section so you can read only what you need.
- You can also open `index.html` locally to view the full documentation site.

## ✏️ For maintainers

- Edit only the Markdown files (`.md`) in this repository. Do not duplicate content elsewhere.
- Follow the structure in **DOCS_ARCHITECTURE.md**: every feature/concept has Summary + Beginner + Advanced Users.
- After changing or adding docs:
  1. Run `npm run build` (or `node build-static.js`) to regenerate HTML
  2. Update **CONTENTS_INDEX.md** if you added/renamed topics
  3. Update **meta/changelog-docs.md** with your changes
  4. Commit both `.md` and `.html` files
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

### Option 3: NPM package

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
