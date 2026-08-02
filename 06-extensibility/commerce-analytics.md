# Commerce analytics (Dashboard)

Revenue reporting and order export for merchants running Commerce on Birkly.

## Summary

The **Dashboard** tab (Commerce default landing) shows revenue, order count, average order value (AOV), top products, and affiliate attribution for a date range. Export paid orders to **CSV** for spreadsheets or external BI. An optional **dashboard widget** surfaces last-30-day revenue on the Birkly admin home page for selected roles.

## Beginner

**View metrics**

1. Open **Commerce → Dashboard** (opens by default when you enter Commerce).
2. Review the summary cards: order count, revenue, refunds, AOV.
3. Scroll to **Top products** and **Affiliates** tables.
4. Click **Refresh** to reload.

**Export orders**

1. On the Dashboard, click **Export Orders CSV**.
2. Your browser downloads a CSV with order id, status, date, customer email, totals, and affiliate id.
3. Open in Excel, Google Sheets, or your accounting tool.

**Admin home widget (optional)**

1. Open **Commerce → Settings**.
2. Enable **Enable dashboard widget**.
3. Select which roles see the widget (Admin, Editor, etc.).
4. Save settings.
5. The Birkly admin **Dashboard** shows a revenue summary for the recent period.

The widget is opt-in so editors without commerce permissions are not surprised by financial data.

## Advanced Users

**CommerceAnalyticsService**

Aggregates from `CommerceOrderStore` — paid, partially refunded, and refunded orders count toward revenue (net of refunds).

Summary payload:

```json
{
  "order_count": 42,
  "revenue_cents": 125000,
  "refunded_cents": 3500,
  "aov_cents": 2976,
  "top_products": [{ "key": "products:coffee-250g", "title": "...", "quantity": 10, "revenue_cents": 14990 }],
  "affiliates": [{ "affiliate_id": "partner-a", "orders": 5, "revenue_cents": 22000 }]
}
```

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
- [Commerce gift cards and quotes](commerce-gift-cards-quotes.md)
- [Dashboard](../01-admin/dashboard.md)
