# Commerce plugin

The **Commerce** plugin (`plugins/commerce/`) is Birkly’s content-first commerce platform: payment providers, the **Commerce fieldtype**, catalog index, inventory ledger, cart, checkout, orders, customers, discounts, gift cards, tax, import, and fulfillment.

It replaces the legacy **Payments** plugin (`plugins/payments/` is now a compatibility shim).

Current documented build: Commerce **1.0.22**. For a beginner walkthrough, see [Commerce plugin overview](plugins/commerce.md) and the in-admin help shelf when Commerce is active.

## Prerequisites

1. Activate **Commerce** under Settings → Plugins.
2. Configure at least one **provider connection** (**Settings → Connections**).
3. Add the **Commerce** fieldtype to collection schemas for purchasable entries.

## Admin areas

| Tab | Purpose |
|-----|---------|
| **Dashboard** | Revenue, order, product, and affiliate summary (default landing) |
| **Orders** | Commercial history with frozen money/tax snapshots; **Draft orders / Quotes** live inside Orders |
| **Customers** | Email-keyed profiles, CSV import, timeline; optional User Management link; no passwords |
| **Catalog** | Indexed read model of sellable CMS entries |
| **Inventory** | Ledger SoR for countable stock (Unlimited · Simple · Locations) |
| **Subscriptions** | Recurring purchases and lifecycle |
| **Discounts** | Promotions v2: usage limits, min purchase, dates, free shipping, stacking |
| **Gift Cards** | Admin-issued store credit (sellable cards use field fulfillment `gift_card`) |
| **Settings** | Connections, General, Fieldtypes, Mappings, Import & migrate, Shipping, Tax, Fulfillment, Activity, Documentation |

Inside **Settings → Import & migrate**: **Shopify cutover** (one-time products, customers, archived orders), CSV imports, and Beta live product import adapters. Legacy Shop / Events migration appears only when legacy sources are detected. See [Shopify cutover playbook](commerce-shopify-cutover.md).

Inside **Settings → Tax**: manual default/country rates, tax classes, and class×country overrides. See [Commerce tax](commerce-tax.md).

Inside **Settings → Fulfillment**: Manual / Export is the only merchant-selectable adapter. ShipStation is an internal stub and is not merchant-selectable. See [Commerce manual fulfillment](commerce-fulfillment.md).

## Mental model

| Area | Role |
|------|------|
| **Catalog** | Checkout read model from CMS entries with Commerce fields |
| **Inventory** | Stock ledger (on hand, reserved, available, low threshold) |
| **Orders** | History — totals and tax lines are frozen at payment, not recalculated from current catalog |
| **Customers** | Commercial profiles keyed by email (not login credentials) |

## Commerce fieldtype

Add to any collection schema:

```json
{ "name": "commerce", "type": "commerce", "label": "Pricing" }
```

**Stored value (v2):**

| Field | Notes |
|-------|-------|
| `fulfillment` | `ship`, `deliver`, `register`, `gift_card`, or `none` |
| `tax_class` | Product tax class (`standard`, `reduced`, `zero`, or custom). Default `standard` |
| `purchase_options[]` | id, label, billing, pricing_mode, price_cents, currency, interval? |
| `quantity_available` | Catalog projection of Inventory Available, or null for unlimited; capacity for `register` |
| `sku` | Optional; defaults to entry slug |

Tier grants are **not** on the fieldtype — configure **Purchase mappings** under Commerce → Settings → Mappings.

See [Commerce fieldtype](commerce-fieldtype.md) for panels and variants.

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

**New sites:** use Commerce fieldtype on any collection. Legacy plugins are not removed. Migration wizard under **Settings → Import & migrate** appears only when legacy sources are detected.

## Related

- [Commerce plugin overview](plugins/commerce.md)
- [Commerce customers](commerce-customers.md)
- [Commerce promotions](commerce-promotions.md)
- [Commerce gift cards and quotes](commerce-gift-cards-quotes.md)
- [Commerce tax](commerce-tax.md)
- [Commerce manual fulfillment](commerce-fulfillment.md)
- [Shopify cutover playbook](commerce-shopify-cutover.md)
- [Commerce fieldtype](commerce-fieldtype.md)
- [Payment shelf API](payment-shelf-api.md) (legacy naming; use `commerce_shelf`)
- [Shopping Cart plugin](shopping-cart-plugin.md) (legacy)
- [Events plugin](events-plugin.md) (legacy)
