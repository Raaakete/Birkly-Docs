# Collection Editor

## Summary

The **collection editor** defines a content type: its name, fields, and settings. The main area is for field management (add, reorder, configure types). The **right sidebar** has **Settings**, **Automation**, and **Templating** tabs. Collection slug and entry-method options live in the **Settings** tab, with the same auto-generate slug pattern as the entry editor.

## Beginner

Go to **Content** → **Create collection**, or open an existing collection to edit its schema.

**Layout**

- **Main area (left)** — Collection name, field list, and field configuration.
- **Sidebar (right)** — Three tabs:
  - **Settings** — Collection ID, slug, description, default sort order, entry method (Admin only / Public API).
  - **Automation** — Triggers and workflows tied to this collection (when the Automation plugin is active).
  - **Templating** — Handle, field slugs, and template/API reference.

**Slug (Settings tab)**

The collection slug (handle) is used in templates (`{from 'blog' …}`) and API URLs. It is set in the **Settings** sidebar tab only.

- **Auto-generate slug from title** — Checkbox below the slug field; **on by default**. When checked, the slug follows the collection name as you type.
- **No name** — If you save without a name, Birkly uses the collection **ID** as the fallback for both display name and slug (normalized).
- **Manual slug** — Uncheck the box to set a custom slug. While unchecked, renaming the collection does not change the slug. Re-check to regenerate from the current name or ID.
- You can type a custom slug at any time.

**Sub-collections:** When editing a sub-collection, the sidebar Settings tab uses the same slug checkbox pattern.

## Advanced Users

**Slug parity with entry editor (P29):** Settings tab slug field + **Auto-generate slug from title** checkbox; server paths in `api/admin_collections.php` mirror `birkly_resolve_entry_slug()` ID fallback when name is empty.

**Sidebar tabs:** `.sidebar-tabs` scope fixes empty-tab regression from global `tabs.css`; tab switching JS limited to `.sidebar-tabs`.

**Handle stability:** The slug/handle is referenced in `content/collections/{handle}/`, templates, and `GET /api/public/collections/{handle}/entries`. Avoid changing it after entries exist unless you update all references.

## Related

- [Collections](../02-content/collections.md)
- [Sub-Collections](../02-content/sub-collections.md)
- [Entry editor](entry-editor.md)
- [Slugs and status](../02-content/slugs-and-status.md)
