# Commerce tax (manual classes)

Manual tax for Commerce **1.0.21+** / current **1.0.22**: product **tax classes**, class×country rates, and frozen **`tax_lines`** on each paid order. No Stripe Tax / automated provider in this release.

## Summary

Configure rates under **Commerce → Settings → Tax**. Assign a `tax_class` on each sellable Commerce field (default `standard`). At checkout, each line resolves a rate and the order stores matching `tax_lines` (not recalculated later from catalog).

## Beginner

### Enable and set rates

1. Open **Commerce → Settings → Tax**.
2. Check **Enable tax at checkout**.
3. Set a **default rate** (%) and optional **country overrides**.
4. Under **Tax classes**, add classes (built-ins: `standard`, `reduced`, `zero`, plus custom codes). Leave a class default blank to inherit country/default; use `0` for explicit zero-rated.
5. Under **Class × country rates**, add overrides (e.g. reduced × DE = 7%).
6. **Save Tax Rules**.

### Assign class on products

In the entry editor Commerce field, set **Tax class** (`standard`, `reduced`, `zero`, or a custom code). Rates always come from Settings → Tax — the field only picks the class.

### Resolution order (per line)

1. **Class × country** rate  
2. Else **class default** rate  
3. Else **country** override  
4. Else site **default** rate  

Tax applies to the goods subtotal (after line discounts). Shipping tax policy follows the current checkout builder (goods-focused manual tax).

## Advanced Users

**Field:** `tax_class` on the Commerce fieldtype value (string; default `standard`).

**Order snapshot:** Paid orders freeze `tax_cents` and `tax_lines[]` with `tax_class`, title, rate, and `tax_cents`. Mixed carts emit **one tax line per class**.

**Catalog helper:** `resolveTaxRateForClass($class, $country, $taxSettings)`.

> **Warning:** Do not claim Stripe Tax, OSS/IOSS automation, or B2B VAT ID validation — those are later (P2+) milestones.

## Related

- [Commerce fieldtype](commerce-fieldtype.md)
- [Commerce plugin overview](plugins/commerce.md)
- [Commerce plugin reference](commerce-plugin.md)
