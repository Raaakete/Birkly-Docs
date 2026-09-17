# Commerce template functions

Template functions registered by the **Commerce** plugin when active. Use them in client-site HTML for cart badges, buy links, and “from €X” pricing.

## Summary

**In short:** With Commerce active you can use `{commerce_cart_count}`, `{commerce_cart_url}`, `{commerce_buy_url}`, `{commerce_add_to_cart}`, and `{commerce_price_from}`. For multi-SKU products, pass the **variant sub-entry** id/slug. Combine with normal loops and [sub-collection](sub-collections-in-templates.md) syntax (`of 'products'.current`).

> **Video (follow-along):** optional (P3) — add-to-cart flow

## Beginner

### Cart badge

```html
<a href="/cart.html">Cart ({commerce_cart_count})</a>
```

### Buy button on a product detail page

```html
<a href="{commerce_buy_url slug my_products 1}">Buy now</a>
```

- First argument: entry **id or slug** (variant sub-entry for options)  
- Second: **collection slug**  
- Third: quantity (optional, default 1)

### Lowest price on a product detail page

On a detail URL (`?collection=products&slug=…`), `slug` resolves to the current entry:

```html
<p>€{commerce_price_from slug products}</p>
```

Or pass the commerce field directly (variants, custom field slugs):

```html
<p>€{commerce_price_from {'commerce'}}</p>
<p>€{commerce_price_from variant.commerce}</p>
```

The tag returns a **number** with a dot decimal (for example `6.50`). Add your currency symbol and locale formatting in HTML/CSS.

### Variants (sub-collection)

On a product detail page (URL has `?collection=products&slug=…`):

```html
{for each entry in 'variants' of 'products'.current ordered by order}
  <div>
    <h3>{title}</h3>
    <a href="{commerce_buy_url slug products 1}">Buy</a>
  </div>
{endfor}
```

Use the variant’s own slug/id in `commerce_buy_url` when that row is the sellable unit.

## Advanced Users

### For developers & AI

| Function | Signature | Returns |
|----------|-----------|---------|
| `commerce_cart_count` | none | Session cart item count |
| `commerce_cart_url` | none | Cart URL |
| `commerce_buy_url` | `entry_id`, `collection_slug?`, `qty?` | Checkout / add URL |
| `commerce_add_to_cart` | same as buy_url | Alias |
| `commerce_price_from` | `entry_id`, `collection_slug` **or** commerce field value | Lowest purchase-option price (catalog lookup or field array). Empty when unknown. |

**Registration:** `register_template_function()` in Commerce `plugin.php`; omitted when inactive. See [Plugin language extensions](plugin-language-extensions.md).

**Do not** invent `{for each variant in sub_entries variants}` — use `of 'collection'.current` / explicit slug.

**Affiliate:** Append `?ref=partner_id` on site URLs when using affiliate rules.

Full page recipes: [Storefront patterns](storefront-patterns.md).

## Related

- [Storefront and events patterns](storefront-patterns.md)
- [Sub-collections in templates](sub-collections-in-templates.md)
- [Commerce plugin](../06-extensibility/plugins/commerce.md)
- [Loops and lists](loops-and-lists.md)
- [Plugin language extensions](plugin-language-extensions.md)
