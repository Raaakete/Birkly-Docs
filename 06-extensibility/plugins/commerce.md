# Commerce plugin

The **Commerce** plugin (`plugins/commerce/`) is Birkly’s content-first commerce platform for P6.5 v2: payment providers, the **Commerce fieldtype**, catalog index, cart, checkout, orders, and **PostPurchaseRouter** fulfillment.

## Summary

Activate **Commerce** under Settings → Plugins, configure a payment provider, add the Commerce fieldtype to collections, and model products with **fulfillment** (ship, deliver, register, none) plus one or more **purchase_options** (one-time and/or recurring on the same entry). Use variant **sub-entries** for SKUs. Template functions expose cart count and buy URLs on client sites. Plugin docs register via `register_plugin_docs()` and appear under Help → Plugin extensions when active.

## Beginner

**What Commerce does**

Commerce turns Birkly entries into things you can sell: physical products, digital downloads, class tickets, and memberships — without a separate e-commerce database.

**Two settings on each sellable item**

| Setting | Plain language |
|---------|----------------|
| **Fulfillment** | What happens after someone pays (ship a box, send a download, register for a class, or grant access) |
| **Purchase options** | How they pay — e.g. €25 once **or** €19/month on the **same** product |

**Quick setup**

1. **Settings → Plugins** → enable **Commerce**.
2. Open **Commerce** in the sidebar → **Connections** → add Stripe, Mollie, or another provider.
3. Edit a collection schema → add field type **Commerce**.
4. Create an entry with price, fulfillment, and purchase options.
5. On your website, add a buy button using `{commerce_buy_url entry_id collection}`.

**Variants (sizes, options)**

For products with multiple SKUs (size, grind, color):

1. Create a **parent** product entry with photos and description.
2. Add a **variants** sub-collection.
3. Each **variant sub-entry** gets its own Commerce field (price, SKU, stock).

**After payment**

Commerce routes each order line by fulfillment:

- **Ship** — order exported for packing/shipping
- **Deliver** — secure download link emailed
- **Register** — attendee recorded, capacity reduced
- **None** — tier grant or automation (memberships)

## Advanced Users

**Content model (v2)**

```json
{
  "fulfillment": "ship",
  "purchase_options": [
    { "id": "once", "label": "Buy once", "billing": "one_time", "price_cents": 1499, "currency": "eur" },
    { "id": "sub", "label": "Subscribe", "billing": "recurring", "interval": "month", "price_cents": 1299, "currency": "eur" }
  ],
  "quantity_available": null,
  "sku": "SKU-250G"
}
```

**PostPurchaseRouter** — idempotent handler keyed on `order_id` + line; fires typed automation triggers: `commerce_physical_fulfilled`, `commerce_digital_delivered`, `commerce_event_registered`, `commerce_membership_started`.

**Admin tabs:** Connections, Catalog, Orders, Discounts, Import, Mappings, Fulfillment, Activity, Settings (shipping zones v1).

**Shelf services:** `commerce_shelf` (primary), `payment_shelf` (legacy alias).

**Plugin docs shelf:** `register_plugin_docs('commerce', …)` ships `plugins/commerce/docs/` for AI, Admin Help, and MCP (`birkly://docs/plugin/commerce`).

**Public API:** `/api/index.php?route=commerce` — cart get/add/update/remove/checkout; checkout selects `purchase_option_id` and collects shipping/attendee per fulfillment.

**Legacy:** P6.4 flat schema (`price_cents` + `billing`) migrates to single purchase_option + inferred fulfillment.

## Related

- [Commerce fieldtype](../commerce-fieldtype.md)
- [Commerce template functions](../../03-templating/commerce-functions.md)
- [Commerce import](../commerce-import.md)
- [Coexistence with Shop & Events](../commerce-coexistence.md)
