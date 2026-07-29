# Variables and Output

In Birkly templates, **variables** are placeholders that get replaced with real values from your content. You write `{ field_name }` and the engine outputs the value of that field for the current entry or context.

## Summary

Use **single braces** with the field name inside: `{ title }`, `{ content }`, `{ date }`. These print the value of that field. Text is usually shown safely (special characters escaped). Rich editor content is often output as HTML so formatting (bold, links, images) appears. For dates you can add a format, e.g. `{ date "F j, Y" }` for “January 5, 2025”. What you can use depends on the current context—e.g. inside a blog loop, `{ title }` is that blog entry’s title.

## Beginner

Variables are the main way to **show one value** from the CMS: a title, a paragraph, a date, or a link to an image or file.

**Basic pattern**

- Write the field name between single braces, with spaces: `{ title }`, `{ content }`, `{ excerpt }`.
- The “current” entry depends on where the variable appears:
  - **Inside a loop** (e.g. “for each blog entry”): `{ title }` is that entry’s title, `{ slug }` that entry’s slug.
  - **On a single-entry page** (e.g. one blog post loaded by slug): `{ title }` is that post’s title.

**Example: single blog post page**

After loading one post (e.g. by slug), your template might look like:

```html
<article>
  <h1>{ title }</h1>
  <time>{ date "F j, Y" }</time>
  <div class="content">
    { content }
  </div>
</article>
```

- `{ title }` → e.g. “Getting started with Birkly”
- `{ date "F j, Y" }` → e.g. “January 5, 2025”
- `{ content }` → the full post body (with HTML: paragraphs, headings, links, images)

**Example: inside a loop**

On a page that lists all blog posts:

```html
{for each entry in 'blog'}
  <h2>{ title }</h2>
  <p>{ excerpt }</p>
  <a href="/blog/{ slug }">Read more</a>
{endfor}
```

Here, each time through the loop, `{ title }`, `{ excerpt }`, and `{ slug }` refer to the **current** post.

**Text vs HTML**

- **Text and Textarea fields:** Shown as plain text. Characters like `<` and `"` are escaped so they don’t break the page or run scripts. Safe by default.
- **Editor (rich text) field:** Output as **HTML** so headings, lists, bold, and links render correctly. Only use editor output in your own templates, not in unfiltered user input.

**When a field is empty**

If you output `{ excerpt }` and the entry has no excerpt, you might get nothing or a blank. To show a fallback, use a conditional: “if this entry has an excerpt, show it; else show something else.” See [Conditionals](conditionals.md).

**Dates**

Use a format string in quotes after the field name: `{ date "F j, Y" }` for “January 5, 2025”, or `{ date "Y-m-d" }` for “2025-01-05”. More options in [Dates and formatting](dates-and-formatting.md).

**Images and files**

- One image from a Media field: `{ media featured_image }` gives you the image URL; put it in `<img src="…">`.
- A file (e.g. PDF): often `{ media document }` or the field name in an `<a href="…">`. See [Media in templates](media-in-templates.md).

## Advanced Users

**Syntax and context**

- **Pattern:** `{ variable_name }` — spaces inside braces; name = field key (or system key like `slug`, `id`, `status`).
- **Context resolution:** Variables resolve against the current scope. In `{for each entry in 'blog'} … { title } … {endfor}`, `title` is resolved on the loop’s current entry. Inside `{from 'blog' get entry 'my-slug'}…{endget}`, variables refer to that entry. Global or page-level variables (e.g. `site_title`) depend on the engine and bootstrap data.

**Output behaviour by field type**

| Field type | Typical output | Notes |
|------------|----------------|--------|
| Text, Textarea | Escaped text | HTML special chars encoded. |
| Editor (rich text) | Raw HTML | Stored HTML inserted as-is. |
| Number | String representation | Format may be configurable. |
| Date / DateTime | Formatted string | Via `{ field "format" }`; see dates doc. |
| Media / File | URL string | Use in `src` or `href`. |
| Select, Radio | Selected option value (or label) | Engine-dependent. |
| Tags | Often a list; may need loop | e.g. `{for each tag in tags}`. |
| Relation | Entry ref(s); may need loop or single entry load | Depends on API shape. |

**Defaults and “if empty”**

Some engines support inline defaults, e.g. `{ title default="Untitled" }` or `{ title or "Untitled" }`. If not, use conditionals: `{if entry has title}{ title }{else}Untitled{endif}`.

**Nested / dotted access**

If the API exposes nested objects (e.g. `author.name`), the engine may support `{ author.name }`. Check the templating reference for your version.

**Technical note**

Variable names align with **field keys** in the collection schema and any system fields the API exposes. The exact set is defined by the content source (API response or content files) and the template engine.

## Related

- [Templating overview](templating-overview.md)
- [Loops and lists](loops-and-lists.md)
- [Conditionals](conditionals.md)
- [Dates and formatting](dates-and-formatting.md)
- [Media in templates](media-in-templates.md)
- [Field types](../02-content/field-types.md)
