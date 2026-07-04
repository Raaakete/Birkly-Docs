# Shopping Cart plugin

The **Shopping Cart** plugin (`plugins/shopping_cart/`) is a `payment_shelf` consumer: products live in the `shop_products` collection, checkout creates orders and charges via Payments, and order status updates when payment webhooks fire.

## Prerequisites

1. **Payments** plugin active with at least one provider connection.
2. **Shopping Cart** plugin activated (seeds `shop_products` collection on first activation).
3. Cart plugin granted **`access_payment_shelf`** (auto-granted on activation).

## Admin

Open **Shop** in the admin sidebar.

| Tab | Purpose |
|-----|---------|
| **Orders** | List orders, status, payment IDs, cancel pending orders |
| **Settings** | Checkout success/cancel paths |

Use **Manage Products** to edit the `shop_products` collection (title, price, currency, SKU, stock).

## Checkout flow

1. Visitor adds items via API (`action=add`) or template URLs.
2. **Checkout** creates a pending order and calls `payment_shelf->createPayment()` with `source_plugin=shopping_cart` and `source_ref=order_id`.
3. Provider webhook → Payments broadcasts `payment_succeeded` → Cart marks order **paid** and clears the session cart.

## Public API

Base: `/api/index.php?route=shopping_cart`

| Action | Auth | Description |
|--------|------|-------------|
| `get` | Public | Cart contents and total |
| `add` | Public | Add product (`product_id`, `quantity`) |
| `update` | Public | Set quantity |
| `remove` | Public | Remove line |
| `checkout` | Public | Start payment (`customer_email`, optional return URLs) |
| `list_orders` | Admin | All orders |
| `get_order` | Admin | Single order |
| `cancel_order` | Admin | Cancel pending order (CSRF) |

## Template functions

| Function | Returns |
|----------|---------|
| `{cart_count}` | Item count in session |
| `{cart_checkout_url}` | Checkout API URL |
| `{cart_add_url product_id}` | Add-to-cart URL |

## Automation triggers

- `order_created` — pending order created from cart
- `order_paid` — order marked paid after webhook
- `order_cancelled` — admin cancelled order

## Related

- [Payment shelf API](payment-shelf-api.md)
- [Payments plugin](payments-plugin.md)
