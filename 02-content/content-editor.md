# ContentEditor

ContentEditor is Birkly's rich text fieldtype. Stored values are **pure HTML** — no proprietary JSON. All editor code lives under `fieldtypes/ContentEditor/` in the platform.

## Summary

Use the **ContentEditor** field type (aliases: `editor`, `media`) for long formatted body content. Editors get a toolbar for bold, headings, lists, and links, plus **block components** (callout, quote, CTA button, table, image embed). Optional **preview CSS** shows your site styles in the admin without saving CSS into the entry HTML. Content round-trips: save → reload → same HTML in templates and Public API.

## Beginner

**Adding ContentEditor to a collection**

1. Edit your collection schema.
2. Add a field with type **ContentEditor** (or **Editor**).
3. Optional: set **Preview CSS URL** (`css_url`) to your site's stylesheet for WYSIWYG preview in admin only.
4. Save. New and existing entries show the visual editor for that field.

**Toolbar basics**

- Inline: bold, italic, underline, strikethrough
- Blocks: paragraph, heading levels, bullet and numbered lists
- Link: insert or edit hyperlinks
- **Components**: open the components menu to insert reusable blocks

**Blocks (components)**

Blocks are HTML snippets with optional scoped CSS. Bundled blocks:

| Block | Use for |
|-------|---------|
| **Callout** | Tips, warnings, highlights |
| **Quote** | Pull quotes with attribution |
| **CTA button** | Prominent link/button |
| **Table** | Simple data tables |
| **Image embed** | Figure with caption from media library |

To insert: toolbar → **Components** → choose block → fill fields in the dialog → insert. Blocks appear as structured HTML in the field. You can edit text inside a block after insert.

**Visual vs HTML tabs**

- **Visual** — WYSIWYG editing with toolbar and blocks.
- **HTML** — raw source for fine control. Switching tabs runs a round-trip sync so content is not lost.

**Example: blog post body**

| Field | Type | Notes |
|-------|------|-------|
| Title | Text | |
| Slug | Text | |
| Body | ContentEditor | `css_url`: `/css/site.css` for preview |

In templates: `{ body }` outputs the saved HTML.

## Advanced Users

**Architecture**

```
fieldtypes/ContentEditor/
├── ContentEditor.php       # PHP field class, toolbar markup
├── editor.js               # Lifecycle
├── commands/               # Modular formatting commands
├── components/bundled/     # Shipped blocks
├── core/sync-manager.js    # Visual ↔ HTML round-trip
└── tests/                  # html_roundtrip_test.php, etc.
```

**Schema options**

| Key | Purpose |
|-----|---------|
| `css_url` | Project stylesheet for admin preview only |
| `required` | Validation |

**Component registry**

- Bundled: `fieldtypes/ContentEditor/components/bundled/`
- Custom: `content/components/` via `/api/components.php`
- JS client: `ContentEditorComponentRegistry`

**Stored format**

Pure HTML string. Blocks render as semantic HTML (e.g. `<aside class="birkly-callout">`). No JSON blob in entry files — safe for `{ body }` in templates and API consumers.

**Tests**

```bash
php fieldtypes/ContentEditor/tests/html_roundtrip_test.php
php tests/run.php
```

## Related

- [Field types](field-types.md) — all field types including Editor alias
- [Entries](entries.md)
- Platform: `fieldtypes/ContentEditor/README.md`
