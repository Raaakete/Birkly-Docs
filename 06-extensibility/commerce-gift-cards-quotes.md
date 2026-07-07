# Commerce gift cards and B2B quotes

Phase 11 adds **gift cards** (store credit at checkout) and **B2B quotes** (negotiated prices with a customer accept link).

## Summary

**Gift cards** are codes with a balance in cents. Issue them in **Commerce → Gift Cards**; customers apply a code at checkout. Balances support **partial redemption** — unused balance remains on the card. **B2B quotes** snapshot cart lines at custom prices; the admin sends an accept URL; the customer accepts and pays through normal checkout.

## Beginner

### Gift cards

**Issue a gift card**

1. Open **Commerce → Gift Cards**.
2. Click **Issue Gift Card**.
3. Enter balance (for example `50` for €50.00) and optionally a custom code (leave blank to auto-generate).
4. The card appears in the list with status **active**.

**Customer checkout**

Customers enter a gift card code during checkout (or your template calls the cart API with `set_gift_card`). The discount applies after coupons. If the order total is less than the card balance, the remainder stays on the card for a future purchase.

**Void a card**

Click **Void** on an active card to disable it. Voided and expired cards are rejected at checkout.

**Rules (v1)**

- One gift card per checkout.
- Currency must match the order.
- Expired cards (when `expires_at` is set) cannot be redeemed.

### B2B quotes

**Create a quote**

1. Build a cart in the storefront (or admin test cart) with the intended lines.
2. Open **Commerce → Quotes**.
3. Click **Create Quote from Cart**.
4. Enter the customer email when prompted.
5. Copy the **accept URL** from the quotes list and send it to the customer.

**Customer flow**

1. Customer opens the accept URL (tokenized link).
2. Reviews line items and total.
3. Accepts the quote → status moves to **pending payment**.
4. Completes checkout via the normal Commerce payment flow.

**Cancel a quote**

Click **Cancel** on an open quote to invalidate the token.

**Quote states**

| Status | Meaning |
|--------|---------|
| `quote` | Created, awaiting customer accept |
| `pending_payment` | Accepted, checkout in progress |
| `paid` | Order completed |
| `expired` / `canceled` | No longer valid |

Default expiry is 30 days from creation.

## Advanced Users

**Gift card storage**

`GiftCardStore` — flat files under `data/plugins/commerce/gift_cards/`. Fields: `code`, `balance_cents`, `initial_balance_cents`, `currency`, `status`, `expires_at`, `redemptions[]`.

**Checkout integration**

`DiscountEngine::applyGiftCardTender()` validates and applies balance. Cart API:

- `set_gift_card` — `{ code }` stores code in session.
- Checkout deducts `applied_cents` from total; persists redemption on the order.

Admin API:

- `issue_gift_card` — `{ balance_cents, code?, currency?, expires_at? }`
- `void_gift_card` — `{ code }`
- `list_gift_cards`

**Quote storage**

`CommerceQuoteStore` — `data/plugins/commerce/quotes/`. Tokenized accept URLs:

```
/api/index.php?route=commerce&action=get_quote&token={token}
```

Public/customer actions:

| Action | Purpose |
|--------|---------|
| `get_quote` | Read quote by token |
| `accept_quote` | Accept → `pending_payment` |
| `quote_checkout` | Start payment for accepted quote |

Admin:

- `create_quote` — from current built cart + `customer_email`
- `list_quotes`, `cancel_quote`

Quotes snapshot line prices at creation. Custom per-line overrides are supported in the store API for future admin UI extensions.

## Related

- [Commerce plugin](plugins/commerce.md)
- [Commerce subscriptions](commerce-subscriptions.md)
- [Commerce analytics](commerce-analytics.md)
