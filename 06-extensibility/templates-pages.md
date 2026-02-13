# Templates (Page Templates)

Page templates in Birkly define which HTML template file and which content (collection or entry) are used to render a given URL. They connect URLs to your static or dynamic pages so the right layout and data are shown.

## Summary

**Page templates** (or “templates” in the routing sense) map **URLs** to **content and layout**. For example: `/blog` uses the blog list template and the “blog” collection; `/blog/my-post` uses the single-post template and the entry with slug `my-post`. In file-based setups you might have `templates/home.html`, `templates/post.html`, etc., and a router or the client library decides which template to use based on the path. You edit the HTML/template files and the content in the CMS; the system ties them together. Exact behavior depends on your Birkly version (client-side vs server-side).

## Beginner

**Page templates** answer: “For this URL, which HTML layout do we use and which content do we show?” So when a visitor goes to `/blog`, they see the “blog list” layout filled with blog entries; when they go to `/blog/my-first-post`, they see the “single post” layout filled with that one post.

**The three pieces**

1. **URL** — What the visitor requested (e.g. `/blog`, `/blog/hello-world`).
2. **Template file** — An HTML file that contains your layout (header, footer, structure) and the Birkly template tags (`{ title }`, `{for each entry in 'blog'}`, etc.).
3. **Content** — The data from the CMS (one collection, one entry, or a list of entries). The system loads this and fills the template’s placeholders.

**Example: simple setup**

- **URL:** `/blog`  
  **Template:** `templates/blog.html` (has `{for each entry in 'blog'} … {endfor}`).  
  **Content:** All published entries from the “blog” collection.

- **URL:** `/blog/hello-world`  
  **Template:** `templates/post.html` (has `{ title }`, `{ content }`, `{ date }`).  
  **Content:** The blog entry with slug `hello-world`.

So the same template file can be used for “all posts” (with a loop) or “one post” (with one entry); the router or client decides which entry(s) to load based on the URL.

**How it works in practice**

- **Static HTML + client:** Your site might be a few static files: `index.html`, `blog.html`, `post.html`. The server just serves the file that matches the path (or a single `index.html` with client-side routing). The Birkly client script then runs, sees the template tags, and fetches the right collection/entry (e.g. from the URL or `data-collection`). So “routing” is: which file was requested, and what slug or collection the client infers from the URL.
- **Server-side (e.g. PHP):** The server looks at the request path, picks a template file and which entry or collection to load, renders the template with that data, and returns HTML. One URL → one template + one data load.

**Where template files live**

Often a `templates/` folder at the project root: `home.html`, `page.html`, `post.html`. The exact names and how the server or client maps URLs to them depend on your deployment. See [Website integration](../04-integration/website-integration.md) and your project’s docs.

## Advanced Users

**Role of page templates**

- **URL** → which **template file** (HTML with placeholders) and which **collection/entry** to load.
- **Template file** — Birkly template syntax + layout (header, footer, CSS).
- **Content** — From CMS (collection + entry or list); injected at render time.

So: templates = structure and placeholders; CMS = data; routing = mapping URL → template + data.

**Client-side vs server-side**

| Mode | How routing works | Typical use |
|------|-------------------|-------------|
| **Client (birkly-client.js)** | Static HTML files (e.g. `blog.html`, `post.html`). Client infers collection/entry from URL or `data-collection`; fetches from API; fills placeholders. | Static hosting, no server language. |
| **Server (e.g. PHP)** | Router (e.g. `render_page.php`) matches path to template + collection/entry; loads content (API or files); renders server-side; returns HTML. | SSR, SEO, single entry point. |

**Defining routes**

- Some setups have a **routes** or **pages** config (file or admin) mapping path patterns to template + collection. Others use convention (e.g. `/blog` → `templates/blog.html` + collection `blog`).
- **Single entry by slug:** URL often includes slug (e.g. `/blog/my-first-post`); system loads that entry from the collection and renders with the single-entry template.

**Template file location**

- Commonly `templates/` at project root: `home.html`, `page.html`, `post.html`. Names and mapping are deployment-specific; see [Website integration](../04-integration/website-integration.md) and your server/client setup.

## Related

- [Website integration](../04-integration/website-integration.md)
- [Templating overview](../03-templating/templating-overview.md)
- [Client library](../04-integration/client-library.md)
