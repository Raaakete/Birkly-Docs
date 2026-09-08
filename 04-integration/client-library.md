# Client Library

The Birkly client library is a JavaScript file (`birkly-client.js`) that you add to your website. It connects to your Birkly CMS, fetches content, and renders the templating syntax in your HTML so you don’t need to write API calls or rendering logic yourself.

## Summary

**Add one script tag** to your page: `src` = your Birkly base URL + `/birkly-client.js`, and `data-cms-url` when the page is not on the CMS host. The script replaces `{title}`, `{'excerpt'}`, and `{for each entry in 'blog'}` with published data, and auto-loads active plugin storefront scripts (User, Commerce, Events). How-to: [Client setup](../03-templating/client-setup.md) · [Project sites and plugins](../03-templating/project-sites-and-plugins.md).

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
2. It finds the **outermost** Light DOM elements that contain Birkly template syntax (`{title}`, `{for each entry in 'blog'}`, `{if}`, etc.), plus `data-birkly-region` / `<birkly-region>`.
3. It figures out which collection(s) to request (from those tags, the URL, or `data-collection`).
4. It calls the Birkly public API / **page bundle**. **Only published entries** are returned for public pages.
5. It replaces the placeholders with real content. Loops, `ordered by`, conditionals, and `{entry for}` forms are handled.
6. The visitor sees the updated page.

**Template regions**

You can put template tags in any HTML element — not only `<main>`. The client renders each **outermost** element that contains template syntax, and any element marked with **`data-birkly-region`** or **`<birkly-region>`**. Example: Marsk’s fullscreen menu is a `<div class="overlay-menu">` with a `<nav>` loop inside; the parent div is rendered as one region.

If a loop renders nothing, check that entries are **published** in the CMS (draft entries are invisible on the public site).

**One-line regions**

```html
<birkly-region collection="site_elements" entry="header"></birkly-region>
```

See [Web components](web-components.md) and [Choose your stack](choose-your-stack.md).

**Example: blog index**

```html
<main>
  <h1>Blog</h1>
  {for each entry in 'blog' with status = published ordered by newest}
    <article>
      <h2><a href="post.html?collection=blog&slug={slug}">{title}</a></h2>
      <time>{created_at format "F j, Y"}</time>
      {if entry has 'excerpt'}<p>{'excerpt'}</p>{endif}
    </article>
  {endfor}
</main>
<script src="https://cms.example.com/birkly-client.js"
        data-cms-url="https://cms.example.com"></script>
```

See [Loops and lists](../03-templating/loops-and-lists.md) and [Detail pages](../03-templating/detail-pages-and-url-context.md).

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

The client uses the canonical public language: `{title}` / `{'field'}`, `{for each}…{endfor}` with `with` / `ordered by` / `limit N`, `{if}…{endif}`, `{created_at format "…"}`. There is no `{ date "…" }` or `{ media … }` helper. See [Canonical syntax](../03-templating/canonical-syntax.md) and [Cheat sheet](../03-templating/cheat-sheet.md).

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

**Programmatic API (`window.Birkly`)**

| API | Purpose |
|-----|---------|
| `Birkly.processTemplates({ root?, silent?, force? })` | Discover and render Light DOM regions. Omit args for full document. `root` scopes to a subtree (the root itself is included if it is a region). `force` re-processes nodes marked `data-birkly-processed="1"`. |
| `Birkly.processRegion(host, options?)` | Prepare + process a `<birkly-region>` / attributed host. |
| `Birkly.getEntryBySlug(collection, slug)` | Resolve one published entry (async). |
| `Birkly.fetch(action, params?)` | Low-level public API helper (e.g. `'list_entries'`, `{ collection: 'blog' }`). |
| `Birkly.render(html, data)` | Run the string template engine once; returns HTML string (does not discover DOM regions). |
| `Birkly.renderEngine` | Full engine object (`discoverPageRegions`, `buildRegionTemplate`, `render`, …). |
| `Birkly.submit(…)` | Public form submit helper. |

```js
// Scoped re-render after a dynamic mount
await Birkly.processTemplates({ root: document.querySelector('#island'), silent: true });

const post = await Birkly.getEntryBySlug('blog', 'welcome');
const html = Birkly.render('<h1>{title}</h1>', post);
```

**Events**

| Event | Where | When |
|-------|-------|------|
| `birkly:api-ready` | `document` | `Birkly.cmsUrl` resolved |
| `birkly:plugins-ready` | `document` | Plugin storefront scripts loaded |
| `birkly:client-ready` | `document` | Full client init (templates + binders) |
| `birkly:region-processed` | Region element (bubbles) | After that region’s HTML/text is written |
| `birkly:templates-processed` | `document` | After a **full-document** `processTemplates()` finishes (`detail.regions` = count) |

```js
document.addEventListener('birkly:templates-processed', () => {
  console.log('All page regions ready');
});
el.addEventListener('birkly:region-processed', (e) => {
  console.log('Region done', e.detail);
});
```

**Optional: `birkly-components.js` (enhance-only)**

Load after the client. Helpers must **never** wipe CMS `innerHTML`.

```html
<script src="https://your-cms.com/birkly-client.js" data-cms-url="https://your-cms.com"></script>
<script src="https://your-cms.com/birkly-components.js"></script>
<script>
  document.addEventListener('birkly:templates-processed', function () {
    BirklyComponents.setActiveNav(document);
  });
</script>
```

- `BirklyComponents.setActiveNav(root?, currentPage?, { linkSelector, activeClass }?)`
- `<birkly-enhance-nav>` — same on connect; no `innerHTML` writes

For SPA frameworks, prefer JSON + components over DOM template discovery — [SPA (React / Vue)](spa-react-vue.md).

## Related

- [Client setup](../03-templating/client-setup.md)
- [Project sites and plugins](../03-templating/project-sites-and-plugins.md)
- [Choose your stack](choose-your-stack.md)
- [Website integration](website-integration.md)
- [Web components](web-components.md)
- [SPA (React / Vue)](spa-react-vue.md)
- [SSR and build-time](ssr-and-build-time.md)
- [Public API](public-api.md)
- [Public forms](public-forms.md)
- [Templating overview](../03-templating/templating-overview.md)

