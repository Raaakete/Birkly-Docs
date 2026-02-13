# Syncing Docs to CMS and Website

This guide explains how to consume Birkly Docs in your CMS admin and website.

## Quick Start

### For CMS (in-admin help)

**Option A: Git submodule (recommended)**
```bash
cd /path/to/your-cms
git submodule add https://github.com/Raaakete/Birkly-Docs.git docs
```

Then in your CMS admin, serve docs from `docs/` folder:
- PHP: `include 'docs/index.html'` or route `/admin/docs` to `docs/`
- Copy HTML files to `admin/docs/` and link to them

**Option B: Sync script**
Create `scripts/sync-docs.sh`:
```bash
#!/bin/bash
REPO_URL="https://github.com/Raaakete/Birkly-Docs.git"
DOCS_DIR="admin/docs"

# Clone and build
git clone --depth 1 "$REPO_URL" temp-docs
cd temp-docs
npm run build
cd ..

# Copy HTML files
mkdir -p "$DOCS_DIR"
cp -r temp-docs/*.html temp-docs/**/*.html "$DOCS_DIR/"
cp -r temp-docs/css "$DOCS_DIR/"

# Cleanup
rm -rf temp-docs
echo "Docs synced to $DOCS_DIR"
```

Run: `bash scripts/sync-docs.sh`

### For Website

**Option A: Link to GitHub Pages**
Just link to: `https://yourusername.github.io/birkly-docs/`

**Option B: Git submodule**
Same as CMS, but copy to `website/docs/` or build into your site.

**Option C: Include in build**
If your website uses a build process, add docs as a dependency and copy HTML files.

## Updating Docs

1. **In docs repo:** Make changes, commit, push
2. **GitHub Pages:** Updates automatically (via GitHub Actions)
3. **CMS/Website (submodule):** Run `git submodule update --remote docs` then rebuild
4. **CMS/Website (sync script):** Run the sync script again

## Versioning

- **GitHub Pages:** Always shows latest `main` branch
- **Submodule:** Pin to specific commit: `cd docs && git checkout <commit-hash>`
- **NPM:** Use version tags: `npm install @birkly/docs@1.0.0`
