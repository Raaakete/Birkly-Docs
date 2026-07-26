# Web components — templating patterns

Patterns and anti-patterns for Birkly template tags inside regions and custom elements.

## Summary

Put **template syntax in Light DOM** children of `<birkly-region>` or `[data-birkly-region]`. Use `{from … get entry …}…{endget}` and `{for each}…{endfor}`. After render, **enhance** (classes, listeners) — never wipe `innerHTML`. Closed Shadow DOM is for fetch + `Birkly.render` only, not for `{for each}` discovery.

## Beginner

### Good: template in Light DOM

```html
<birkly-region collection="blog" entry="my-post-slug">
  <h1>{title}</h1>
  <article>{'content'}</article>
</birkly-region>
```

Or explicit root with full block:

```html
<main data-birkly-region>
  {from 'blog' get entry 'my-post-slug'}
    <h1>{title}</h1>
    <article>{'content'}</article>
  {endget}
</main>
```

### Good: list children

```html
<birkly-region collection="blog" list ordered="date:desc">
  <article class="card">
    <h2>{title}</h2>
    <p>{excerpt}</p>
  </article>
</birkly-region>
```

### Bad: wipe after CMS render

```js
class MyHeader extends HTMLElement {
  connectedCallback() {
    // BAD — deletes header content Birkly just rendered
    this.innerHTML = '<header class="site-header"></header>';
  }
}
```

### Good: enhance only

```js
document.addEventListener('birkly:region-processed', (e) => {
  if (e.target.matches('birkly-region, [data-birkly-region]')) {
    BirklyComponents.setActiveNav(e.target);
  }
});
```

## Advanced Users

### Patterns

| Pattern | When | Notes |
|---------|------|-------|
| Empty `<birkly-region collection entry>` | Shared header/footer | Client injects default `{from}…{endget}` |
| Children without `{from}` / `{for}` | Custom card/layout | Client wraps with get-entry or for-loop |
| Children with full `{from}` / `{for}` | Full control | Child HTML wins as-is |
| `[data-birkly-region]` + tags | Complex layout root | Explicit outermost region |

### Anti-patterns

1. **`innerHTML = …` in `connectedCallback`** on a host that holds templates or CMS output.
2. **`{for each}` / `{from}` inside React/Vue JSX** — use the [SPA guide](../04-integration/spa-react-vue.md).
3. **Templates inside closed Shadow DOM** — `processTemplates` / discoverer won’t see them. Fetch data and call `Birkly.render(templateString, data)`, then assign into the shadow root.
4. **Phantom single-entry syntax** — `{entry 'x'.'y'}…{endentry}` is invalid; use `{from 'x' get entry 'y'}…{endget}`.

### Events for template authors

- `birkly:region-processed` — one region finished (listen on the element or bubble).
- `birkly:templates-processed` — full-document `processTemplates()` finished.

Integration API and attributes: [Web components (integration)](../04-integration/web-components.md).

## Related

- [Canonical syntax](canonical-syntax.md)
- [Web components (integration)](../04-integration/web-components.md)
- [Choose your stack](../04-integration/choose-your-stack.md)
- [Client library](../04-integration/client-library.md)
- [Loops and lists](loops-and-lists.md)
