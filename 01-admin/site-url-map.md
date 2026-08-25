# Site URL Map (Discovery SEO)

**Discovery → SEO → Site URL Map** is the only place to configure how each URL on your site appears in Google and social networks.

## Three layers

| Layer | What it covers |
|-------|----------------|
| **Site defaults** | Fallback title, description, OG image for the whole site |
| **Per-page SEO** | One row per static project page (`index.html`, `about.html`, …) |
| **Per-item SEO** | Detail URLs (blog posts, products) from collection + template bindings |

## Workflow

1. Open **Discovery → SEO** and turn the SEO pack on.
2. Click **Rescan project** to discover HTML files under `project/`.
3. Configure **detail bindings** (collection ↔ template file). Templates with `<meta name="birkly-collection" content="slug">` are auto-detected.
4. Optional: override title/description per URL row; add **redirects** (301/302).
5. **Publish SEO** — updates sitemap, injects meta tags, and materializes detail URLs.

## Detail bindings

Each binding links:

- A **collection** (e.g. `blog`)
- A **template file** (e.g. `post.html`)
- An **excerpt field** (auto-guessed: `excerpt`, `summary`, `teaser`, …)

Published entries get a URL map row. SEO defaults from entry **title** + excerpt; overrides are optional per row.

## Pretty URLs (optional)

Set a **URL pattern** on a binding, e.g. `/blog/{slug}`. Birkly routes that path to the detail template without query strings.

## SSR vs client rendering

| Mode | How SEO applies |
|------|-----------------|
| **Server (SSR)** | Meta tags injected during server render |
| **Client** | `birkly-client.js` fetches `/api/public/seo-context.php` and applies head tags on boot |

Same published map powers both — no duplicate configuration.

## Entry editor

The entry **Meta Data** tab is removed. For collections with a detail binding, use **Search listing in Discovery** on the entry sidebar.

Legacy `meta_title` / `meta_description` on entries are imported into the URL map on first SEO publish after upgrade.

## Related

- [Discovery overview](discovery.md)
- [Detail pages and URL context](../03-templating/detail-pages-and-url-context.html)
