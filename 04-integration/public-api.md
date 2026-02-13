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

- **URL:** `https://your-cms.com/api/public/collections/blog/entries`
- **Method:** GET
- **No login** required.

You’ll get back something like (exact shape depends on your version):

```json
[
  {
    "title": "Getting started",
    "slug": "getting-started",
    "content": "<p>Hello world.</p>",
    "date": "2025-01-05",
    "excerpt": "A short summary.",
    "status": "published"
  },
  ...
]
```

**Reading one entry by slug**

To get a single post (e.g. for a “post detail” page):

- **URL:** `https://your-cms.com/api/public/collections/blog/entries/getting-started`
- **Method:** GET

Replace `getting-started` with the entry’s slug. Response is usually one JSON object with that entry’s fields.

**Using the data**

- In **JavaScript (browser):** Use `fetch()` or axios to call the URL, then render the JSON (e.g. with React components or by updating the DOM).
- On the **server:** Your backend (PHP, Node, etc.) can call the same URL, get JSON, and pass it to your template engine or send it to the frontend.

**Example: fetch in the browser**

```javascript
const base = 'https://your-cms.com';
const slug = 'my-post-slug'; // e.g. from the URL

fetch(`${base}/api/public/collections/blog/entries/${slug}`)
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
- **Typical read paths** (adjust to your version):
  - List entries: `GET /api/public/collections/{collection_handle}/entries`
  - Single entry: `GET /api/public/collections/{collection_handle}/entries/{slug}`
  - Collections list: if supported, e.g. `GET /api/public/collections`
- **Submit:** Usually `POST /api/public/collections/{handle}/entries` or a dedicated submit/form endpoint. See [Public forms](public-forms.md) and your API docs.

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

## Related

- [Website integration](website-integration.md)
- [Client library](client-library.md)
- [Public forms](public-forms.md)
- [Collections](../02-content/collections.md)
