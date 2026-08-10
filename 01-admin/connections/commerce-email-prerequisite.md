# Commerce email prerequisite

## Summary

Enabling a Commerce email template does **not** deliver mail by itself. Templates compose the message; **Settings → Connections** must have a healthy email transport for Birkly thank-you, shipping, donation, and invoice mail. Separately, **Stripe** can still send its own card **receipt** via Checkout `receipt_email` — that path does not use Birkly Connections. Both may fire for one order; design templates so customers are not thanked twice for the same payment.

## Beginner

### The rule to remember

> **Enable template ≠ deliver mail.**

| Piece | Job |
|-------|-----|
| Commerce → Emails (template on) | *What* to say and *when* (order paid, shipped, donation thanks, …) |
| Settings → Connections (Email healthy) | *How* the message leaves your server |

If Connections uses **Log only**, Commerce may record a send attempt as logged — the customer inbox stays empty. That is expected in development, not production.

### First-time checklist

1. **Settings → Connections** — configure SMTP or an ESP; **Test send** succeeds. See [Email setup](email-setup.md).
2. **Commerce → Emails** — enable the templates you want (order thank-you, shipping, donation thanks, etc.).
3. Place a test order (or use Commerce’s template test if available).
4. Confirm the **Birkly** message arrives from your Connections From address.
5. Optionally check whether Stripe also sent a **receipt** from Stripe’s domain.

### Stripe receipt vs Birkly thank-you

| Mail | Who sends it | Where you configure it |
|------|--------------|------------------------|
| **Card receipt** | Stripe | Stripe Dashboard / Checkout (`receipt_email` on the PaymentIntent) |
| **Thank-you / shipping / donation thanks / invoices** | Birkly | Commerce Emails + **Settings → Connections** |

- Stripe receipts are useful even when CMS mail is not configured yet.
- Birkly templates carry your brand, order lines, and fulfillment copy.
- If both are on, keep Birkly copy focused on the order/fulfillment story and avoid a second “thanks for paying” that duplicates Stripe’s receipt.

### Empty states and honesty

Commerce empty states and delivery notes should deep-link to **Settings → Connections** when email is unhealthy. Statuses:

- **Accepted** / provider accepted — handed to SMTP/ESP  
- **Logged only** — not delivered  
- **Failed** / **Suppressed** — see Connections Delivery log  

Never treat “template enabled” as proof the customer received mail.

### Automation optional

You no longer need the Automation plugin solely for Commerce SMTP. Connections alone is enough. If you still use Automation workflows for Slack or custom post-purchase steps, that is fine — see [Migration from Automation](migration-from-automation.md).

## Advanced Users

### Delivery path (target architecture)

```
CommerceEmailService::deliver / sendForTrigger
        ↓
birkly_send_mail(..., ['alias' => 'transactional_email', ...])
        ↓
Connections transport (smtp|resend|postmark|ses|mailgun|log|mail)
```

Honest result flags: `ok`, `status`, `logged`, `delivered` (where applicable). Log-only must not report success that implies inbox delivery without `logged: true`.

### Stripe `receipt_email`

Hosted Checkout sets `payment_intent_data[receipt_email]` from the customer email when configured. That is independent of `birkly_send_mail`. Disable Stripe receipts in the Stripe Dashboard if you want Birkly-only mail; or keep both with non-overlapping copy.

### Donation vs shop templates

Donation thank-you (`donation_thanks`) should use warmer copy than the shop receipt. Both still require the same Connections pipe.

### Notify fan-out

Ops can additionally route `commerce.order_paid` / `commerce.order_shipped` to Slack via [Notification routes](notification-routes.md) without changing customer-facing templates.

### Manifest

```json
{
  "requires_connections": [
    { "type": "email", "alias": "transactional_email", "optional": false }
  ]
}
```

### Ops Hub license mail

Marketplace Ops license / Hub purchase emails use the **Ops** mailer, not CMS Connections. Do not point merchants at Commerce Emails for Hub keys.

## Related

- [Connections overview](connections-overview.md)
- [Email setup](email-setup.md)
- [Migration from Automation](migration-from-automation.md)
- [Commerce plugin](../../06-extensibility/plugins/commerce.md)
- [Automation Commerce recipes](../../05-automation/commerce-recipes.md)
