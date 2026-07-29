# Templating Overview

Birkly uses a simple templating language in your HTML: placeholders like `{ title }` and blocks like `{for each entry in 'blog'}` are replaced with real content from the CMS when the page is rendered.

## Summary

**Templating** is how your website displays Birkly content. In your HTML you write variables (e.g. `{ title }`), loops (e.g. `{for each entry in 'blog'} … {endfor}`), and conditionals (e.g. `{if} … {endif}`). The Birkly client script in the browser—or server-side rendering—fetches content and replaces those placeholders. You use single braces `{ }`, plain-English style tags, and safe output by default. No full programming language is required—just the syntax described in the templating docs.

**Canonical reference:** [Canonical template syntax](canonical-syntax.md) — single source of truth for `{for each}` and engine boundaries. **Stack choice:** [Choose your stack](../04-integration/choose-your-stack.md). **Regions:** [Web components (templating)](web-components.md).

## Beginner

Templating is the bridge between your **content in Birkly** and what **visitors see** on your site. You don’t paste content by hand into every page; instead you leave “slots” in your HTML and Birkly fills them with the right data.

**What you actually do**

1. **Write your page layout** in HTML (headings, sections, columns, styles) as you normally would.
2. **Insert template tags** where content should come from the CMS:
   - Show a title: `{ title }`
   - Show a list of blog posts: `{for each entry in 'blog'} … {endfor}` with `{ title }`, `{ slug }`, etc. inside
   - Show something only when it exists: `{if entry has excerpt} … {endif}`
3. **Publish or open the page.** The Birkly client (or your server) loads content from Birkly and swaps the tags for real text, links, and images.

**Example: a simple blog index page**

Your HTML might look like this:

```html
<h1>Our Blog</h1>

{for each entry in 'blog'}
  <article>
    <h2><a href="/blog/{ slug }">{ title }</a></h2>
    <time>{ date "F j, Y" }</time>
    <p>{ excerpt }</p>
  </article>
{endfor}
```

When the page runs, the loop runs once per blog entry. Each article shows that entry’s title (linked), date, and excerpt. You don’t edit this HTML when you add a new post—Birkly does it automatically.

**Where does the replacement happen?**

- **In the browser (client-side):** A small script (`birkly-client.js`) runs on your page, asks Birkly for content (e.g. “give me all blog entries”), and then finds the template tags in the page and replaces them. This works well for static HTML sites without a server language.
- **On the server (server-side):** Some setups use PHP or another language to load content and render the same template tags before sending HTML to the visitor. The idea is the same; only the place where it runs is different.

**Is it safe?**

Yes. Plain text (e.g. from a Text or Textarea field) is usually **escaped**: characters like `<` and `>` are turned into safe form so they can’t inject scripts. Rich editor content is often output as **HTML** on purpose so headings and links look correct—Birkly is designed so that content comes from your own CMS, not from random visitors.

**What to read next**

- [Variables and output](variables-and-output.md) — How to display a single value: `{ title }`, `{ content }`, dates, media.
- [Loops and lists](loops-and-lists.md) — How to list all entries or items (blog index, tags, gallery).
- [Conditionals](conditionals.md) — How to show or hide blocks with `{if}`.
- [Dates and formatting](dates-and-formatting.md) — How to format dates (e.g. “January 5, 2025”).
- [Media in templates](media-in-templates.md) — How to show images and file links.

## Advanced Users

**Architecture**

1. **Template source:** HTML (or a server-rendered view) contains the Birkly template syntax.
2. **Content source:** The Birkly client (browser) or a server-side renderer loads content via the Birkly API (or content files on disk).
3. **Engine:** Replaces variables `{ field }`, loops `{for each …}`, conditionals `{if} … {endif}`, and helpers (e.g. `{ media … }`, `{ date "format" }`) with actual data.
4. **Output:** Final HTML with content in place. Text/textarea typically escaped; editor (rich text) output as HTML.

**Key syntax (concise)**

| Concept | Typical syntax | Notes |
|--------|-----------------|--------|
| Variable | `{ variable_name }` | Single braces, spaces; name = field key. |
| Loop (collection) | `{for each entry in 'collection'}` … `{endfor}` | Inside loop, variables refer to current entry. |
| Single entry | `{from 'blog' get entry 'slug'}` … `{endget}` | Load one entry by slug; vars inside the block refer to it. |
| Conditional | `{if condition}` … `{else}` … `{endif}` | e.g. `{if 'blog' has entries}`, `{if entry has excerpt}`. |
| Date format | `{ date_field "F j, Y" }` | PHP-style format string. |
| Media | `{ media 'file.jpg' }` or `{ media field_name }` | URL; some engines support width/height/crop. |

**Environments**

- **Client-side:** `birkly-client.js` fetches from the public API, walks the DOM (or a cloned fragment), replaces placeholders, and injects the result. No build step required; works with static HTML.
- **Server-side:** PHP (or other) can load entries from API or from content files and run the same template rules before sending HTML. Same syntax; different execution and no CORS/API exposure to the client.

**Safety**

- Escaping is applied to plain-text fields by default. Editor/HTML fields are intentionally rendered as HTML; only use them in trusted templates. The exact behaviour (which field types are escaped vs raw) is documented per field type in the admin Help or [Field types](../02-content/field-types.md).

**Related**

- [Variables and output](variables-and-output.md)
- [Loops and lists](loops-and-lists.md)
- [Conditionals](conditionals.md)
- [Dates and formatting](dates-and-formatting.md)
- [Media in templates](media-in-templates.md)
- [Web components (templating)](web-components.md) — `<birkly-region>`, Light DOM patterns
- [Reference projects](reference-projects.md) — six starter sites (live client only)
- [Production optimization](production-optimization.md) — optional hydrate/snapshot/bake
- [Choose your stack](../04-integration/choose-your-stack.md)
- [Website integration](../04-integration/website-integration.md)
- [Client library](../04-integration/client-library.md)
