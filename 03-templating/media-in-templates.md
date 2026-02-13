# Media in Templates

In Birkly templates you output images and other media by referencing a media file (by filename or by field name). You can get a plain URL or, in some setups, request a resized or cropped version.

## Summary

To **show an image** (or file link) from the CMS, use the media helper. Typical: `{ media 'filename.jpg' }` for a file from the Media Library, or `{ media featured_image }` when the current entry has a Media field named `featured_image`. Put the result in `<img src="…">` or `<a href="…">`. Some systems support extra options like **width**, **height**, **crop** for responsive or thumbnail images. For **galleries**, you often loop over the field and output one `<img>` per item. See below for syntax and examples.

## Beginner

Media in templates means **getting the URL** of an image or file so you can use it in `<img src="…">` or `<a href="…">Download</a>`.

**Single image from the Media Library (by name)**

If you uploaded a file (e.g. `logo.svg`) to the Media Library and want to use it anywhere:

```html
<img src="{ media 'logo.svg' }" alt="Company logo">
```

Use the exact filename. The template outputs the full URL to that file.

**Single image from the current entry (by field name)**

If the entry has a Media field, e.g. “Featured image” with key `featured_image`:

```html
<img src="{ media featured_image }" alt="{ title }">
```

Inside a loop, this is the **current** entry’s featured image. On a single-entry page, it’s that entry’s image.

**Always provide an alt text**

Use `alt="{ title }"` or a short description. If the image might be empty, use a conditional so you don’t output a broken image:

```html
{if entry has featured_image}
  <img src="{ media featured_image }" alt="{ title }">
{else}
  <img src="/images/placeholder.jpg" alt="">
{endif}
```

See [Conditionals](conditionals.md).

**Link to a file (e.g. PDF)**

If the entry has a File or Media field pointing to a document:

```html
<a href="{ media document }" download>Download PDF</a>
```

Or: `<a href="{ document }">` — exact syntax depends on the field type; see your templating docs.

**Multiple images (gallery)**

For a Gallery field with several images, you loop and output one `<img>` per item:

```html
{for each image in gallery_field}
  <img src="{ image }" alt="">
{endfor}
```

Variable names may vary (e.g. `image.url` or just the URL in `{ image }`). See [Loops and lists](loops-and-lists.md) and your engine’s docs.

**Thumbnails or resized images**

Some setups let you ask for a resized version, e.g.:

- `{ media featured_image width=400 height=300 }`  
- or `{ media 'hero.jpg' width=1200 crop="center" }`

That would give you a URL to a version that fits those dimensions (or is cropped). If your Birkly version doesn’t support this, use the plain URL and size the image with CSS, or use a separate image service.

## Advanced Users

**Reference types**

| Use case | Typical syntax | Notes |
|----------|----------------|--------|
| Global media by filename | `{ media 'filename.jpg' }` | File from Media Library; name must match. |
| Entry media field | `{ media field_key }` | URL of the selected media for current entry. |
| In loop | `{ media featured_image }` | Current entry’s media field. |

**Optional parameters (when supported)**

- **width / height:** Request a version with max width/height (aspect ratio may be preserved).
- **crop:** e.g. `crop="center"`, `crop="top"` — which part to keep when cropping.
- **fit:** e.g. `fit="cover"` or `fit="contain"` — behaviour when aspect ratio differs.

Exact parameter names and behaviour depend on the engine and any image pipeline (e.g. on-the-fly resizing vs pre-generated sizes). Check admin Help or API docs.

**Gallery / multi-image fields**

- Loop over the field; each item may be a URL string or an object with `url`, `alt`, `width`, `height`.
- Example (conceptual): `{for each image in gallery}` then `src="{ image.url }"` or `src="{ image }"`, `alt="{ image.alt }"` if available.

**File fields (documents)**

- File field often outputs the URL directly: `{ document_field }` or `{ media document_field }`. Use in `<a href="…">` with optional `download` attribute.

**Fallback and accessibility**

- Always guard empty media with a conditional so the DOM doesn’t get an empty `src`.
- Prefer meaningful `alt` (e.g. entry title or short description). Use `alt=""` only for purely decorative images.

**Performance**

- Resized/cropped URLs may point to a generated asset; cache headers and CDN depend on your deployment.
- For galleries, avoid loading many full-size images; use width/height params or thumbnails if the engine supports them.

## Related

- [Variables and output](variables-and-output.md)
- [Conditionals](conditionals.md)
- [Loops and lists](loops-and-lists.md)
- [Field types](../02-content/field-types.md)
- [Media library](../01-admin/media-library.md)
