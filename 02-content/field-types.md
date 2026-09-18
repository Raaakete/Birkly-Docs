# Field Types

## Summary

Field types define what kind of data each field in a collection can hold: short text, long formatted text, numbers, dates, images, choices from a list, and more. Choosing the right type gives editors the right input (e.g. a date picker for dates, a media picker for images) and keeps content consistent for templates and the API. Common types include Text, Textarea, Editor (rich text), **File** (single media asset; aliases **image**, **media**), Gallery, Number, Date, Select, Checkbox, Tags, URL, Email, Password, Markdown, and Dynamic items; there are more for relations, colors, maps, and oEmbed.

## Beginner

When you add a field to a collection, you choose a **field type**. That type decides what the editor sees (a single line, a calendar, a list of images) and what can be stored. Here’s when to use each and what it looks like.

**Text and long-form**

- **Text** — One line. Use for: titles, names, short labels.  
  **Example:** Title = “Welcome to our blog”; Product name = “Blue widget”.

- **Textarea** — Several lines of plain text (no bold or links). Use for: short descriptions, summaries, captions.  
  **Example:** Excerpt = “This post explains how to get started with Birkly in five steps.”

- **Editor** (type `content-editor`; alias `editor`) — Rich content with **Visual** and **HTML** tabs. Stored value is pure HTML. Supports project CSS preview, slash commands, and bundled components (callout, quote, CTA button). See Advanced Users below.

**Media**

- **File** (type `file`; aliases `image`, `media`) — One file (image or document). Use for: featured image, logo, one PDF. The editor picks from the Media Library; the entry stores a **media id**.  
  **Templates:** `{media_url('hero')}` · `{media_img('hero', 'Alt text')}` — see [Core template shelf](../03-templating/core-template-shelf.md).  
  **Example:** Featured image = media id for `hero.jpg`; Brochure = id for `brochure.pdf`.

- **Gallery** — Several images (or files) in order. Use for: product photos, image carousels, before/after sets. You can reorder them.  
  **Templates:** `{gallery_html('photos')}` or loop ids with `{media_img(id)}`.  
  **Example:** Product images = array of media ids.

**Numbers and dates**

- **Number** — A number (whole or decimal). Use for: price, quantity, rating, weight. You can set min/max if needed.  
  **Example:** Price = 29.99; Stock = 100.

- **Date** — Just the date (no time). Use for: publication date, event date, birth date.  
  **Example:** Publication date = 2025-02-05.

- **DateTime** — Date and time. Use for: event start, scheduled publish time.  
  **Example:** Event start = 2025-03-15 14:00.

**Choices**

- **Select** — One choice from a list you define. Use for: category, status, size.  
  **Example:** Status = “Published”; Category = “Tutorials”.

- **MultiSelect** — Several choices from a list. Use for: multiple categories or fixed “tags.”  
  **Example:** Categories = [“Tutorials”, “News”].

- **Radio** — Same as Select but shown as radio buttons (good when there are only a few options).

- **Checkbox** — One yes/no. Use for: “In stock,” “Featured,” “Show on homepage.”  
  **Example:** In stock = checked.

- **Tags** — Free-form tags: the editor types a word and presses Enter, then another. Use for: flexible tagging (e.g. “birkly”, “cms”, “tutorial”).  
  **Example:** Tags = [“news”, “welcome”, “2025”].

**Links and identity**

- **URL** — A web address. Use for: “Website,” “Video link,” “More info.”  
  **Example:** Website = “https://example.com”.

- **Email** — An email address. Use for: contact email, author email.  
  **Example:** Contact = “hello@example.com”.

- **Phone** — A phone number with basic format validation. Use for: contact phone, support line.  
  **Example:** Phone = “+1 555 0100”.

- **Toggle** — A yes/no switch (same idea as Checkbox, different UI). Use for: feature flags, enable/disable options.

- **Markdown** — Long-form text with a Write/Preview tab. Stored as markdown; rendered to HTML on output. Use for: docs-style body content when you want plain-text source.

- **oEmbed** — A video or embed URL (YouTube, Vimeo). Stores the URL and renders an embed preview in the editor.

- **Code** — Monospace text for snippets or JSON. Optional JSON mode validates syntax on save. `$` and `${name}` in snippets are preserved in storage and templates.

- **Password** — Secrets (hashed at rest). MCP and public API reads show `[redacted]` only. On the **storefront**, `{'field'}` renders as **`••••••`** (never the raw secret). Leave blank when editing in admin to keep the existing hash.

**Less common but useful**

- **Relation** — Link to other entries (e.g. “Author” from a “Team” collection). Stored as structured items; templates: `{relation_titles('related')}` · `{relation_links('related')}`.
- **Color** — A colour (e.g. for brand or theme). Stored as a hex code.
- **DynamicItems** — Repeating blocks: each “item” has its own set of fields (e.g. FAQ: question + answer; Steps: title + description). Use when one entry needs several similar blocks. Templates: `{dynamicitems_html('blocks')}` — blocks are entry JSON, not a collection loop.

- **Map** — Latitude/longitude (and optional label). Templates: `{map_html('location')}` for an OSM embed.

- **Range** — Numeric slider value with min/max in field config. Storefront: `{range_html('band', 0, 100)}` renders a read-only `<meter>` — not an interactive admin slider.

**Example: choosing types for a “Team member” collection**

| Field   | Type   | Why |
|---------|--------|-----|
| Name    | Text   | Short name. |
| Role    | Text   | Job title. |
| Bio     | Editor | Long text with formatting. |
| Photo   | File   | One image (media library). |
| Email   | Email  | Contact email. |
| LinkedIn| URL    | Profile link. |

**Required:** You can mark a field as **required** so the entry can’t be saved until that field is filled. Use that for things that must always be there (e.g. Title, Content).

## Advanced Users

**Storage and output:** Each type maps to a JSON value type (string, number, boolean, array, object). Editor/rich text stored as HTML; `file` / `gallery` as media id(s); `markdown` rendered to HTML in templates when schema type is `markdown`. Aliases normalize at save (`image`→`file`, `editor`→`contenteditor`, `richtext`→`contenteditor`). Invalid types such as `boolean` or `json` are rejected — use `checkbox`/`toggle` or `code` (JSON mode) / sub-collections.

**Reference table (key types):**

| Type       | Storage example      | Template / API note |
|------------|----------------------|----------------------|
| Text       | `"Hello"`            | `{'name'}` |
| Textarea   | `"Plain\nlines"`     | `{'body'}` |
| Editor     | `"<p>Hi</p>"`        | Trusted HTML via `{'content'}` |
| Markdown   | `"# Hi"`             | Rendered HTML via `{'body'}` when type is `markdown` |
| File       | `"media-id"`         | `{media_url('hero')}` · `{media_img('hero', 'Alt')}` |
| Gallery    | `["id1","id2"]`      | `{gallery_html('photos')}` or loop + `{media_img(id)}` |
| Number     | `29.99`              | `{'price'}` |
| Date       | `"2025-02-05"`       | `{created_at format "F j, Y"}` (system dates) |
| Select     | `"published"`        | `{'status'}` |
| Tags       | `["a","b"]`          | Loop `{for each tag in 'tags'}` or comma list via `{'tags'}` |
| Relation   | `[{id, title?, …}]`  | `{relation_titles('related')}` · `{relation_links('related')}` |
| Password   | hash at rest         | MCP/API `[redacted]`; storefront `{'secret'}` → `••••••` |
| Dynamic items | block array       | `{dynamicitems_html('blocks')}` |
| Map        | `{lat,lng,…}`        | `{map_html('location')}` |
| Range      | number + field min/max | `{range_html('band', min, max)}` |
| Checkbox   | `0`/`1`              | Filters use `'1'`; storefront Yes/No pills via presentation layer |

**Shelf model:** Fieldtypes can register template helpers; core provides [Core template shelf](../03-templating/core-template-shelf.md) for media, gallery, map, range, oEmbed, relation, and Dynamic items. Use **parenthesis** syntax: `{media_img('hero', 'Alt')}`.

**Options (type-specific):** Select/MultiSelect: list of options (value + label). Number: min, max, step, decimals. Editor: allowed blocks/tools. Relation: target collection, single vs multiple. Add fields in collection editor; keys become entry JSON and template variables. See [Variables and output](../03-templating/variables-and-output.md), [Media in templates](../03-templating/media-in-templates.md).

**ContentEditor (advanced):** Type `content-editor` stores pure HTML. Visual and HTML tabs stay in sync. Optional `css_url` on the field enables project CSS preview in the toolbar. Bundled components (callout, quote, CTA button) insert structured HTML blocks; custom components live under `fieldtypes/ContentEditor/components/`. Commands are modular (`inline-format`, `block-format`). Demo alias: schemas may use `editor` — normalized to `content-editor` at bootstrap.

## Related

- [Collections](collections.md)
- [Entries](entries.md)
- [Content editor](content-editor.md) — tables, grids, layout studio
- [Variables and output](../03-templating/variables-and-output.md)
- [Media in templates](../03-templating/media-in-templates.md)
- [Core template shelf](../03-templating/core-template-shelf.md)
