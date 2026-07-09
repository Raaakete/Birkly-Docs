# Studio production builder

**Summary:** WYSIWYG design canvas, live client preview, template engine v2, CSS studio, and section presets inside the Studio IDE.

## Design canvas

The visual canvas applies your project's compiled styles (`kit.css`, `generated.css`, `custom.css`) so the editor looks like the published site—not dashed preview boxes only.

- Toggle **Outlines** to show or hide selection chrome
- Insert **section presets** (Hero, Features, Blog grid, CTA) from the sidebar

## Live preview

Use the **Live** view in the Studio toolbar to preview collection data inside the admin:

| View | What you see |
|------|----------------|
| Visual | Design canvas with project CSS |
| Code | Compiled HTML |
| Live | iframe with `birkly-client.js` and real data |
| Split | Visual + code side-by-side |

The preview refreshes automatically when you save.

## Template engine v2

Published pages use server-side rendering with advanced binding support:

- **Conditionals** — `{if entry has 'price' <= 10}…{endif}`
- **Sub-entry loops** — `{for each comment in 'comments' of 'blog'.'first-post'}…{endfor}`
- **Template functions** — `{upcoming_events}`, commerce helpers via `page_bundle`
- **Ordered + limit** — `{for each entry in 'blog' ordered by newest limit 3}…{endfor}`

The binding wizard includes steps for conditional, sub-entry, and template-function blocks.

## CSS panel

Inspector tabs:

| Tab | Purpose |
|-----|---------|
| CSS | Element styles (margin, padding, color, etc.) |
| Stylesheets | Edit `custom.css`; view Generated and Kit (read-only) |
| Page | Meta title and description (compiled into `<head>`) |

The **class manager** on the Properties tab lets you add and remove CSS classes with kit-aware suggestions.

## Section presets

One-click insert from the Sections sidebar:

- **Hero** — centered headline, subtitle, CTA button
- **Features** — three-column feature grid
- **Blog grid** — post cards with collection loop
- **CTA banner** — call-to-action strip

Presets use kit classes (`.hero`, `.product-card`, etc.) so published pages look professional immediately.

## Layout tools

- **Box model overlay** — drag margin and padding handles on selected elements
- **Column resize** — drag column borders in multi-column sections
- **Align toolbar** — left, center, right alignment

## Content panel

The **Content** sidebar lists your collections. Expand a collection to browse fields; click a field to insert `{ field_name }` into the selected element or binding template.

## Plugin blocks

With Commerce and Events plugins active:

- **Product card grid** — reference-quality commerce markup
- **Events list** — upcoming events via template function

## Quality assurance

Studio includes an automated smoke test run in CI:

```bash
./scripts/studio-smoke.sh
```

This compiles a fixture project, publishes, and verifies SSR output has no raw template tags.

## See also

- [Studio getting started](getting-started.md) — create projects, publish, export
- Birkly core: `plugins/studio/docs/production-builder.md` (developer reference)
