# Birkly Docs — Content-Only Output Specification

**Audience:** Agent or developer implementing changes in the Birkly-Docs repo.  
**Goal:** Add a content-only output mode so the Birkly website can embed docs with its own layout and styling.

---

## 1. Context and motivation

The Birkly website (marketing site) wants to show documentation using the **website's** header, footer, sidebar, and CSS—not the docs' own layout. The docs content (the actual text and structure) should come from the Birkly-Docs repo.

**Current state:** The docs build outputs full HTML pages (header, sidebar, main content). The website would have to fetch these, parse them, and extract the content—which is fragile and complex.

**Desired state:** The docs build outputs **content-only** HTML fragments (just the main content, no layout). The website fetches these and injects them into its own template. No parsing, no link rewriting.

---

## 2. What to implement

Add a **content-only output** to the existing build. When `node build-static.js` runs, it should:

1. **Keep all existing behavior** — Full HTML pages (index.html, 00-overview/what-is-birkly.html, etc.) continue to be generated as they are now. Nothing is removed or changed for standalone docs.

2. **Additionally** write each doc's content to a `content/` folder, mirroring the path structure.

---

## 3. Output structure

For every doc that gets a full HTML page, also write the **body content only** (the HTML that currently goes inside `<div class="doc-content">...</div>`) to:

```
content/<same-path-as-html>.html
```

**Examples:**

| Full page path | Content-only path |
|----------------|-------------------|
| `index.html` | `content/index.html` |
| `00-overview/what-is-birkly.html` | `content/00-overview/what-is-birkly.html` |
| `02-content/collections.html` | `content/02-content/collections.html` |
| `meta/glossary.html` | `content/meta/glossary.html` |
| `DOCS_ARCHITECTURE.html` | `content/DOCS_ARCHITECTURE.html` |

The content-only file contains **only** the inner HTML of the doc body—no `<!DOCTYPE>`, no `<html>`, no header, no sidebar, no wrapper divs. Just the raw content that would go inside `<div class="doc-content">`.

---

## 4. Implementation details

### 4.1 Where the content comes from

In `build-static.js`, the variable `body` (or `bodyHtml`) is already computed for each doc:

```javascript
const body = mdToHtmlWithToggles(md, htmlPath);
```

This is the exact HTML that goes into `<div class="doc-content">${body}</div>` in the template. **Use this same value** for the content-only output.

For the home page, `homeBody` is used. Use that for `content/index.html`.

### 4.2 What to add to build-static.js

After the existing `fs.writeFileSync` that writes the full HTML page, add:

```javascript
// Content-only output for website embedding
const contentPath = path.join(root, 'content', htmlPath);
const contentDir = path.dirname(contentPath);
if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
fs.writeFileSync(contentPath, body, 'utf8');
```

Apply this for:
- Every doc in `allPaths` (inside the `allPaths.forEach` loop)
- The home page (after writing `index.html`, also write `content/index.html` with `homeBody`)

### 4.3 Path handling

- `htmlPath` is already computed (e.g. `00-overview/what-is-birkly.html`, `index.html`, `meta/glossary.html`).
- The content output path is `content/` + `htmlPath`.
- Ensure `content/` and any subdirectories (`content/00-overview/`, `content/meta/`, etc.) exist before writing.

### 4.4 .gitignore

Add `content/` to `.gitignore` **only if** you want the content output to be generated but not committed (e.g. if it's built in CI). Otherwise, commit it so the website submodule has the files. **Recommendation:** Commit `content/` so the website can use it without running the build.

---

## 5. What the content-only file contains

**Example:** `content/00-overview/what-is-birkly.html`

The file should contain exactly what `mdToHtmlWithToggles` produces for that doc—e.g.:

```html
<div class="doc-summary"><p>Birkly is a content management system...</p></div>
<details class="doc-toggle doc-toggle-beginner"><summary>Beginner</summary><div class="doc-toggle-inner">...</div></details>
<details class="doc-toggle doc-toggle-advanced"><summary>Advanced Users</summary><div class="doc-toggle-inner">...</div></details>
```

- Keep the same class names (`doc-summary`, `doc-toggle`, etc.) so the website can reuse the docs CSS for the content area if desired.
- Do **not** wrap in any extra container. The website will inject this as-is into its own `<div class="doc-content">` or equivalent.

---

## 6. How the website will consume it

The Birkly website will:

1. Have a `docs.html` page with its own header, footer, and sidebar.
2. When the user selects a topic, fetch `docs/content/02-content/collections.html` (or whatever path).
3. Use `fetch()` to get the response as text.
4. Inject the text into the main content area: `container.innerHTML = responseText`.

No parsing, no DOM manipulation of the fetched HTML. Just `innerHTML = responseText`.

**Important:** The website must be served over HTTP (e.g. local server, GitHub Pages). `fetch()` does not work with `file://` URLs.

---

## 7. Links inside the content

The content HTML may contain links like:

```html
<a href="02-content/collections.html">Collections</a>
<a href="../03-templating/templating-overview.html">Templating overview</a>
```

These links are **relative to the original doc's location**. When the content is injected into the website's `docs.html`, the "current page" is `docs.html`, so relative links would resolve incorrectly.

**Recommendation:** Keep links as-is. The website's docs loader will intercept link clicks, read the `href`, and load the corresponding content file instead of navigating. This is the website's responsibility, not the docs build.

---

## 8. Checklist for the implementing agent

- [ ] Add content-only output to `build-static.js` without changing existing full-page output.
- [ ] Write `content/index.html` for the home page.
- [ ] Write `content/<path>.html` for every doc in `allPaths`.
- [ ] Ensure `content/` and subdirectories are created before writing.
- [ ] Run `node build-static.js` and verify `content/` folder is populated.
- [ ] Verify a content file (e.g. `content/00-overview/what-is-birkly.html`) contains only the doc body HTML, no full page wrapper.
- [ ] Update `.gitignore` only if content output should not be committed (otherwise, commit `content/`).
- [ ] Document the new output in README or SETUP.md if appropriate.

---

## 9. File reference

**File to modify:** `build-static.js`

**Relevant variables:**
- `body` — the doc content (from `mdToHtmlWithToggles`)
- `homeBody` — the home page content
- `htmlPath` — e.g. `00-overview/what-is-birkly.html`
- `root` — the docs repo root directory

**New output directory:** `content/` (at repo root)
