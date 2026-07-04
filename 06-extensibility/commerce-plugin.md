# Commerce plugin

The **Commerce** plugin (`plugins/commerce/`) is Birkly’s content-first commerce platform: payment providers, the **Commerce fieldtype**, catalog index, cart, checkout, orders, discounts, CSV import, and fulfillment.

It replaces the legacy **Payments** plugin (`plugins/payments/` is now a compatibility shim).

## Prerequisites

1. Activate **Commerce** under Settings → Plugins.
2. Configure at least one **provider connection** (Connections tab).
3. Add the **Commerce** fieldtype to collection schemas for purchasable entries.

## Admin areas

| Tab | Purpose |
|-----|---------|
| **Connections** | 8 payment providers (Stripe, Mollie, PayPal, …) |
| **Catalog** | Purchasable entries indexed from Commerce fields |
| **Orders** | Order list and status |
| **Discounts** | Rules, coupons, affiliate programs |
| **Import** | CSV upload (generic, WooCommerce, Shopify presets) |
| **Mappings** | Entry/collection → grant user tier on paid order |
| **Fulfillment** | Export adapters (manual, ShipStation stub) |
| **Activity** | Payment activity log |
| **Settings** | Provider selection mode, dashboard widget |

## Commerce fieldtype

Add to any collection schema:

```json
{ "name": "commerce", "type": "commerce", "label": "Pricing" }
```

**Stored value:**

| Field | Notes |
|-------|-------|
| `price_cents` | Integer; `0` = free |
| `currency` | ISO code, e.g. `eur` |
| `billing` | `one_time` or `recurring` |
| `interval` | `month` or `year` (required if recurring) |
| `quantity_available` | Integer or null (unlimited) |
| `sku` | Optional; defaults to entry slug for fulfillment |

Tier grants are **not** on the fieldtype — configure **Purchase mappings** in Commerce admin.

## Public API

Base: `/api/index.php?route=commerce`

Cart actions: `get`, `add`, `update`, `remove`, `checkout` (entry-based lines from catalog index).

Affiliate: pass `?ref=partner_id` — stored in session for checkout discount rules.

## Template functions

| Function | Purpose |
|----------|---------|
| `{commerce_cart_count}` | Items in session cart |
| `{commerce_cart_url}` | Cart API URL |
| `{commerce_buy_url entry_id}` | Quick checkout for one entry |
| `{commerce_add_to_cart entry_id qty}` | Add-to-cart URL |

## Shelf services

| Service ID | Notes |
|------------|-------|
| `commerce_shelf` | Primary API |
| `payment_shelf` | Legacy alias — same instance |

Consumer plugins (Shopping Cart, Events) continue to use `payment_shelf` during transition.

## Coexistence with Shop & Events

| Plugin | Status |
|--------|--------|
| `shopping_cart` | Legacy — uses `shop_products` collection |
| `events` | Legacy — uses `events` collection + RSVP |

**New sites:** use Commerce fieldtype on any collection. Legacy plugins are not removed in P6.4.

## Related

- [Commerce fieldtype](commerce-fieldtype.md)
- [Payment shelf API](payment-shelf-api.md) (legacy naming; use `commerce_shelf`)
- [Shopping Cart plugin](shopping-cart-plugin.md) (legacy)
- [Events plugin](events-plugin.md) (legacy)
