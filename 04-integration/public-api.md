# Public API

The Public API is how external applications (your website, mobile app, or another server) read—and sometimes submit—content from Birkly over HTTP. It returns JSON and is intended for unauthenticated or limited-access use so that public sites can safely consume content.

## Summary

The **Public API** lets you **read** content from Birkly via HTTP. Typical usage: `GET` your CMS URL + something like `/api/public/collections/blog/entries` to get a list of blog entries as JSON, or `/api/public/collections/blog/entries/my-post-slug` to get one entry. No admin login is needed—it’s designed for public read access. You can use it from the Birkly client script, from your own frontend, or from a backend. To **create** entries (e.g. from a form), use the public submit endpoint and any security (tokens, rate limits) your setup provides; see [Public forms](public-forms.md).

## Beginner

The **Public API** is a way for your website or app to **ask Birkly for content** over the internet. You send an HTTP request (like opening a URL) and get back data (usually JSON) that you can display or process.

**Why use it?**

- The **Birkly client** (script tag) uses this API automatically. If you use the client, you’re already using the Public API under the hood.
- If you **don’t** use the client—e.g. you have a React app, or a server that builds pages—you can call the same API yourself and render the data however you want.

**Reading a list of entries**

Example: get all published blog entries.

- **URL:** `https://your-cms.com/api/public.php?action=list_entries&collection=blog`
- **Method:** GET (or POST with JSON body)
- **No login** required.

**Listing collections**

- **URL:** `https://your-cms.com/api/public.php?action=list_collections`
- **Response shape:** `{ "status": "ok", "data": { "collections": [ { "id", "title", "slug" }, ... ] } }`

**Listing collection groups (tree)**

- **URL:** `https://your-cms.com/api/public.php?action=list_collection_groups`
- **Method:** GET (or POST with JSON body)
- **No login** required.
- **Response shape:** `{ "status": "ok", "data": { "groups": [ { "id", "name", "icon?", "collections": ["handle", ...], "children"? }, ... ] } }`
- Groups mirror `content/collections/groups.json` (nested up to 3 levels). Use this to build site navigation or sectioned index pages. See [Collection groups](../02-content/collection-groups.md).

**Reading one entry by slug**

To get a single post (e.g. for a “post detail” page):

- **URL:** `https://your-cms.com/api/public.php?action=get_entry&collection=blog&slug=getting-started`
- **Method:** GET

**Using the data**

- In **JavaScript (browser):** Use `fetch()` or axios to call the URL, then render the JSON (e.g. with React components or by updating the DOM).
- On the **server:** Your backend (PHP, Node, etc.) can call the same URL, get JSON, and pass it to your template engine or send it to the frontend.

**Example: fetch in the browser**

```javascript
const base = 'https://your-cms.com';
const slug = 'my-post-slug'; // e.g. from the URL

fetch(`${base}/api/public.php?action=get_entry&collection=blog&slug=${slug}`)
  .then(res => res.json())
  .then(entry => {
    document.getElementById('title').textContent = entry.title;
    document.getElementById('content').innerHTML = entry.content;
  });
```

**Limits and sorting**

Many APIs support query parameters, for example:

- `?limit=10` — only 10 entries
- `?sort=date:desc` — newest first
- `?offset=20` or `?page=2` — for pagination

Exact parameter names depend on your Birkly version; check the API docs or admin Help.

**Submitting data (forms)**

Creating or updating entries (e.g. contact form) is done through a **submit** or **form** endpoint, often with extra security (token, rate limit). See [Public forms](public-forms.md). Don’t use admin credentials from the frontend.

## Advanced Users

**Purpose**

- **Read** published content (collections, entries, media URLs) for display on websites or in apps.
- **Submit** entries when the collection allows “Public API” and the submit endpoint is configured (see [Public forms](public-forms.md)).
- **No admin auth** for read—safe to call from the browser or any server without storing credentials.

**Base URL and paths**

- **Base:** Birkly instance base URL (e.g. `https://your-cms.com`).
- **Endpoint:** `GET` or `POST` `/api/public.php` with `action` parameter (and JSON body for POST actions).
- **Common actions:**
  - `list_collections` — returns `{ id, title, slug }` per collection (`title` falls back from `name` if needed)
  - `list_collection_groups` — returns nested group tree from `groups.json` (`id`, `name`, optional `icon`, `collections` handles, optional `children`)
  - `list_entries` — `collection` (slug) required; returns published entries
  - `get_entry` — `collection` + `slug` (or `entry_id`)
  - `get_collection_info` — metadata for one collection
- **Batch reads:** `POST /api/page_bundle.php` with `{ language, requests: [...] }` — see [Client library](client-library.md).
- **Snapshots:** `GET /api/page_snapshot.php?page=index` — cached bundle JSON when publish pipeline wrote snapshots.
- **Submit:** Usually `POST` to public submit endpoints for form collections. See [Public forms](public-forms.md).

**Response format**

- **JSON.** List endpoints return an array of entry objects; single-entry returns one object. Field keys match the collection schema (title, content, slug, date, etc.). Meta (total count, pagination) may be present depending on version.

**Query parameters (common)**

| Parameter | Purpose | Example |
|-----------|---------|---------|
| limit | Max entries returned | `?limit=10` |
| sort | Sort order | `?sort=date:desc` |
| offset / page | Pagination | `?offset=20` or `?page=2` |
| status | Filter by status; often only “published” by default | Version-dependent |

**Authentication**

- **Read:** Typically none. Public read is intended for unauthenticated callers. Restriction by domain is via CORS or server config, not HTTP auth.
- **Submit:** May require API key, token, or CAPTCHA. See [Public forms](public-forms.md) and collection/settings docs.

**CORS**

If you call the API from the browser, the Birkly server must send CORS headers allowing your origin. Configure allowed origins in Birkly or your reverse proxy.

**Rate limiting**

Public endpoints may be rate-limited (e.g. N requests per minute per IP). Check response headers (e.g. `X-RateLimit-*`) or docs for limits and back-off behavior.

### List collection groups

Returns the collection group tree configured in the admin Content overview. Same structure as `content/collections/groups.json` after normalization.

**Request**

```
GET /api/public.php?action=list_collection_groups
```

**Response (example)**

```json
{
  "status": "ok",
  "data": {
    "groups": [
      {
        "id": "marketing",
        "name": "Marketing",
        "icon": "📣",
        "collections": [],
        "children": [
          {
            "id": "blog-group",
            "name": "Blog",
            "collections": ["blog", "news"]
          }
        ]
      },
      {
        "id": "ungrouped",
        "name": "Ungrouped",
        "collections": ["contact"]
      }
    ]
  }
}
```

**Page bundle**

```json
{
  "language": "en",
  "requests": [
    { "type": "list_collection_groups", "into": "collection_groups" }
  ]
}
```

The client auto-prefetches `collection_groups` when templates use `{for each group in collection_groups}`. See [Collection groups](../02-content/collection-groups.md) and [Loops and lists](../03-templating/loops-and-lists.md#collection-groups).

## Related

- [Website integration](website-integration.md)
- [Client library](client-library.md)
- [Public forms](public-forms.md)
- [Collection groups](../02-content/collection-groups.md)
- [Collections](../02-content/collections.md)
