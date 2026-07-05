# Commerce template functions

Template functions registered by the **Commerce** plugin when active. Use them in client-site HTML (kekaba, Birkly-Website, etc.) to show cart state and build checkout links.

## Summary

Commerce exposes `{commerce_cart_count}`, `{commerce_cart_url}`, `{commerce_buy_url}`, `{commerce_add_to_cart}`, and `{commerce_price_from}` for cart badges, buy buttons, and “from €X” pricing. Pass **variant sub-entry** ids for multi-SKU products. Functions register via `register_template_function()` in `plugins/commerce/plugin.php`.

## Beginner

**Cart badge in header**

```html
<a href="/cart">Cart ({commerce_cart_count})</a>
```

**Buy button on a product page**

```html
<a href="{commerce_buy_url slug my_products 1}">Buy now</a>
```

- First argument: entry **id or slug** (use variant sub-entry for options)
- Second argument: **collection slug**
- Third argument: quantity (optional, default 1)

**Show lowest price on a parent product**

When variants have different prices:

```html
<p>From {commerce_price_from slug my_products}</p>
```

**Add to cart vs buy**

`{commerce_add_to_cart …}` builds the same URL as `{commerce_buy_url …}` — use whichever label fits your UX.

## Advanced Users

| Function | Signature | Returns |
|----------|-----------|---------|
| `commerce_cart_count` | none | Item count in session cart (string) |
| `commerce_cart_url` | none | Cart API URL |
| `commerce_buy_url` | `entry_id`, `collection_slug?`, `qty?` | Checkout/add URL for sellable unit |
| `commerce_add_to_cart` | same as buy_url | Alias |
| `commerce_price_from` | `entry_id`, `collection_slug?` | Lowest `purchase_option` price for display |

**Variants:** Catalog indexes one row per sellable unit. Templates must target the **variant sub-entry** id/slug, not the parent marketing entry.

**Example — variant loop**

```html
{for each variant in sub_entries variants}
  <div>
    <h3>{variant.title}</h3>
    <a href="{commerce_buy_url variant.id products 1}">Buy</a>
  </div>
{endfor}
```

**Affiliate:** Append `?ref=partner_id` on site URLs; Commerce stores ref in session for discount rules at checkout.

**API equivalent:** `/api/index.php?route=commerce&action=checkout&entry_id=…&collection=…&purchase_option_id=…`

**Registration:** Functions are omitted when Commerce is inactive (`commerce_plugin_active()` gate in `plugin.php`).

## Related

- [Commerce plugin](../06-extensibility/plugins/commerce.md)
- [Commerce fieldtype](../06-extensibility/commerce-fieldtype.md)
- [Templating overview](templating-overview.md)
- [Loops and lists](loops-and-lists.md)
