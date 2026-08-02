# Commerce plugin

The **Commerce** plugin (`plugins/commerce/`) is Birkly’s content-first commerce platform: payment providers, the **Commerce fieldtype**, catalog index, inventory ledger, cart, checkout, orders, customers, discounts, gift cards, tax providers, shipping rate providers, import, and fulfillment.

It replaces the legacy **Payments** plugin (`plugins/payments/` is now a compatibility shim).

Current documented build: Commerce **1.0.29** (P54 P3 — Commerce 0→1 foundation complete). For a beginner walkthrough, see [Commerce plugin overview](plugins/commerce.md) and the in-admin help shelf when Commerce is active.

## Prerequisites

1. Activate **Commerce** under Settings → Plugins.
2. Configure at least one **provider connection** (**Settings → Connections**).
3. Add the **Commerce** fieldtype to collection schemas for purchasable entries.

## Admin areas

| Tab | Purpose |
|-----|---------|
| **Dashboard** | Revenue, cohorts, needs-shipping / SLA breaches, avg fulfillment time, top products, affiliates (default landing) |
| **Orders** | Commercial history with frozen money/tax snapshots; **Draft orders / Quotes** (cart-free editor) live inside Orders |
| **Customers** | Email-keyed profiles, CSV import, timeline; optional User Management link; no passwords |
| **Catalog** | Indexed read model of sellable CMS entries |
| **Inventory** | Ledger SoR for countable stock (Unlimited · Simple · Locations); low-stock threshold → `commerce_low_stock` |
| **Subscriptions** | Recurring purchases and lifecycle |
| **Discounts** | Promotions v2: usage limits, min purchase, dates, free shipping, stacking |
| **Gift Cards** | Admin-issued store credit (sellable cards use field fulfillment `gift_card`) |
| **Settings** | Connections, General (fulfillment SLA hours), Fieldtypes, Mappings, Import & migrate, Shipping, Tax, Fulfillment, Activity, Documentation |

Inside **Settings → Import & migrate**: **Shopify cutover** (one-time products, customers, archived orders), CSV imports, and Beta live product import adapters. Legacy Shop / Events migration appears only when legacy sources are detected. See [Shopify cutover playbook](commerce-shopify-cutover.md).

Inside **Settings → Tax**: provider **Manual** or **Stripe Tax** (orthogonal to charge PSP), classes, class×country rates, optional **B2B reverse charge**. See [Commerce tax](commerce-tax.md).

Inside **Settings → Shipping**: rate provider **Manual** zones or **EasyPost** live quotes (weight required; fallback to zones). See [Commerce shipping rates](commerce-shipping.md).

Inside **Settings → Fulfillment**: **Manual / Export** (default) or **EasyPost** (push + tracking webhook). ShipStation is an internal stub and is not merchant-selectable. See [Commerce fulfillment](commerce-fulfillment.md).

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
| `weight_grams` | Required on `ship` when EasyPost live rates are on; optional dims `length_mm` / `width_mm` / `height_mm` |
| `purchase_options[]` | id, label, billing, pricing_mode, price_cents, currency, interval? |
| `quantity_available` | Catalog projection of Inventory Available, or null for unlimited; capacity for `register` |
| `sku` | Optional; defaults to entry slug |

Tier grants are **not** on the fieldtype — configure **Purchase mappings** under Commerce → Settings → Mappings.

See [Commerce fieldtype](commerce-fieldtype.md) for panels and variants.

## Public API

Base: `/api/index.php?route=commerce`

Cart actions: `get`, `add`, `update`, `remove`, `checkout` (entry-based lines from catalog index). Hybrid carts may return `split_required` / `groups[]`; pass `group_key` + `checkout_session_id` for split checkout. See [Hybrid cart](commerce-hybrid-cart.md).

Affiliate: pass `?ref=partner_id` — stored in session for checkout discount rules.

Draft-order admin actions: `draft_order_create`, `draft_order_update`, `draft_order_preview`, `draft_order_get`, `draft_order_search_catalog`, `draft_order_checkout`.

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
- [Commerce hybrid cart](commerce-hybrid-cart.md)
- [Commerce store kit](commerce-store-kit.md)
- [Automation Commerce recipes](../05-automation/commerce-recipes.md)
- [Commerce analytics](commerce-analytics.md)
- [Commerce customers](commerce-customers.md)
- [Commerce promotions](commerce-promotions.md)
- [Commerce gift cards and draft orders](commerce-gift-cards-quotes.md)
- [Commerce tax](commerce-tax.md)
- [Commerce shipping rates](commerce-shipping.md)
- [Commerce fulfillment](commerce-fulfillment.md)
- [Shopify cutover playbook](commerce-shopify-cutover.md)
- [Commerce fieldtype](commerce-fieldtype.md)
- [Payment shelf API](payment-shelf-api.md) (legacy naming; use `commerce_shelf`)
- [Shopping Cart plugin](shopping-cart-plugin.md) (legacy)
- [Events plugin](events-plugin.md) (legacy)
