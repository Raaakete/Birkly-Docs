# Commerce subscriptions — upgrades and dunning

Recurring **purchase options** create subscriptions when checkout completes. Phase 11 adds **plan upgrades** on the same product and **dunning** when provider payments fail.

## Summary

Open **Commerce → Subscriptions** to view active, past-due, and canceled subscriptions. Merchants can **upgrade or downgrade** between recurring purchase options on the same catalog entry (for example monthly → annual). When a payment fails, the subscription moves to **past_due**, stores dunning metadata, fires automation triggers, and optionally sends a built-in email. Admins can **retry payment** from the subscription detail panel.

## Beginner

**What is a subscription?**

A subscription is an ongoing payment for a recurring purchase option — for example €19/month for a yoga membership. It is created automatically when a customer checks out with a **Subscribe** option.

**Viewing subscriptions**

1. Open **Commerce** in the admin sidebar.
2. Click the **Subscriptions** tab.
3. The list shows customer email, plan, status, and next billing date.
4. Click a row to open the detail panel.

**Changing a customer's plan (upgrade / downgrade)**

Upgrades apply to the **same product** with a different recurring purchase option — for example switching from monthly to annual on the same membership entry.

1. Open the subscription detail.
2. Under **Change plan**, pick a new option from the dropdown.
3. Click **Upgrade**.
4. The provider updates the subscription; status and next billing date refresh after the provider confirms.

You cannot move a subscription to a different product in one step — cancel and create a new subscription instead.

**When payments fail (dunning)**

If the payment provider reports a failed renewal:

- Status becomes **past due** with a dunning badge showing attempt count.
- Automation can react (see below).
- Optional **dunning emails** can notify the customer (Commerce → Settings).

**Recovering a subscription**

When payment succeeds again, status returns to **active** and dunning metadata is cleared. You can also click **Retry payment** on a past-due subscription to request a manual retry through the provider.

**Optional dunning emails**

Under **Commerce → Settings → Dunning emails**:

1. Enable **Send dunning email on payment failure**.
2. Customize subject and body.
3. Use placeholders: `{subscription_id}`, `{customer_email}`, `{amount}`, `{interval}`, `{attempt_count}`.

Automation triggers remain the recommended path for branded emails and multi-step recovery flows.

## Advanced Users

**Subscription record**

Stored under `data/plugins/commerce/subscriptions/` as JSON. Key fields:

| Field | Notes |
|-------|-------|
| `status` | `active`, `past_due`, `canceled` |
| `purchase_option_id` | Recurring option on the catalog line |
| `provider_subscription_id` | Stripe/Mollie subscription id |
| `dunning` | `{ attempt_count, last_failed_at, last_invoice_id }` when past due |
| `upgraded_at` | Set after successful plan change |

**Upgrade service**

`SubscriptionUpgradeService` lists recurring `purchase_options` on the same catalog entry (excluding the current option) and calls the payment shelf to update the provider subscription. Same-plan requests are rejected; canceled subscriptions cannot upgrade.

**API actions** (`route=commerce`, admin session):

| Action | Purpose |
|--------|---------|
| `list_subscriptions` | All subscriptions |
| `get_subscription` | Single record by id |
| `list_subscription_upgrade_options` | Eligible purchase options |
| `upgrade_subscription` | `{ id, purchase_option_id }` |
| `cancel_subscription` | Cancel + provider sync when available |
| `retry_subscription_payment` | Manual retry on `past_due` |

**Dunning webhooks**

Provider webhooks (`invoice.payment_failed`, recovery events) update subscription status via `CommerceSubscriptionService`. On failure:

- Fires `commerce_subscription_payment_failed` automation trigger.
- Optionally sends email via `CommerceDunningNotifier` when `dunning_email_enabled` is true.

On recovery:

- Clears `dunning` metadata.
- Fires `commerce_subscription_recovered`.

**Automation triggers**

| Trigger | When |
|---------|------|
| `commerce_subscription_payment_failed` | Invoice/payment failed; subscription `past_due` |
| `commerce_subscription_recovered` | Payment succeeds after failure |

Configure workflows under **Automation** using these trigger types for Slack, email, or internal tasks.

## Related

- [Commerce plugin](plugins/commerce.md)
- [Commerce fieldtype](commerce-fieldtype.md) — recurring purchase options
- [Automation triggers](../05-automation/triggers.md)
- [Commerce membership wiring](commerce-membership.md) — redirects to [User signup and membership](user-signup-membership.md)
