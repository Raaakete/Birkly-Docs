# Conditionals

Conditionals in Birkly templates let you show or hide parts of the page based on conditions: “if this collection has entries”, “if this entry has a value in this field”, “if not …”. You use `{if}` … `{endif}` (and optionally `{else}`) to control what gets rendered.

## Summary

Use **conditionals** to show something only when a condition is true. Typical form: `{if condition}` … content … `{endif}`. Examples: `{if 'blog' has entries}` (show block only if there are blog posts), `{if entry has excerpt}` (only if the current entry has an excerpt), `{if not entry has image}` (only when there’s no image). This avoids empty or broken-looking sections (e.g. “Tags:” with no tags). Exact syntax may vary slightly; check the Help in your admin.

## Beginner

Conditionals answer “should this part of the page be shown?” You use them so you don’t show empty headings, broken images, or “Tags:” when there are no tags.

**Basic shape**

- **If something is true:** `{if condition}` … show this … `{endif}`
- **If not, show something else:** `{if condition}` … show this … `{else}` … show that … `{endif}`

**Example 1: Only show the list when there are posts**

```html
{if 'blog' has entries}
  <h2>Latest posts</h2>
  {for each entry in 'blog'}
    <article>…</article>
  {endfor}
{else}
  <p>No posts yet.</p>
{endif}
```

So: if the blog has at least one (published) entry, show the heading and the loop; otherwise show “No posts yet.”

**Example 2: Only show a section when the entry has a value**

```html
{if entry has excerpt}
  <p class="excerpt">{ excerpt }</p>
{endif}
```

If the current entry has no excerpt, the whole `<p>` block is not output. No empty “Excerpt:” line.

**Example 3: Fallback when there’s no image**

```html
{if entry has featured_image}
  <img src="{ media featured_image }" alt="{ title }">
{else}
  <img src="/images/placeholder.jpg" alt="">
{endif}
```

So: if the entry has a featured image, use it; otherwise use a placeholder so the layout doesn’t break.

**Example 4: “If not” — show only when something is missing**

```html
{if not entry has tags}
  <p>No tags for this post.</p>
{endif}
```

**Example 5: Hide “Tags:” when there are no tags**

```html
{if entry has tags}
  <p>Tags: {for each tag in tags}<span class="tag">{ tag }</span>{endfor}</p>
{endif}
```

**Combining with loops**

You can use conditionals **inside** a loop (e.g. “if this entry has an excerpt, show it”) or **around** a loop (“if the collection has entries, show the loop; else show a message”). You can also nest conditionals (one `{if}` inside another) when you need more complex rules.

**Why use them**

- Avoid empty or meaningless blocks (e.g. “Related:” with no related items).
- Avoid broken images when a Media field is empty.
- Show different content for “has value” vs “no value” (e.g. placeholder image).
- Show a friendly empty state for lists (“No posts yet”) instead of blank space.

## Advanced Users

**Condition types (typical)**

| Condition | Example | Meaning |
|-----------|---------|--------|
| Collection has entries | `{if 'blog' has entries}` | At least one published entry in that collection. |
| Entry has field | `{if entry has excerpt}` | Current entry has a non-empty value for that field. |
| Not | `{if not entry has image}` | Negation of the following condition. |
| Equals / comparison | If supported: `{if status eq 'published'}` | Value comparison; syntax is engine-dependent. |

**Scoping**

- **Inside a loop:** “entry” is the current loop entry; “entry has excerpt” checks that entry’s excerpt.
- **After single-entry load:** “entry” is the loaded entry.
- **Collection-level:** “'blog' has entries” checks the collection as a whole (no current entry).

**Nested conditionals**

```html
{if 'blog' has entries}
  {for each entry in 'blog'}
    {if entry has excerpt}
      <p>{ excerpt }</p>
    {else}
      <p>{ title }</p>
    {endif}
  {endfor}
{endif}
```

**Performance**

Conditions are evaluated at render time. “Collection has entries” may trigger a count or a fetch depending on the engine; prefer reusing the same data for the loop when possible (e.g. “get entries” once, then “if entries length > 0” and “for each entry in entries” if the engine supports it).

**Technical note**

The exact set of conditions (has entries, has field, not, eq, gt, etc.) depends on the template engine. Check the admin Help or templating reference for your Birkly version.

## Related

- [Templating overview](templating-overview.md)
- [Variables and output](variables-and-output.md)
- [Loops and lists](loops-and-lists.md)
- [Media in templates](media-in-templates.md)
