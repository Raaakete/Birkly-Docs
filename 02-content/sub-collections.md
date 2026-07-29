# Sub-Collections

## Summary

**Sub-collections** are secondary content types attached to a parent collection. Each entry in the parent can hold any number of child items (**sub-entries**) grouped by sub-collection — for example, "Comments" on a Blog post, or "Reviews" on a Product. Sub-collections are defined in the collection schema, managed from the entry editor in the admin, and optionally exposed for public submission via the API.

**Parent → child model:**

```
Collection (e.g. Blog posts)
  └── Entry (e.g. "Welcome post")
        └── Sub-collection: Comments
              └── Sub-entries (one per comment)
```

For top-level lists (many posts, products) use a **collection + entries**. For shared site chrome use the [Site elements pattern](site-elements-pattern.md). See [Content model overview](content-model-overview.md).

## Beginner

A sub-collection is like a mini-collection that lives *inside* each entry. Instead of a separate top-level collection for comments, you attach a "Comments" sub-collection to your Blog posts collection. Every blog post then has its own list of comments, and the admin shows them under that post.

**When would I use sub-collections?**

- **Blog posts → Comments:** Each post can have readers' comments. Admins moderate from the post's entry page.
- **Products → Reviews:** Every product gets its own list of reviews (with rating, author, text).
- **Events → Registrations:** Each event collects attendee sign-ups as sub-entries.
- **Courses → Lessons:** Hierarchical content where each top-level item has child items.

**How to add a sub-collection to a collection**

1. Sidebar → **Content** → click the collection you want to extend (e.g. "Blog posts").
2. Open the collection editor and go to the **Sub-Collections** tab.
3. Click **Add sub-collection** and fill in:
   - **Name** — what editors see, e.g. "Comments".
   - **Handle** — the identifier used in the API and templates, e.g. `comments`. Auto-filled from the name; keep it lowercase with hyphens. Don't change it after sub-entries exist.
   - **Fields** — define the fields for each sub-entry (same field types as regular entries: Text, Textarea, Number, Select, Checkbox, etc.).
   - **Entry method** — who can create sub-entries:
     - **Admin only** — only logged-in editors can add or edit sub-entries. Best for internally curated child content.
     - **Public API** — your website (or a form) can submit sub-entries without logging in. Use for comments, reviews, contact replies.
   - **Auto-publish** — if enabled, new public sub-entries are published immediately. If disabled, they're held as draft for admin review.
4. **Save** the collection. The sub-collection is now part of the schema.

**Viewing and managing sub-entries from the admin**

1. Open any entry in that collection (e.g. open a blog post).
2. In the entry editor, click the **Sub-Entries** tab (in the sidebar or below the entry fields).
3. Choose the sub-collection (e.g. "Comments") from the dropdown if there is more than one.
4. You see the list of sub-entries for this entry. From here you can:
   - **Add** a new sub-entry (fill in the fields you defined and save).
   - **Edit** any existing sub-entry by clicking it.
   - **Delete** a sub-entry — this is permanent.
   - **Change the status** (Draft / Published) of individual sub-entries when they come in via public submission.

**Example: approving a comment**

Someone submits a comment on your blog post via the public form on your website. If auto-publish is off, it arrives with status **Draft**. In the admin:

1. Open the blog post that received the comment.
2. Sub-Entries tab → "Comments".
3. You see the pending comment with status "Draft".
4. Click **Edit**, review the content, and set the status to **Published** if it's appropriate.
5. Save. The comment is now published and visible on your site.

**Good practices**

- Keep **auto-publish off** for publicly submitted content (comments, reviews) unless you trust the source — it prevents spam from going live immediately.
- Give sub-entries **descriptive field names** so editors understand what to fill in.
- Use the **Handle** field consistently in your site's templates and API calls — renaming it later breaks things.

## Advanced Users

Sub-collections are defined in the parent collection's schema under a `sub_collections` array. Each sub-collection has its own field schema, entry method, and auto-publish flag.

**Schema definition (collection.json)**

```json
{
  "name": "Blog Posts",
  "slug": "blog_posts",
  "fields": [ ... ],
  "sub_collections": [
    {
      "name": "Comments",
      "slug": "comments",
      "entry_method": "public",
      "auto_publish": false,
      "schema": {
        "fields": [
          { "name": "author", "type": "Text", "required": true },
          { "name": "content", "type": "Textarea", "required": true },
          { "name": "rating", "type": "Number", "required": false }
        ]
      }
    }
  ]
}
```

**Admin URL pattern for sub-entries**

When navigating to sub-entries for a specific entry in the admin:

```
/admin?page=entries&collection=blog_posts&entry_id=<id>&sub_collection=comments
```

The admin renders the Sub-Entries tab automatically when these params are present.

**Authenticated API (admin)**

| Action | Endpoint |
|--------|----------|
| List | `GET /api/sub_entries.php?action=list&collection=blog_posts&entry_id=<id>&sub_collection=comments` |
| Get | `GET /api/sub_entries.php?action=get&collection=blog_posts&entry_id=<id>&sub_collection=comments&sub_entry_id=<sub_id>` |
| Create | `POST /api/sub_entries.php` with `action=create` in body |
| Update | `POST /api/sub_entries.php` with `action=update` in body |
| Delete | `POST /api/sub_entries.php` with `action=delete` in body |
| Count | `GET /api/sub_entries.php?action=count&collection=blog_posts&entry_id=<id>&sub_collection=comments` |

**Public submission API** (requires `entry_method: "public"`)

```
POST /api/public_sub_entry.php
{
  "parent_collection": "blog_posts",
  "parent_entry_id": "123",
  "sub_collection": "comments",
  "data": {
    "author": "Jane",
    "content": "Great post!"
  }
}
```

Includes rate limiting, honeypot CSRF protection, and automatic status assignment based on `auto_publish`.

**List filters and options**

```json
{
  "collection": "blog_posts",
  "entry_id": "123",
  "sub_collection": "comments",
  "filters": { "status": "published" },
  "options": { "sort": "created_at", "order": "desc", "limit": 10, "offset": 0 }
}
```

Filter operators: `=` (default), `!=`, `>`, `>=`, `<`, `<=`, `contains`, `in`.

**Aggregations**

```json
{
  "action": "aggregations",
  "collection": "blog_posts",
  "entry_id": "123",
  "sub_collection": "comments",
  "aggregations": { "count": true, "avg": "rating" }
}
```

Supported: `count`, `sum`, `avg`, `min`, `max`.

**AI and MCP tools**

The AI (via admin chat or MCP) can read sub-entries using the `list_sub_entries` and `read_sub_entry` tools. Write tools require approval (`require_approval: true` by default). The AI context pack includes sub-collection schema and admin URL patterns; the `read_birkly_docs` MCP tool exposes this guide at the `birkly://docs/sub-collections` topic.

**Automation triggers**

Sub-entry events fire standard automation triggers with extra context:

| Key | Value |
|-----|-------|
| `is_sub_entry` | `true` |
| `parent_collection` | handle of the parent collection |
| `parent_entry_id` | ID of the parent entry |
| `sub_collection` | handle of the sub-collection |

Use the **collection** and **sub-collection pickers** in the automation builder to filter triggers to a specific sub-collection. See [Triggers](../05-automation/triggers.md) for the entry trigger type and picker configuration.

**Hooks**

- `sub_entry_created`
- `sub_entry_updated`
- `sub_entry_deleted`

**Nested sub-entries**

Sub-entries of sub-entries are supported via the `nested` action on the API. Ancestry is tracked automatically.

## Related

- [Content model overview](content-model-overview.md)
- [Collections](collections.md)
- [Entries](entries.md)
- [Site elements pattern](site-elements-pattern.md)
- [Triggers](../05-automation/triggers.md)
- [Public API](../04-integration/public-api.md)
- [Public forms](../04-integration/public-forms.md)
- [AI chat and actions](../01-admin/ai-chat-and-actions.md)
