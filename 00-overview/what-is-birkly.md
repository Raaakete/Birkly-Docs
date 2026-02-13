# What is Birkly?

## Summary

Birkly is a content management system (CMS) that stores your content as files (JSON) instead of a database. You manage everything in a web admin panel at `/admin`, and your website or app displays content via a small client script or the Public API. It suits small teams, static or dynamic sites, and anyone who wants simple backups, no database setup for content, and the option to use version control (e.g. Git) for content files. Birkly supports collections (content types), entries (individual items), a media library, templating, automation, and optional plugins.

## Beginner

Birkly is software that lets you create and edit your website’s content (pages, blog posts, product listings, events, team members, and more) without writing code. You log in to a web page called the **admin panel**, fill in forms, upload images, and click Save. Your actual website then shows that content automatically.

**How it’s different from editing a “normal” website**

- **Without a CMS:** To change a headline or add a blog post, someone has to edit code or HTML files, then upload or deploy. That usually requires a developer.
- **With Birkly:** You open the admin, click the content you want to change (or click “New entry” to add something), edit the text or image in the form, and save. The site shows the update as soon as visitors load the page (or when the client script fetches the latest content). No coding required.

**Where is my content stored?**

Birkly saves your content as simple files in a format called JSON (a standard, readable text format). These files sit in a **content** folder on the server. That means:

- You don’t need a separate database like MySQL or PostgreSQL for the content itself.
- Backing up can be as simple as copying the content and media folders.
- Teams often put these files in version control (e.g. Git) so they can see who changed what and when.

**Example:** A “Blog posts” collection might have a folder like `content/collections/blog/entries/`. Each post is one JSON file (e.g. `my-first-post.json`) containing the title, content, date, and other fields you defined.

**How does my website show the content?**

Two main options:

1. **Client script (simplest):** You add one script tag to your website’s HTML. That script talks to Birkly, fetches the content, and fills in placeholders you’ve written in the page (e.g. “show the title here,” “list all blog posts”). Your HTML stays static; the script replaces the placeholders when the page loads.
2. **API:** A developer can have your site or app call Birkly’s Public API to get content as data (e.g. JSON) and then display it in a custom layout (e.g. a React or Vue app).

So: you **edit** in Birkly; visitors **see** the result on your site. The admin is never public—only people with an account can log in.

**Who is it for?**

- **Content editors and marketers:** Update text, images, and structure without touching code.
- **Small business owners and designers:** One place to manage all site content and media.
- **Developers:** Connect any frontend (static HTML, React, mobile app) via the client script or the Public API; optional automation (webhooks, scheduled tasks) and plugins for custom behaviour.

**Real-world example**

Imagine a small agency that runs several client websites. They install Birkly once per client (or use one Birkly with different projects). For each site they create collections such as “Services,” “Team,” “Blog,” and “Testimonials.” The client (or the agency) logs in, adds or edits entries, and publishes. The live site pulls the content from Birkly, so the client never has to wait for a developer to “put the new blog post online.”

## Advanced Users

Birkly is a **file-based CMS**: content is stored as JSON in a content directory; an optional database (e.g. SQLite) can be used for users, sessions, and plugins. Admin UI at `/admin`; delivery via **client library** (`birkly-client.js`, templating in HTML) or **Public API** (REST, read and optionally submit).

**Content model**

- **Collections** — Schema for one content type: `handle` (e.g. `blog`, `products`), `fields` (name, type, required, options), `entry method` (admin-only vs public API). Stored as collection config (e.g. `collection.json` + `schema.json`).
- **Entries** — One record per item: field values plus system fields (`slug`, `status`, optional `id`, timestamps). Stored as one JSON file per entry under `content/collections/{handle}/entries/`.
- **Media** — Uploads in a media directory; referenced by filename or ID in entry JSON.
- **Templates** — Simple language: `{ variable }`, `{for each entry in 'collection'}`, `{if}`, `{from 'blog' get entry 'slug'}`. Client fetches from API and renders; or server-side rendering if the stack supports it.

**Example: collection handle and API**

- Collection handle: `blog`.
- List entries: `GET /api/public/collections/blog/entries?limit=10&sort=date:desc`.
- Single entry: `GET /api/public/collections/blog/entries/my-post-slug`.
- Response: JSON array or object with field keys matching the collection schema.

**File-based benefits**

- No MySQL/PostgreSQL for content; lower setup and backup complexity.
- Content is portable (copy folder), Git-friendly (diff, history), and cache-friendly (files can be served or cached by the frontend/reverse proxy).
- Optional DB used for auth, sessions, plugins, automation state—not for the core content store.

**Integration options**

- **Client script:** `<script src="https://your-cms.example.com/birkly-client.js" data-cms-url="https://your-cms.example.com"></script>`. Use templating in the same HTML.
- **Public API:** Read (and, if configured, submit) via REST. No admin auth required for public read; use rate limiting and optional tokens for submit.
- **Webhooks / automation:** Trigger workflows on schedule or via incoming webhooks; call external APIs, send Slack/email, etc.

See [Website integration](../04-integration/website-integration.md), [Public API](../04-integration/public-api.md), [Client library](../04-integration/client-library.md).

## Related

- [What is a CMS?](what-is-a-cms.md)
- [Getting started](getting-started.md)
- [Collections](../02-content/collections.md)
- [Website integration](../04-integration/website-integration.md)
