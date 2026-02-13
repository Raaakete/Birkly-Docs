# Slugs and Status

## Summary

Every entry has a **slug** (a short, URL-friendly identifier, e.g. `my-first-post`) and a **status** (Draft or Published). The slug is used in URLs and when loading a single entry in templates or the API; it’s often auto-generated from the title and can be edited. Status controls visibility: only **Published** entries are normally shown on your site and in the Public API. Use **Draft** while working; switch to **Published** when the content is ready to go live. You can change an entry back to Draft to unpublish it without deleting.

## Beginner

**Slug**

The **slug** is the part of the entry that goes in the web address and in the system when “loading this one item.” It’s short, uses only letters, numbers, and hyphens (no spaces or special characters).

**Examples:**

- Title: “Welcome to our blog” → slug: `welcome-to-our-blog`.  
- Title: “How to use Birkly” → slug: `how-to-use-birkly`.  
- You can also set it by hand: e.g. `about-us`, `summer-sale-2025`.

**Where you see it:**

- In the **entry editor** there’s usually a “Slug” field. It’s often filled in automatically from the title when you save (e.g. “My first post” becomes `my-first-post`). You can change it before or after saving.
- On your **website**, the slug often appears in the URL. For example the address of a single blog post might be `/blog/welcome-to-our-blog` or `yoursite.com/post.html?slug=welcome-to-our-blog`. So the slug is what identifies “this post” in the URL.
- **Important:** Two entries in the **same** collection can’t have the same slug. Each must be unique (e.g. you can’t have two blog posts with slug `hello`). If you change a slug after the page is live, old links that used the previous slug will stop working unless you set up redirects.

**Status**

**Status** has two options: **Draft** or **Published**.

- **Draft** — The entry is saved in the CMS but **is not shown** on your live site. Use it for posts or pages you’re still writing or reviewing. Only people with access to the admin can see drafts (and only in the admin, not on the public site).
- **Published** — The entry **is shown** on your site. Use this when the content is ready for visitors. Your templates and the Public API will include it in lists and allow loading it by slug.

**Example:**

You create a new post and set status to **Draft**. You save. The post exists in the admin, but if someone visits your blog list or the post URL, they won’t see it. When you’re ready, you open the entry, change status to **Published**, and save. From then on it appears in the blog list and at its URL. If you want to hide it again later (e.g. a seasonal page), you can set it back to **Draft** instead of deleting it.

**Where to set it:** In the entry editor, near the save button, you’ll see a **Status** dropdown or toggle. Choose Draft or Published. Buttons like **Save & Publish** both save and set status to Published in one click.

## Advanced Users

**Slug:** Unique per collection; stored in entry JSON (e.g. `slug: "welcome-to-our-blog"`). Used in:
- **URLs:** Frontend routing (e.g. `/blog/{slug}` or `?slug=...`).
- **Templates:** Single-entry load, e.g. `{from 'blog' get entry 'welcome-to-our-blog'}`.
- **API:** `GET /api/public/collections/blog/entries/welcome-to-our-blog`.

Auto-generation: often `slugify(title)` (lowercase, spaces → hyphens, remove non-alphanumeric). Uniqueness enforced on save; conflict returns error. Changing slug invalidates existing links; implement redirects (e.g. in server or frontend router) if needed.

**Status:** Stored as `status: "draft"` or `status: "published"`. Filtering:
- **Public API:** List/single endpoints return only published entries unless overridden (e.g. preview token).
- **Templates:** Loops and “get entry” typically respect status (published only). Draft entries excluded from public output.

**Example: API and template**

- List: `GET /api/public/collections/blog/entries` → returns only entries with `status: "published"`.
- Single: `GET /api/public/collections/blog/entries/welcome-to-our-blog` → returns that entry if published; 404 if draft or slug missing.
- Template: `{from 'blog' get entry 'welcome-to-our-blog'}` then `{ title }`; if entry is draft, behaviour is implementation-dependent (often empty or skip).

## Related

- [Entries](entries.md)
- [Collections](collections.md)
- [Variables and output](../03-templating/variables-and-output.md)
- [Loops and lists](../03-templating/loops-and-lists.md)
