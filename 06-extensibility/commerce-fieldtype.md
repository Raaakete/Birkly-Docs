# Commerce fieldtype

The **Commerce** fieldtype is registered by the Commerce plugin on the fieldtype shelf. It marks how an **entry** is sold — products, event tickets, and memberships all use the same schema.

## Schema fields (stored on entry)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `price_cents` | int | Yes | Minor units; `0` = free (RSVP, free download) |
| `currency` | string | Yes | ISO 4217 lowercase, e.g. `eur` |
| `billing` | enum | Yes | `one_time` or `recurring` only |
| `interval` | string | If recurring | `month` or `year` |
| `quantity_available` | int \| null | No | `null` = unlimited (replaces separate stock/capacity) |
| `sku` | string \| null | No | Import/fulfillment; falls back to entry slug |

## What is NOT on the fieldtype

- Discount amounts — use Commerce **Discount rules**
- Affiliate codes — use `?ref=` + rule engine
- Tier / membership ID — use **Purchase mappings** in Commerce admin

## Billing modes

| Use case | `billing` | `interval` |
|----------|-----------|------------|
| Product, event ticket | `one_time` | — |
| Membership subscription | `recurring` | `month` or `year` |

## Catalog index

When an entry with a Commerce field is saved, Commerce updates `catalog_index.json`:

- Entry appears in admin **Catalog**
- Cart/checkout reads from the index (not raw collection files)

## Collection setup

1. Edit collection schema → add field `type: commerce`
2. Create entries with price, billing, quantity
3. Verify entry appears in Commerce → Catalog

## Related

- [Commerce plugin](commerce-plugin.md)
- [Import guide](commerce-import.md)
