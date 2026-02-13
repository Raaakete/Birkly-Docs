# Field Types

## Summary

Field types define what kind of data each field in a collection can hold: short text, long formatted text, numbers, dates, images, choices from a list, and more. Choosing the right type gives editors the right input (e.g. a date picker for dates, a media picker for images) and keeps content consistent for templates and the API. Common types include Text, Textarea, Editor (rich text), Media, Gallery, Number, Date, Select, Checkbox, Tags, URL, and Email; there are more for relations, colors, maps, and repeating blocks.

## Beginner

When you add a field to a collection, you choose a **field type**. That type decides what the editor sees (a single line, a calendar, a list of images) and what can be stored. Here’s when to use each and what it looks like.

**Text and long-form**

- **Text** — One line. Use for: titles, names, short labels.  
  **Example:** Title = “Welcome to our blog”; Product name = “Blue widget”.

- **Textarea** — Several lines of plain text (no bold or links). Use for: short descriptions, summaries, captions.  
  **Example:** Excerpt = “This post explains how to get started with Birkly in five steps.”

- **Editor** (or “Content editor” / “Rich text”) — Formatted text: bold, italic, headings, bullet lists, links, images. Use for: blog body, product description, any long content that needs formatting.  
  **Example:** Content = a full blog post with headings, paragraphs, and an image in the middle.

**Media**

- **Media** — One file (image or document). Use for: featured image, logo, one PDF. The editor picks from the Media Library.  
  **Example:** Featured image = “hero.jpg”; Brochure = “brochure.pdf”.

- **Gallery** — Several images (or files) in order. Use for: product photos, image carousels, before/after sets. You can reorder them.  
  **Example:** Product images = [“product-1.jpg”, “product-2.jpg”, “product-3.jpg”].

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

**Less common but useful**

- **Relation** — Link to other entries (e.g. “Author” from a “Team” collection, or “Category” from a “Categories” collection). The editor picks one or more entries from another collection.
- **Color** — A colour (e.g. for brand or theme). Stored as a hex code.
- **DynamicItems** — Repeating blocks: each “item” has its own set of fields (e.g. FAQ: question + answer; Steps: title + description). Use when one entry needs several similar blocks.

**Example: choosing types for a “Team member” collection**

| Field   | Type   | Why |
|---------|--------|-----|
| Name    | Text   | Short name. |
| Role    | Text   | Job title. |
| Bio     | Editor | Long text with formatting. |
| Photo   | Media  | One image. |
| Email   | Email  | Contact email. |
| LinkedIn| URL    | Profile link. |

**Required:** You can mark a field as **required** so the entry can’t be saved until that field is filled. Use that for things that must always be there (e.g. Title, Content).

## Advanced Users

**Storage and output:** Each type maps to a JSON value type (string, number, boolean, array, object). Editor/rich text often stored as HTML string; Media/Gallery as filename or ID (or array of). Templates and API expose these; use the right helper (e.g. `{ media field }` for Media, format string for Date).

**Reference table (key types):**

| Type       | Storage example      | Template / API note |
|------------|----------------------|----------------------|
| Text       | `"Hello"`            | `{ field }` escaped |
| Textarea   | `"Plain\nlines"`     | Same |
| Editor     | `"<p>Hi</p>"`        | Output as HTML |
| Media      | `"hero.jpg"` or id   | `{ media field }` → URL |
| Gallery    | `["a.jpg","b.jpg"]`  | Loop for URLs |
| Number     | `29.99`              | `{ field }` |
| Date       | `"2025-02-05"`       | `{ field "F j, Y" }` |
| Select     | `"published"`        | `{ field }` |
| Tags       | `["a","b"]`          | Loop or join |
| Relation   | `"entry-id"` or []   | Resolve to entry object |
| Checkbox   | `true`/`false`       | Conditional in template |

**Options (type-specific):** Select/MultiSelect: list of options (value + label). Number: min, max, step, decimals. Editor: allowed blocks/tools. Relation: target collection, single vs multiple. Add fields in collection editor; keys become entry JSON and template variables. See [Variables and output](../03-templating/variables-and-output.md), [Media in templates](../03-templating/media-in-templates.md).

## Related

- [Collections](collections.md)
- [Entries](entries.md)
- [Variables and output](../03-templating/variables-and-output.md)
- [Media in templates](../03-templating/media-in-templates.md)
