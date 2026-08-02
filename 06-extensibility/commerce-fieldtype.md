# Commerce fieldtype

The **Commerce** fieldtype is registered by the Commerce plugin on the fieldtype shelf. It marks how an **entry** (or variant sub-entry) is sold.

## Summary

Commerce v2 stores **fulfillment** (`ship`, `deliver`, `register`, `gift_card`, `none`), optional **`tax_class`**, and one or more **purchase_options** (one-time and/or recurring prices) on each sellable entry. Optional `quantity_available` and `sku` support capacity and fulfillment. Variants use a `variants` sub-collection with a Commerce field on each sub-entry.

## Schema (v2 stored value)

| Field | Type | Notes |
|-------|------|-------|
| `fulfillment` | enum | `ship`, `deliver`, `register`, `gift_card`, `none` |
| `tax_class` | string | `standard`, `reduced`, `zero`, or custom. Default `standard`. Rates from **Settings → Tax** |
| `purchase_options[]` | array | `id`, `label`, `billing`, `price_cents`, `currency`, `interval?` |
| `quantity_available` | int \| null | Catalog projection of Inventory Available; capacity for `register`; null = unlimited |
| `sku` | string \| null | Fulfillment/import; defaults to entry slug |

Example:

```json
{
  "fulfillment": "register",
  "tax_class": "standard",
  "purchase_options": [
    { "id": "ticket", "label": "Workshop ticket", "billing": "one_time", "price_cents": 2500, "currency": "eur" }
  ],
  "quantity_available": 20
}
```

## Fulfillment panels

| Value | Editor extras | Checkout |
|-------|---------------|----------|
| `ship` | Optional weight | Shipping address |
| `deliver` | Asset URL/file | Download token after pay |
| `register` | Uses quantity | Attendee name |
| `gift_card` | Face value = purchase option price | Email only; issues codes on pay |
| `none` | — | Purchase mappings / membership |

Collection schema may include `commerce_settings` to preset enabled fulfillments and billing intervals. Fieldtype profiles under **Commerce → Fieldtypes** can restrict enabled fulfillments (including a gift-card-only profile).

## What is NOT on the fieldtype

- Discount amounts — Commerce **Discounts** ([promotions](commerce-promotions.md))
- Affiliate codes — `?ref=` + rule engine
- Tier grants — **Settings → Mappings**
- Stock ledger rows — **Inventory** (modes: Unlimited · Simple · Locations)
- Tax rates — **Settings → Tax** (field only picks `tax_class`)

## Catalog index

One indexed row per **sellable unit** (variant sub-entry if variants exist, else parent). Cart/checkout read from `catalog_index.json`. For countable SKUs, **Inventory** is the ledger system of record; Catalog stores projected availability.

## Legacy migration

P6.4 values (`price_cents` + `billing` only) migrate to a single `purchase_option` with inferred fulfillment (default `ship`).

## Related

- [Commerce plugin](plugins/commerce.md)
- [Commerce tax](commerce-tax.md)
- [Commerce gift cards and quotes](commerce-gift-cards-quotes.md)
- [Commerce template functions](../../03-templating/commerce-functions.md)
- [Import guide](commerce-import.md)
