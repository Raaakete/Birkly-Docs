# Canonical template syntax

Birkly has **one canonical templating language** for site HTML and (with admin extensions) for the CMS admin panel. Use this document as the single source of truth — not legacy `{{ }}` examples or archived engines.

## Summary

Use **single braces** `{ }` and plain-English directives. The canonical loop form is **`{for each item in source}`** … **`{endfor}`**. Public sites render via `birkly-client.js` + `api/public.php`; the admin panel renders via `admin/template_parser.php` + `admin/templates/*.html`.

## Beginner

### Variables

```html
{ title }
{collection.slug}
{entry.author}
```

Inside a loop, names refer to the **current** item (e.g. `{ title }` inside `{for each entry in 'blog'}`).

### Loops (canonical)

```html
{for each entry in 'blog'}
  <article>
    <h2><a href="/blog/{ slug }">{ title }</a></h2>
  </article>
{endfor}
```

- `{for each … in …}` — preferred form (also accepted: `{for item in items}` without `each`)
- Collection handle is usually quoted: `'blog'`, `'pages'`
- Close with `{endfor}`

### Collection groups (public site)

```html
{for each group in collection_groups}
  <h2>{ name }</h2>
  {for each slug in group.collections}
    <a href="/{ slug }/">{ slug }</a>
  {endfor}
  {for each child in group.children}
    <h3>{ child.name }</h3>
  {endfor}
{endfor}
```

Loaded from `list_collection_groups` / page bundle into `collection_groups`. Max tree depth: 3. See [Collection groups](../02-content/collection-groups.md).

### Conditionals

```html
{if 'blog' has entries}
  … loop …
{else}
  <p>No posts yet.</p>
{endif}
```

```html
{if entry has excerpt}
  <p>{ excerpt }</p>
{endif}
```

### Admin-only helpers

Used in `admin/templates/` only:

| Syntax | Purpose |
|--------|---------|
| `{admin_url 'page'}` | Admin page URL |
| `{admin_url 'entry-editor' collection='collection.slug'}` | URL with query params |
| `{translate 'admin.key'}` | i18n string |
| `{count entries}` | Array length |
| `{json variable}` | JSON for `<script>` data |
| `{include_script 'file.js'}` | Load `/admin/js/file.js` |

## Advanced Users

### Engines (do not mix)

| Context | Engine | Location |
|---------|--------|----------|
| **Public site** | Client renderer | `birkly-client.js` |
| **Admin UI** | PHP template parser | `admin/template_parser.php` |
| ~~Legacy~~ | ~~TemplateEngine~~ | **Archived** — `archive/legacy-templating/` |

There is no third active engine. `render_page.php` and `templates/template_engine.php` are archived (M3).

### Syntax rules

1. **Single braces** `{directive}` — not `{{ }}` (deprecated in admin).
2. **Loops:** `{for each <var> in <source>}` … `{endfor}`.
3. **Existence:** `{if <path> exist}` or `{if 'collection' has entries}`.
4. **Comparison:** `{if entry.status == 'published'}`.
5. **Published-only on public API:** loops via `api/public.php` and `page_bundle.php` return **published** entries only. Draft entries exist in the CMS but render as empty on the live site until published.

### Where the client renders templates

`birkly-client.js` scans `<body>` for the **outermost** HTML elements whose content includes Birkly template tags (`{for`, `{from`, `{if`, field placeholders, etc.) and renders each region in place. You do **not** need `<main>`, `<header>`, or `<nav>` specifically — any wrapper (`<div class="overlay-menu">`, `<section>`, etc.) works.

Optional: add `data-birkly-region` on an element to make the intent explicit (useful in complex layouts).

**`<title>`** is handled separately when it contains template syntax.

**Not rendered:** tags inside `<script>` / `<style>`, or nested inside another template region (the parent region wins).

### UI decoupling (admin)

Admin templates contain **markup only**. API calls and DOM logic live in `admin/js/*.js`. Reference: `admin/templates/activity.html` + `admin/js/activity.js`. See Birkly repo `docs/admin-templating.md`.

### eval() note

Admin parser currently compiles to PHP via `eval()` — a known security debt. Replacement plan: Birkly repo `docs/admin-template-eval-replacement-plan.md` (interpreter, no new dependencies).

## Related

- [Templating overview](templating-overview.md)
- [Loops and lists](loops-and-lists.md)
- [Conditionals](conditionals.md)
- [Variables and output](variables-and-output.md)
