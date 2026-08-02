# Commerce migration wizard — Shop and Events

Move legacy **Shopping Cart** and **Events** plugin data into Commerce fieldtype entries without deleting the old plugins.

## Summary

The **Migration wizard** lives under **Commerce → Settings → Import & migrate**. It appears **only when legacy Shop (`shopping_cart`) or Events sources are detected**. When no legacy data exists, the section is hidden. The wizard previews how entries map to Commerce (`ship`, `register`, purchase options) and imports idempotently. Existing slugs are skipped on re-run. Legacy plugins remain installed — the wizard copies data only.

## Beginner

**When to use this**

- You started with the demo **Shopping Cart** or **Events** plugin and want a unified Commerce catalog.
- You need Commerce cart, subscriptions, or gift cards on products that still live in legacy collections.
- The Import & migrate UI shows a legacy migration section (otherwise this wizard is not shown).

**Before you start**

1. **Back up** `content/` and `data/`.
2. Activate **Commerce** and configure at least one payment provider (**Settings → Connections**).
3. Leave legacy plugins active until you verify the import.

**Run the wizard**

1. Open **Commerce** in the admin sidebar.
2. Open **Settings → Import & migrate**.
3. If legacy sources were detected, the wizard shows:
   - **Shopping Cart** — `shop_products` (or configured shop collection) → Commerce entries with `fulfillment: ship` and one-time purchase options.
   - **Events** — legacy event entries → Commerce entries with `fulfillment: register` and capacity from RSVP settings.
4. Click **Preview** to see how many entries will be created or updated.
5. Choose a **target collection** (existing Commerce-enabled collection or create new).
6. Click **Import**.
7. Review the result summary and open **Catalog** to confirm entries.

**After migration**

1. Update storefront templates to use Commerce buy URLs (`{commerce_buy_url}`).
2. Test checkout on a migrated product and event.
3. When satisfied, you may deactivate Shopping Cart / Events (optional).

The wizard does **not** remove legacy plugins or delete source entries.

## Advanced Users

**Detection**

- Shopping Cart: reads plugin config and `shop_products` (or equivalent) collection entries.
- Events: reads `events` collection entries and maps RSVP capacity to `quantity_available`.

**Idempotency**

Each run stores an import run id in Commerce import history. Re-import skips entries whose source slug already exists in the target collection (matched by slug or external source key).

**Mapped Commerce value (examples)**

Shop product:

```json
{
  "fulfillment": "ship",
  "purchase_options": [
    { "id": "once", "label": "Buy", "billing": "one_time", "price_cents": 1999, "currency": "eur" }
  ],
  "sku": "LEGACY-SKU-001"
}
```

Event:

```json
{
  "fulfillment": "register",
  "purchase_options": [
    { "id": "ticket", "label": "Ticket", "billing": "one_time", "price_cents": 2500, "currency": "eur" }
  ],
  "quantity_available": 20
}
```

**Rollback**

Use **Import history** to view the migration run. When the run created a new collection, **rollback** can remove imported entries and optionally delete the collection (same as CSV import rollback).

**API** (admin)

| Action | Purpose |
|--------|---------|
| `migration_detect` | List detectable legacy sources |
| `migration_preview` | Row counts and sample mapping |
| `migration_run` | Execute import |

**Out of scope**

- Automatic template rewrites on client sites
- Uninstalling legacy plugins
- Migrating order history from pre-Commerce carts

## Related

- [Coexistence with Shop and Events](commerce-coexistence.md)
- [Shopify cutover playbook](commerce-shopify-cutover.md) — external Shopify → Birkly (not this wizard)
- [Commerce import](commerce-import.md)
- [Commerce plugin](plugins/commerce.md)
