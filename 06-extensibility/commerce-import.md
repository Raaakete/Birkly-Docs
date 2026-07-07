# Commerce CSV import

Import purchasable entries from CSV via **Commerce → Import** in admin. For **live Shopify/WooCommerce API sync**, see [Commerce live import](commerce-live-import.md).

## Summary

The import wizard supports **CSV upload** from many platforms (WooCommerce, Shopify, Magento, and more) with preset column mapping. Choose a target collection, preview rows, and import with idempotent SKU matching. Import history supports rollback. Live REST API import is available for Shopify and WooCommerce (Phase 12).

## Beginner

**Start an import**

1. Open **Commerce → Import**.
2. Click **Import products**.
3. **Step 1 — Platform:** Search or filter (Stores / Inventory) and pick your source (for example WooCommerce or Shopify CSV).
4. **Step 2 — Upload:** Select target collection (existing or create new), default currency, and upload the CSV (or paste CSV text).
5. **Step 3 — Review:** Check the preview table and row counts.
6. **Step 4 — Done:** Confirm created/updated counts.

**Export from your old store**

Each platform card shows export steps. Typical paths:

- **WooCommerce:** Products → Export → CSV (Name, SKU, Regular price, Stock).
- **Shopify:** Products → Export → CSV (Variant SKU, Variant price, inventory qty).

**Import history**

The Import tab lists past runs with status, counts, and actions:

- **Details** — view created/updated breakdown.
- **Remove** — rollback imported entries (optionally delete collection if the import created it).

## Supported sources (CSV v1)

| Preset | Description |
|--------|-------------|
| **Generic CSV** | Column mapping wizard |
| **WooCommerce export** | Preset column mapping |
| **Shopify export** | Preset column mapping |
| **Magento, BigCommerce, PrestaShop, …** | Preset mappings in import wizard |

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

Use dry-run mode (preview step) to validate rows before writing entries.

## Live API import (Phase 12)

For ongoing sync without manual CSV export:

- [Commerce live import](commerce-live-import.md) — Shopify custom app + WooCommerce REST keys, preview, scheduled cron sync.

## Out of scope (v1)

- Order or customer import
- Webhook-driven real-time sync (deferred)
- Automatic collection creation without Commerce fieldtype (wizard can create Commerce-enabled collection)

## Related

- [Commerce plugin](commerce-plugin.md)
- [Commerce live import](commerce-live-import.md)
- [Commerce migration wizard](commerce-migration-wizard.md)
- [Commerce fieldtype](commerce-fieldtype.md)
