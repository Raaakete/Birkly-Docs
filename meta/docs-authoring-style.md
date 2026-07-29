# Birkly Docs authoring style

Use this structure on every Help topic page so admin Help renders with consistent hierarchy, cross-links, and visual labels.

## Page skeleton

```markdown
# Topic title

## Summary

One short paragraph: what this page covers and when to read it.

## Beginner

Step-by-step or conceptual intro for editors and new developers.

> **Tip:** Short hints use callout syntax.

## Advanced Users

Implementation detail, JSON shapes, API notes, edge cases.

> **Note:** Important constraints.
> **Warning:** Breaking or security-sensitive behavior.
> **Example:** Concrete scenario.
> **Action:** Something the reader should do in the admin.
> **Test:** How to verify the behavior.

## Further reading

- [Related topic](other-topic-id.md)
- [Another topic](../01-admin/entry-editor.md)
```

Use `## Related` only if you prefer that heading — Help styles both **Further reading** and **Related** as the footer link block.

## Cross-links

- Prefer topic-id links: `[Collections](collections.md)` — Help resolves these to in-app navigation.
- Paths like `../01-admin/entry-editor.md` also resolve when they match a manifest topic.
- Link liberally in body copy and in **Further reading** so users can move between content model, admin, and integration topics.

## Code and tables

- Fence code with language tags: ` ```json `, ` ```html `, ` ```bash `
- Use markdown tables for field matrices and comparisons.

## Section labels

These headings receive visual labels in admin Help:

| Heading | Audience |
|---------|----------|
| Summary | Overview strip |
| Beginner | Green accent |
| Advanced Users | Purple accent |
| Further reading / Related | Footer link panel |
