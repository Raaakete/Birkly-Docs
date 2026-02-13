# Loops and Lists

Loops in Birkly templates let you repeat a block of HTML for each entry in a collection or for each item in a list (e.g. tags, gallery images). You use them to build listing pages (all blog posts, all products) or to output multiple items (tags, gallery).

## Summary

To **list all entries** of a collection, use a loop. Typical syntax: `{for each entry in 'blog'}` … `{endfor}`. Between the tags you write the layout for one item using variables like `{ title }`, `{ slug }`, `{ date }`, `{ excerpt }`—they refer to the current entry. You can often add a **limit** (e.g. latest 5) and **sort** (e.g. by date descending). To loop over tags or a gallery, use the syntax for list/gallery fields (e.g. `{for each tag in tags}`). When there are no entries, the loop renders nothing unless you wrap it in a conditional and show an “empty” message.

## Beginner

A **loop** means “do this once for every item.” For a blog index, you want “for every blog post, show a title, excerpt, and link.” That’s exactly what a loop does.

**Listing all blog posts**

Example:

```html
<h1>Blog</h1>

{for each entry in 'blog'}
  <article>
    <h2><a href="/blog/{ slug }">{ title }</a></h2>
    <time>{ date "F j, Y" }</time>
    {if entry has excerpt}<p>{ excerpt }</p>{endif}
    <a href="/blog/{ slug }">Read more</a>
  </article>
{endfor}
```

- `'blog'` is the collection **handle** (the same one you see in the admin). Use your own, e.g. `'products'`, `'team'`, `'pages'`.
- Everything between `{for each …}` and `{endfor}` is repeated **once per entry**.
- Inside the loop, `{ title }`, `{ slug }`, `{ date }`, `{ excerpt }` are the **current** entry’s values.
- The link `href="/blog/{ slug }"` builds a URL like `/blog/my-post-slug` so each post links to its detail page.

**Listing with a limit (e.g. “latest 5”)**

Some setups let you limit how many entries and how they’re sorted. For example:

```html
{from 'blog' get entries limit=5 sort="date:desc"}
{for each entry in entries}
  <article>
    <h2><a href="/blog/{ slug }">{ title }</a></h2>
    <time>{ date "F j, Y" }</time>
  </article>
{endfor}
```

Or the loop might accept parameters directly, e.g. `{for each entry in 'blog' limit=5 sort="date:desc"}`. Check your admin Help or templating docs for the exact syntax.

**When there are no entries**

If the collection is empty, the loop block usually doesn’t run, so you see nothing. To show a friendly message:

```html
{if 'blog' has entries}
  {for each entry in 'blog'}
    …
  {endfor}
{else}
  <p>No posts yet. Check back soon!</p>
{endif}
```

See [Conditionals](conditionals.md) for more.

**Looping over tags**

If an entry has a Tags field and you want to show each tag:

```html
{for each tag in tags}
  <span class="tag">{ tag }</span>
{endfor}
```

Exact syntax may vary (e.g. `{for each tag}`). Use the same idea: loop over the list, output one element per item.

**Looping over a gallery**

For a field that holds multiple images (Gallery type):

```html
{for each image in gallery_field}
  <img src="{ image }" alt="">
{endfor}
```

Again, the exact variable names depend on your version; see [Media in templates](media-in-templates.md).

**Important**

Loops typically show only **published** entries. Drafts are usually hidden on the public site (and may appear only in preview mode if your setup supports it).

## Advanced Users

**Loop constructs**

- **Collection entries:** `{for each entry in 'handle'}` … `{endfor}`. Iterator name (`entry`) and handle (`'blog'`) are engine-defined. Alternative: fetch first with `{from 'blog' get entries}` (optionally with `limit`, `sort`, `offset`) then `{for each entry in entries}`.
- **Sort:** Common options: `sort="date:desc"`, `sort="title:asc"`. Keys usually match field keys or `created`, `updated`.
- **Limit / offset:** `limit=5`, `offset=10` for pagination or “latest N”.
- **List fields (tags, multi-select):** Loop over the field value, e.g. `{for each tag in tags}`; inside loop, `{ tag }` or equivalent.
- **Gallery / multi-item media:** Loop over the field; each item may expose `url`, `alt`, or a single value; use in `<img src="…">`.

**Single entry by slug**

To render one entry (e.g. blog post detail):

```html
{from 'blog' get entry 'my-post-slug'}
<h1>{ title }</h1>
<div>{ content }</div>
```

After `get entry 'slug'`, all variables in that scope refer to that entry. Slug can be literal or a variable (e.g. from the URL).

**Pagination**

If the API supports `page` and `per_page` (or `offset`/`limit`), you can request a page of entries and render them in a loop. “Next/Previous” links then point to the same template with different `page` (or slug range). Implementation is environment-specific (client vs server, URL scheme).

**Empty state**

Always consider wrapping list loops in a conditional so the UI can show “No items” instead of an empty block. Example: `{if 'blog' has entries} … loop … {else} … empty message … {endif}`.

**Performance**

- Client-side: one API call per collection (or per page) when using “get entries”; limit and sort reduce payload.
- Server-side: same idea; cache responses where appropriate.

**Technical note**

Only **published** entries are included in loops by default. Draft/archived visibility depends on API params and environment (e.g. preview token).

## Related

- [Templating overview](templating-overview.md)
- [Variables and output](variables-and-output.md)
- [Conditionals](conditionals.md)
- [Media in templates](media-in-templates.md)
- [Entries](../02-content/entries.md)
- [Collections](../02-content/collections.md)
