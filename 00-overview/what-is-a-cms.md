# What is a Content Management System (CMS)?

## Summary

A Content Management System (CMS) is software that lets you create, edit, and organize content for a website or app through a user interface—without editing code or raw files. A CMS stores the content, provides an admin (or “back office”) for editors, and delivers that content to the front (your website or app). Birkly is one such CMS, with a focus on simplicity, file-based storage, and a clear split between “where you edit” (admin) and “what visitors see” (your site).

## Beginner

A **content management system (CMS)** is like a control panel for your website’s content. Instead of opening code or HTML files to change a headline or add a new page, you log in to the CMS, find the content you want (or create something new), edit it in forms and boxes—similar to editing a document—and save. The CMS stores everything; your website then shows that content to visitors.

**Why use one?**

Without a CMS, almost every change needs someone who can edit code or server files. With a CMS:

- You (or your team) can update text, images, and pages yourself.
- You don’t need to wait for a developer for routine updates.
- You can control who can edit what (e.g. some users only edit the blog, others can change settings).

That’s useful for blogs, company sites, portfolios, online shops, event pages, or any site that changes regularly.

**What can you do with a typical CMS?**

- **Create and edit pages and posts** — Add titles, body text, images, and structure (headings, lists, links) through an editor.
- **Upload and reuse media** — Store images and files in a central library and insert them into your content.
- **Organize content** — Group content by type (e.g. “Blog”, “Products”, “Team”) and add metadata (dates, categories, tags).
- **Control who does what** — Give some users permission only to edit content, others to manage settings or users.
- **Publish when ready** — Save drafts and publish (or unpublish) when the content is ready for the public.

Some CMSs also control the full design and layout of the site. Others (like Birkly) focus on **content** and let your own website or app handle design and layout—your site “pulls” content from the CMS via a script or an API.

**Example: before and after using a CMS**

- **Before (no CMS):** To add a new blog post, you (or a developer) create or edit an HTML file, add the title and body, upload an image to the server, and update any index or list page. Every change is a file edit.
- **After (with Birkly):** You log in to the admin, open the “Blog posts” collection, click “New entry,” type the title and content, pick or upload an image, set the date, and click “Save & Publish.” The live site automatically shows the new post where your template lists blog entries. No file editing.

**Birkly in one sentence**

Birkly is a CMS that stores your content as simple files (no database required for content), gives you an admin panel to create and edit it, and lets your website display that content via a small script or an API—so you get the benefits of a CMS without database setup or complex hosting.

## Advanced Users

A CMS provides: (1) a **data model** and **storage** for content, (2) an **admin UI** for CRUD and configuration, (3) **delivery** (API and/or rendered output) to the frontend.

**Architecture comparison**

- **Monolithic CMS (e.g. classic WordPress):** Content, admin, and frontend rendering are in one system; theme and plugins generate HTML on the server.
- **Headless CMS:** Content and admin only; frontend consumes content via API (REST, GraphQL) and renders elsewhere (static site, SPA, mobile app).
- **Birkly:** Headless-style (decoupled): admin at `/admin`, content stored as files (and optionally DB for users/plugins). Delivery via **client library** (script in HTML, fetches API and runs templating in the browser) or **Public API** (REST). So: CMS = content backend; any frontend can consume via API or the provided client script.

**Birkly specifics**

- **Storage:** Content = JSON files under a content directory. Optional DB (e.g. SQLite) for users, sessions, automation, plugins.
- **Admin:** `/admin`; collections, entries, media, settings, roles, plugins, automation.
- **Delivery:** `birkly-client.js` (templating + fetch) or direct `GET /api/public/collections/{handle}/entries` (and optional submit endpoints). No server-side rendering required; can be added by the integrator.

**When to choose a CMS like Birkly**

- You want a clear separation between content and frontend (e.g. multiple sites or apps using the same content, or a static site that pulls content at build or runtime).
- You prefer file-based content (backup, Git, portability) over a database for the content store.
- You need a simple admin for non-technical editors and optional public API/forms for integrations.

## Related

- [What is Birkly?](what-is-birkly.md)
- [Getting started](getting-started.md)
- [Collections](../02-content/collections.md)
