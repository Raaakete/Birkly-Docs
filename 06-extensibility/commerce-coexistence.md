# Shop, Events, and Commerce coexistence

After P6.4, three commerce-related plugins may be active on the same site:

| Plugin | Model | When to use |
|--------|-------|-------------|
| **Commerce** | Commerce fieldtype on any collection | **New sites** — content-first products, tickets, memberships |
| **Shopping Cart** | `shop_products` collection | Legacy demo / existing Shop installs |
| **Events** | `events` collection + RSVP API | Legacy events / free RSVP without Commerce field |

## Shelf compatibility

All three can coexist because Commerce registers **`payment_shelf`** as an alias of **`commerce_shelf`**. Shopping Cart and Events continue to call `get_plugin_service('payment_shelf')` unchanged.

## Migration path (recommended)

1. Activate **Commerce**; configure providers (migrates from Payments settings).
2. Add Commerce fieldtype to your product/event collections.
3. Re-create or import entries with Commerce field values.
4. Use Commerce cart/checkout template functions for new storefront pages.
5. Deactivate **Shopping Cart** / **Events** when no longer needed (optional — not required in P6.4).

## What not to do

- Do not run two parallel carts on the same storefront (Commerce cart vs Shop cart).
- Do not delete Shop/Events plugins in P6.4 — they remain supported.

## Related

- [Commerce plugin](commerce-plugin.md)
- [Shopping Cart plugin](shopping-cart-plugin.md)
- [Events plugin](events-plugin.md)
