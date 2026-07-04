# Commerce CSV import

Import purchasable entries from CSV via **Commerce → Import** in admin.

## Supported sources (v1)

| Preset | Description |
|--------|-------------|
| **Generic CSV** | Column mapping wizard |
| **WooCommerce export** | Preset column mapping |
| **Shopify export** | Preset column mapping |

## Mapping targets

| Column | Maps to |
|--------|---------|
| Title | Entry title |
| Body / Description | Entry body field |
| Price | Commerce `price_cents` (converted from decimal) |
| Currency | Commerce `currency` |
| SKU | Commerce `sku` |
| Quantity | Commerce `quantity_available` |
| Slug | Entry slug |
| Image URL | Media field (when mapped) |

## Idempotency

Match existing entries by **SKU** or **external_id** column — update vs create.

## Dry-run

Use dry-run mode to preview rows before writing entries.

## Out of scope (v1)

- Live WooCommerce / Shopify API sync
- Automatic collection creation from API (select or create collection in UI)

## Related

- [Commerce plugin](commerce-plugin.md)
- [Commerce fieldtype](commerce-fieldtype.md)
