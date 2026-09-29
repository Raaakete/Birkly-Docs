# Commerce import

## Summary

Spreadsheet product rows use **CSV import** under Commerce **Settings → Import & migrate**. That path is described in **Settings reference** on the Docs tab. It is not the Shopify cutover.

## Beginner

**Example: import a product spreadsheet**

1. Enable **Commerce**.
2. Open **Commerce → Docs → Settings reference** and read **Import & migrate**.
3. In **Settings → Import & migrate**, start the product import and dry-run before you write rows. CSV import is the spreadsheet path. Shopify cutover is the one-time store move. Live store sync is the ongoing product sync.

## Advanced Users

Dry-run first. Prefer rollback over deleting mixed rows by hand. Customers and archived orders are part of Shopify cutover, not the CSV product import. Update the Commerce plugin to change this manual.

## Related

- [Plugins](plugins.md)
