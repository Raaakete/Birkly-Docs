# Multi-currency

## Summary

Checkout charges the currency on the purchase option. Catalog labels can show another currency. That setting is **Settings reference** on the Commerce **Docs** tab, not the Tax topic.

## Beginner

**Example: set the charge currency**

1. Enable **Commerce** from **Plugins → Hub** or **Settings → Plugins**.
2. Open **Commerce → Docs** and select **Settings reference**.
3. Under **General**, set **Default currency** (`eur`, `usd`, …). **Display currency / FX JSON** changes catalog labels only. Checkout still charges the purchase-option currency. There is no FX conversion at pay time.

## Advanced Users

Prices for a second currency are separate purchase options, each with its own `currency`. Tax rates stay on the **Tax** topic. A publish of docs.birkly.com does not change the plugin manual. Update the Commerce plugin.

## Related

- [Plugins](plugins.md)
