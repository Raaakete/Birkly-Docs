# Storefront and events patterns

Copy-paste page patterns that combine [Commerce](commerce-functions.md) and [Events](events-functions.md) functions with core loops, detail URL context, and sub-collections.

## Summary

**In short:** A shop needs a **listing** loop, a **product detail** page (URL context + optional variant sub-collection), and a **cart** link using `{commerce_cart_count}`. Events need a **list** and a **single-event** page with `.ics` / subscribe links. Use the same canonical syntax as the rest of templating — no phantom `sub_entries` loops.

## Beginner

### Shop listing

```html
{for each entry in 'products' with status = published ordered by newest}
  <a href="product.html?collection=products&slug={slug}">
    {if entry has 'image'}
      <img src="{'image'}" alt="{title}">
    {endif}
    <h2>{title}</h2>
    <p>From {commerce_price_from slug products}</p>
  </a>
{endfor}
```

### Product detail + variants

```html
<meta name="birkly-collection" content="products">
<h1>{title}</h1>
<div>{'content'}</div>

{for each entry in 'variants' of 'products'.current ordered by order}
  <div class="variant">
    <h3>{title}</h3>
    <a class="button" href="{commerce_buy_url slug products 1}">Add to cart</a>
  </div>
{endfor}

<script src="/birkly-client.js"></script>
```

Simple products (no variants): put Commerce on the parent and link `{commerce_buy_url slug products 1}` once.

### Cart badge

```html
<a href="cart.html">Cart ({commerce_cart_count})</a>
```

### Events list + detail

```html
{for each entry in 'events' with status = published ordered by newest}
  <a href="event.html?collection=events&slug={slug}">
    <h3>{title}</h3>
  </a>
{endfor}
```

```html
<!-- event.html — no collection loop -->
<h1>{title}</h1>
<a href="{event_ics_url events id 0}">Add this date (.ics)</a>
<a href="{events_calendar_feed_url}">Subscribe (iCal)</a>
```

## Advanced Users

### For developers & AI

- Detail pages: [Detail pages & URL context](detail-pages-and-url-context.md) — never loop the whole catalog on `product.html`.  
- **Linked checkout (donations, registrants):** [Commerce linked checkout](commerce-linked-checkout.md) — `data-commerce-linked-checkout` + `begin_linked_checkout`.  
- Variants: [Sub-collections in templates](sub-collections-in-templates.md).  
- Plugin helpers: [Plugin language extensions](plugin-language-extensions.md).  
- Delivery modes: default is live client; optional bake/hydrate — [Production optimization](production-optimization.md).

**Rejected phantoms**

| Wrong | Right |
|-------|-------|
| `{for each variant in sub_entries variants}` | `{for each entry in 'variants' of 'products'.current …}` |
| `product.html?slug=` without collection when router needs it | `?collection=products&slug={slug}` |

## Related

- [Commerce linked checkout](commerce-linked-checkout.md)
- [Commerce functions](commerce-functions.md)
- [Events functions](events-functions.md)
- [Loops and lists](loops-and-lists.md)
- [Detail pages & URL context](detail-pages-and-url-context.md)
- [Reference projects](reference-projects.md)
