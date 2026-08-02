# Commerce analytics (Dashboard)

Revenue reporting, order export, and **ops intelligence** (cohorts, fulfillment SLA, low-stock trigger) for merchants running Commerce on Birkly.

## Summary

The **Dashboard** tab (Commerce default landing) shows revenue, order count, AOV, new vs returning customers, first-order **cohorts**, needs-shipping / **SLA breaches**, average fulfillment time, top products, and affiliate attribution. Export paid orders to **CSV**. An optional **dashboard widget** surfaces last-30-day revenue on the Birkly admin home page. Commerce **1.0.29** (P3-M4) adds the ops intelligence fields and the `commerce_low_stock` automation trigger.

## Beginner

**View metrics**

1. Open **Commerce → Dashboard** (opens by default when you enter Commerce).
2. Review summary cards: order count, revenue, refunds, AOV, **new / returning customers**, **needs shipping**, **SLA breaches**, avg fulfillment hours.
3. Scroll to **Customer cohorts**, **Top products**, and **Affiliates**.
4. Click **Refresh** to reload.

**Fulfillment SLA**

1. Open **Commerce → Settings → General**.
2. Set **Fulfillment SLA (hours)** (default **48**).
3. Paid ship orders with remaining unshipped quantity older than this count as SLA breaches on the Dashboard.

**Low stock alerts**

1. On Inventory rows, set a **low stock threshold** per SKU.
2. When available stock hits or goes below the threshold, Commerce fires `commerce_low_stock` once per SKU (debounced until stock recovers above the threshold).
3. Import the **Low stock alert** recipe under Automation → Recipe pack, or wire your own workflow on that trigger.

**Export orders**

1. On the Dashboard, click **Export Orders CSV**.
2. Your browser downloads a CSV with order id, status, date, customer email, totals, and affiliate id.

**Admin home widget (optional)**

1. Open **Commerce → Settings**.
2. Enable **Enable dashboard widget**.
3. Select which roles see the widget (Admin, Editor, etc.).
4. Save settings.

## Advanced Users

**CommerceAnalyticsService**

Aggregates from `CommerceOrderStore` — paid, partially refunded, and refunded orders count toward revenue (net of refunds).

Summary payload (P3 ops intelligence fields included):

```json
{
  "order_count": 42,
  "revenue_cents": 125000,
  "refunded_cents": 3500,
  "aov_cents": 2976,
  "new_customers": 12,
  "returning_customers": 8,
  "cohorts": [{ "period": "2026-07", "customers": 5, "orders": 7, "revenue_cents": 21000 }],
  "cohort_period": "month",
  "needs_shipping_count": 3,
  "avg_fulfillment_hours": 26.5,
  "sla_breach_count": 1,
  "fulfillment_sla_hours": 48,
  "top_products": [{ "key": "products:coffee-250g", "title": "...", "quantity": 10, "revenue_cents": 14990 }],
  "affiliates": [{ "affiliate_id": "partner-a", "orders": 5, "revenue_cents": 22000 }]
}
```

**Settings**

| Key | Default | Notes |
|-----|---------|-------|
| `commerce_fulfillment_sla_hours` | `48` | Paid ship orders with remaining qty older than this → `sla_breach_count` |

**Low-stock trigger**

| Trigger | Payload |
|---------|---------|
| `commerce_low_stock` | `{ sku, on_hand, reserved, available, threshold }` |

Implemented by `CommerceLowStockService` — fires once per SKU until available recovers above threshold.

**API**

| Action | Params | Response |
|--------|--------|----------|
| `analytics_summary` | `from`, `to` (optional ISO dates) | Summary JSON |
| `analytics_export_csv` | `from`, `to` | `text/csv` download |

Requires `view_commerce_stats` (or legacy `view_payment_stats`).

**Top products key**

`{collection_slug}:{entry_id}` from order line snapshots at checkout time.

**Out of scope (v1)**

- External BI connectors (Metabase, Looker)
- Real-time charts beyond summary tables
- Subscription MRR separate from order revenue (use Subscriptions tab + order export)

## Related

- [Commerce plugin](plugins/commerce.md)
- [Automation Commerce recipes](../05-automation/commerce-recipes.md)
- [Commerce warehouse stock](commerce-warehouse-stock.md)
- [Commerce gift cards and quotes](commerce-gift-cards-quotes.md)
- [Dashboard](../01-admin/dashboard.md)
