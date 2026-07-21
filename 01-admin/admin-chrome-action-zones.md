# Admin chrome & action zones

## Summary

Phase 32 standardizes where actions live in the Birkly admin: primary buttons in the **main actions bar** below the breadcrumb, global utilities in the **top bar** (theme, search, notifications, account), and save actions in a **sticky save bar** on long forms. List tables use compact icon buttons for edit and delete.

## Beginner

**Where to find things**

- **Top bar (always visible):** theme, search (Ctrl+K), notifications, your account.
- **Main actions bar:** the primary action for the page — e.g. *New entry*, *Upload media*, *Customize dashboard*.
- **Sticky save bar:** appears at the bottom of Settings, the entry editor, and the collection editor when you scroll.

**Media library**

- Upload and *New folder* are in the main actions bar.
- Switch between grid and list view with the toggle buttons.
- Select multiple files for bulk delete or move.
- Drag files onto the grid to upload.
- Open a file to edit alt text and focal point.

**Content workflows**

- **Duplicate** an entry from the entries list.
- **Trash** soft-deletes entries; restore them from the Trashed filter.
- **Bulk field edit** updates one field across selected entries.
- **Revision history** in the entry editor sidebar lets you restore older versions.
- **Redirects** under Content → Redirects manages 301/302 rules.

Press **Ctrl+K** (or click the search icon) for global admin search across collections and entries.

## Advanced Users

### Action zone contract

| Zone | Allowed controls |
|------|------------------|
| `.admin-topbar-actions` | Theme, search, notifications, user menu |
| `.main-actions-bar` | Primary CTA left; filters/secondary right |
| `.sticky-save-bar` | Save, cancel, unsaved indicator |
| `.cell-actions` | `.btn-icon--edit`, `.btn-icon--danger` |

Templates should use `page-header` for breadcrumbs only. When breadcrumbs hoist to the topbar, empty in-page headers get `.page-header--hoisted-empty`.

### New fieldtypes (P32)

| Type | Slug | Notes |
|------|------|-------|
| Phone | `phone` | `tel` input with basic validation |
| Toggle | `toggle` | Boolean switch |
| Markdown | `markdown` | Write/preview tabs, stored as markdown |
| oEmbed | `oembed` | YouTube/Vimeo URL embed |
| Code | `code` | Monospace; optional JSON validation |

### APIs

- `GET /api/search.php?action=admin_search&q=…` — global search
- `POST /api/admin_entries.php?action=duplicate` — duplicate entry
- `POST /api/admin_entries.php?action=bulk_field_edit` — bulk field update
- `GET /api/admin_entries.php?action=list_versions` — revision list
- `GET/POST /api/redirects.php` — redirect CRUD
- `GET/POST /api/content.php?action=*_field_template` — field templates

## Related

- [Dashboard](dashboard.md)
- [Admin appearance](admin-appearance.md)
- [Field types](../02-content/field-types.md)
- [Media library](media-library.md)
