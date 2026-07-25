# Client Library

The Birkly client library is a JavaScript file (`birkly-client.js`) that you add to your website. It connects to your Birkly CMS, fetches content, and renders the templating syntax in your HTML so you don’t need to write API calls or rendering logic yourself.

## Summary

**Add one script tag** to your page: `src` = your Birkly base URL + `/birkly-client.js`, and `data-cms-url` = the same base URL. The script then loads your content and replaces placeholders like `{ title }` and `{for each entry in 'blog'}` with real data. You can optionally set `data-collection` to a default collection. No build step is required—include the script and use the template language in your HTML.

## Beginner

The **client library** is a small script that does the “fetch content and fill in the page” work for you. You don’t need to learn the API or write `fetch()` calls—just include the script and use the template tags.

**Including the script**

Put this before the closing `</body>` tag. Use your real Birkly URL instead of `your-cms-domain.com`:

**Production:**

```html
<script src="https://your-cms-domain.com/birkly-client.js"
        data-cms-url="https://your-cms-domain.com"></script>
```

**Local development:**

```html
<script src="http://localhost:8080/birkly-client.js"
        data-cms-url="http://localhost:8080"></script>
```

- **src** — Where the browser loads the script from. Usually the same as your CMS URL.
- **data-cms-url** — The base URL the script uses for API requests (e.g. to fetch entries). It must point to your Birkly instance. Your site’s domain must be allowed by the CMS (CORS).

**Optional: default collection**

Some versions support `data-collection` so the page “belongs” to one collection (e.g. for single-entry pages where the slug comes from the URL):

```html
<script src="https://your-cms.com/birkly-client.js"
        data-cms-url="https://your-cms.com"
        data-collection="blog"></script>
```

**What happens when the page loads**

1. The script runs after the page (DOM) is ready.
2. It finds the **outermost** elements in `<body>` that contain Birkly template syntax (`{ title }`, `{for each entry in 'blog'}`, `{if}`, etc.).
3. It figures out which collection(s) to request (from those tags, the URL, or `data-collection`).
4. It calls the Birkly public API (e.g. “give me all blog entries” or “give me the entry with this slug”). **Only published entries** are returned for public pages.
5. It replaces the placeholders with the real content: titles, links, dates, images. Loops and conditionals are evaluated.
6. The visitor sees the updated page. No extra click or reload is needed for content to appear.

**Template regions**

You can put template tags in any HTML element — not only `<main>`. The client renders each **outermost** element that contains template syntax. Example: Marsk’s fullscreen menu is a `<div class="overlay-menu">` with a `<nav>` loop inside; the parent div is rendered as one region.

If a loop renders nothing, check that entries are **published** in the CMS (draft entries are invisible on the public site).

**Example: blog index**

```html
<main>
  <h1>Blog</h1>
  {for each entry in 'blog'}
    <article>
      <h2><a href="/blog/{ slug }">{ title }</a></h2>
      <time>{ date "F j, Y" }</time>
      <p>{ excerpt }</p>
    </article>
  {endfor}
</main>
<script src="https://cms.example.com/birkly-client.js"
        data-cms-url="https://cms.example.com"></script>
```

The client sees `{for each entry in 'blog'}`, fetches blog entries from the API, then repeats the block for each entry and fills in `{ title }`, `{ slug }`, `{ date }`, `{ excerpt }`.

**If something goes wrong**

- If the CMS is down or returns an error, placeholders might stay as-is or show nothing. Open the browser’s Developer Tools (Console and Network tabs) to see errors or failed requests.
- Make sure the Birkly **public API** is enabled and that **CORS** allows your website’s domain. Otherwise the browser will block the requests.

## Advanced Users

**Script attributes**

| Attribute | Purpose |
|-----------|---------|
| `src` | URL of `birkly-client.js` (same origin as CMS or CMS domain). |
| `data-cms-url` | Base URL for API requests. Required. |
| `data-collection` | Default collection for the page (when not inferred from template or URL). |
| (others) | Version-dependent: e.g. language, preview mode, API key for protected content. |

**Template syntax**

The client uses the same syntax as the rest of the templating docs: `{ variable }`, `{for each entry in 'collection'} … {endfor}`, `{if} … {endif}`, `{ date "format" }`, `{ media … }`. See [Templating overview](../03-templating/templating-overview.md) and related docs.

**API calls**

- Typically: `GET {data-cms-url}/api/public.php?action=list_entries&collection=blog` for lists, and `action=get_entry` with `slug` for one item.
- The client may batch requests via **`page_bundle.php`** (POST JSON with a `requests` array) so one round-trip loads multiple collections for a page.
- **`page_snapshot.php`** serves pre-built bundle JSON from `cache/page-snapshots/` when your publish pipeline generates snapshots (faster first paint).
- **`birkly-hydrate.js`** + inline `BIRKLY_PAGE_SNAPSHOT` (or site-specific snapshot global) can hydrate the DOM from a snapshot before falling back to live API reads.

**Page bundle example (advanced)**

```javascript
// POST /api/page_bundle.php
{
  "language": "en",
  "requests": [
    { "type": "list_entries", "into": "blog", "collection": "blog" },
    { "type": "get_entry", "into": "about", "collection": "about", "slug": "about" },
    { "type": "list_collection_groups", "into": "collection_groups" }
  ]
}
```

Response: `{ "status": "ok", "data": { "blog": [...], "about": {...}, "collection_groups": [...] } }`.

When your HTML uses `{for each group in collection_groups}`, the client includes a `list_collection_groups` request automatically (or reads it from a snapshot). See [Collection groups](../02-content/collection-groups.md).

**Errors and fallbacks**

- On network or API error, the script may leave placeholders unchanged, show a minimal fallback, or expose an error in the console. No admin credentials are sent; failures are “no data” rather than auth leaks.
- For debugging: check Console for script errors and Network for status codes and response bodies.

**Programmatic use**

Some builds expose a global or module API (e.g. `Birkly.getEntries('blog')`) so you can fetch content and render it yourself (e.g. in a SPA). This is optional and version-dependent; see the Birkly docs or client source for your release.

## Related

- [Website integration](website-integration.md)
- [Public API](public-api.md)
- [Templating overview](../03-templating/templating-overview.md)
