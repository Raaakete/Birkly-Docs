# Content Overview

## Summary

The Content area is where you manage your content types (collections) and the actual content (entries) in Birkly. You’ll see a list of all collections; clicking one opens its entries. From here you create new collections, define their fields, and create or edit entries. Media and Settings support content but live in their own sections; Content is the main workspace for structure and copy.

## Beginner

**Content** in the sidebar is your main workspace for everything that will appear on your site: blog posts, products, team members, services, and so on. It’s organized in two levels:

1. **Collections** — The “types” of content (e.g. “Blog posts,” “Products,” “Team”).
2. **Entries** — The individual items inside each type (one blog post, one product, one team member).

**What you see when you open Content**

- A **list of collections**, organized into **groups** (with optional nested subgroups). Each group can show a name and emoji icon; collections can show icon and description on cards or in list view.
- A button or link to **Create collection** (or “New collection”) so you can add a new content type.
- When you **click a collection**, the view changes to show the **entries** in that collection: a list of titles, dates, and status (Draft/Published), with options to add or edit.

**Example workflow**

1. You want to run a blog. You click **Create collection**, name it “Blog posts,” and add fields: Title, Content, Publication date, Featured image. You save. The new collection appears in the Content list.
2. You click “Blog posts.” The list is empty. You click **New entry**, write your first post, set the slug and status to Published, and save. The entry appears in the list.
3. Next time you open “Blog posts,” you see all posts. You click one to edit it or click **New entry** again to add another.

**How Content fits with other areas**

- **Media** — When you’re editing an entry and a field is “Media” or “Gallery,” you’ll pick (or upload) files from the Media Library. So you upload in **Media**, but you *attach* those files to entries in **Content**.
- **Templates / your website** — The way your site displays content (e.g. which page shows one post vs a list) is defined in your site’s templates or routing. The actual text and images live in **Content** (and Media).
- **Forms on your site** — If a collection is set to allow “Public API” submissions, your website can create new entries (e.g. contact form, newsletter signup) without anyone logging into the admin. Those entries still show up in the same collection in **Content** so you can review or edit them.

For step-by-step instructions on creating a collection and its fields, see [Collections](../02-content/collections.md) and [Collection editor](collection-editor.md). For creating and editing individual items, see [Entries](../02-content/entries.md) and [Entry editor](entry-editor.md).

## Advanced Users

Content is the admin UI for the content model: **collections** (schema) and **entries** (records).

- **Collections:** Stored as config (e.g. `collection.json` + `schema.json` per collection). List view reads the content directory or registry; “Create collection” adds a new schema (handle, fields, entry method). Editing a collection updates field definitions and settings; handle should stay stable for API and templates.
- **Collection groups:** Tree in `content/collections/groups.json` (max depth 3). Admin drag-and-drop updates membership and order; public API and templates expose the same tree as `collection_groups`. See [Collection groups](../02-content/collection-groups.md).
- **Entries:** One file per entry (e.g. `content/collections/blog/entries/{slug-or-id}.json`) or DB rows. Entry list is derived from that store; “New entry” creates a new record; editor loads one entry by id/slug and saves back. Status (draft/published) and slug are system fields; rest are collection-defined.
- **Public API submissions:** When entry method is “Public API,” entries can be created via `POST /api/public/collections/{handle}/entries` (or equivalent). Those entries appear in the same collection list; may be draft by default depending on config.

Workflow: define collection once → add/edit entries. Media is referenced by field type Media/Gallery; templates and frontend consume via API or client script. See [Collections](../02-content/collections.md), [Entries](../02-content/entries.md), [Public API](../04-integration/public-api.md).

## Related

- [Entry editor](entry-editor.md)
- [Collection editor](collection-editor.md)
- [Collection groups](../02-content/collection-groups.md)
- [Collections](../02-content/collections.md)
- [Entries](../02-content/entries.md)
- [Media library](media-library.md)
