# Commerce manual fulfillment

Manual / Export fulfillment for physical (`ship`) lines — Commerce **1.0.22**. Supports **partial ship**, **multi-package** shipments, **packing slips**, and Automation notify via `commerce_shipment_created` / `commerce_order_shipped`.

## Summary

**Settings → Fulfillment** offers only **Manual / Export** as a merchant-selectable adapter (ShipStation remains an internal stub). From an order detail, create one or more shipments against remaining shippable quantity, optionally notify the customer, and print packing slips.

## Beginner

### Adapter setting

1. Open **Commerce → Settings → Fulfillment**.
2. Leave **Active adapter** on **Manual / Export**.
3. Save. Do not expect live carrier rate shopping or ShipStation as a production option in this release.

### Create a shipment

1. Open **Commerce → Orders** → order detail.
2. For `ship` lines with remaining quantity, create a shipment:
   - Select line(s) and quantities (partial OK), or ship all remaining.
   - Optional tracking number, carrier, **package count** (≥ 1).
   - Optional **notify customer**.
3. Repeat for additional packages / remaining lines (multi-package).

Fulfillment status per line moves from unfulfilled → partial → shipped as quantities complete.

### Packing slips

From the order detail (or bulk actions where available), generate packing slips for a shipment or for remaining unshipped items. Print/PDF opens in a new window — allow pop-ups if blocked.

### Automation notify

When **notify customer** is set on a shipment:

| Trigger | When |
|---------|------|
| `commerce_shipment_created` | Each new shipment record |
| `commerce_order_shipped` | Customer-facing shipped notify (when notify is enabled) |

Wire email/SMS workflows in Automation against these triggers. See [Triggers](../05-automation/triggers.md).

## Advanced Users

**Admin API:**

| Action | Purpose |
|--------|---------|
| `create_shipment` | Partial/full ship; body: `items[]` (`line_id`, `quantity`), `tracking_number`, `carrier`, `package_count`, `notify_customer`, `shipped_at` |
| `packing_slips` | HTML packing slip for order ids / shipment |
| `update_order_shipment` / `bulk_mark_shipped` | Legacy/simple ship helpers still available |

**Order shape:** `shipments[]` with `id`, `items`, `package_count`, tracking/carrier, `notify_customer`. Lines track `quantity_shipped` and `fulfillment_status`.

Only lines with `fulfillment: ship` are shippable. Digital, register, gift_card, and none lines use PostPurchaseRouter instead.

> **Note:** Live fulfillment providers and carrier APIs are **not** claimed here (P2).

## Related

- [Commerce plugin overview](plugins/commerce.md)
- [Automation triggers](../05-automation/triggers.md)
- [Commerce warehouse stock](commerce-warehouse-stock.md)
