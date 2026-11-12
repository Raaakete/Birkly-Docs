# Publishing Docs

Birkly-Docs is the only product manual. CMS installs do not copy articles into the admin.

## CMS Help

When someone opens Help, the browser loads the current article from the docs origin:

`{docs_base_url}/content/{docs_path}`

Default host: `https://docs.birkly.io`. The CMS asks that host for `help-manifest.json` (the topic list) and does not store the article body. A publish on this repo shows up the next time Help opens. No CMS update is required.

If the origin cannot be reached, Help says documentation is unavailable. There is no bundled snapshot.

The CMS repo may keep a copy of `help-manifest.json` at `docs/help-manifest.json` so tests can see the topic-list shape. That copy is not the article.

Plugin how-tos are not in this repo. They ship in each plugin and render on that plugin’s Docs tab.

## Website

**Option A: Content-only HTML (recommended for custom layouts)**
The docs build generates content-only HTML files in `content/` folder. These contain just the doc body (no header/sidebar) and can be embedded in your website's layout:

```javascript
// In your website's docs page
fetch('docs/content/02-content/collections.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('doc-content').innerHTML = html;
  });
```

**Option B: Git submodule**
```bash
git submodule add https://github.com/Raaakete/Birkly-Docs.git docs
```

Then use either:
- Full HTML pages: `docs/index.html`, `docs/00-overview/what-is-birkly.html`, etc.
- Content-only: `docs/content/index.html`, `docs/content/00-overview/what-is-birkly.html`, etc.

**Option C: Include in build**
If your website uses a build process, add docs as a dependency and copy HTML files (full or content-only).

## Updating Docs

1. Change the Markdown in this repo and run `npm run build`.
2. Publish this repo (Dokploy on `main`, or the GitHub Pages workflow).
3. Open Help in any CMS install. The article is the new origin fragment.

Do not copy HTML into `admin/docs/` and do not add this repo as a CMS submodule to host Help.

## Versioning

- **docs.birkly.io:** The deployed `main` branch.
- **NPM:** Use version tags: `npm install @birkly/docs@1.0.0`
