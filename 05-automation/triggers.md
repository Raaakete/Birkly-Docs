# Triggers

Triggers define **when** an automation workflow runs. Birkly supports **scheduled** (time-based), **webhook** (HTTP request), and **entry** (CMS event) trigger types.

## Summary

A **trigger** is the "when" of a workflow. **Scheduled trigger:** pick a schedule (e.g. daily at 9:00, every hour) — the CMS runs the workflow at those times. **Webhook trigger:** Birkly gives you a URL; when something (another app, Zapier, your server) sends a POST to that URL, the workflow runs. **Entry trigger:** the workflow runs when an entry or sub-entry is created, updated, or deleted in a chosen collection. Use scheduled for recurring tasks; webhook for "something happened elsewhere"; entry trigger for "react to CMS content changes." Set the trigger when creating or editing a workflow under **Automation**.

## Beginner

The **trigger** is what starts a workflow. Three common options:

**1. Scheduled trigger — "Run at a fixed time"**

You choose when the workflow runs: e.g. "Every day at 9:00", "Every hour", "Every Monday at 8:00". The Birkly server runs the workflow at those times. No one has to click anything.

**Use cases**

- Send a daily or weekly digest.
- Every hour, call an external API to sync or check something.
- Run a cleanup or "publish scheduled posts" job at a set time.

**How to set it**

When creating or editing a workflow, select **Scheduled** as the trigger. Then set:

- **Schedule:** Often presets like "Every hour", "Daily", "Weekly", or a cron-style expression (e.g. "0 9 * * *" for 9:00 every day).
- **Timezone:** So "9:00" is in the right time zone.

Save the workflow. The server needs to have the scheduler enabled (cron or internal runner); on hosted Birkly this is usually already set up.

**2. Webhook trigger — "Run when someone/something calls a URL"**

Birkly gives the workflow a **unique URL**. When anything sends an HTTP request (usually POST) to that URL, the workflow runs. The "anything" can be: your form handler after a contact submission, Zapier, IFTTT, a payment provider, or your own backend.

**Use cases**

- Contact form submitted -> workflow runs -> Slack notification or email.
- Payment completed -> provider calls your webhook -> workflow runs -> update internal system or send receipt.
- CI/CD pipeline finishes -> calls webhook -> workflow runs -> post to Slack or update a dashboard.

**How to set it**

1. Create or edit a workflow and choose **Webhook** as the trigger.
2. The admin shows the **webhook URL** (e.g. `https://your-cms.com/api/automation_webhook.php?workflow=xyz`). Copy it.
3. Optionally set a **secret token**. Then only requests that include this token (e.g. in a header) will run the workflow. That way random people can't trigger it by guessing the URL.
4. In your form handler, payment callback, or other app, send a POST request to this URL when the event happens. You can send JSON or form data in the body; that data is often available inside the workflow as "payload" for conditions and actions.

**Example: trigger from a form**

After the user submits your contact form, your server (or Birkly's form endpoint) can do:

```bash
curl -X POST "https://your-cms.com/api/automation_webhook.php?workflow=abc123" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","message":"Hello"}'
```

The workflow runs and can use `payload.name`, `payload.email`, `payload.message` in conditions (e.g. "only if payload has email") and in actions (e.g. "Slack message: New contact from {{ payload.name }}").

**3. Entry trigger — "Run when a CMS entry changes"**

Instead of calling a webhook from your code, you can have Birkly fire a workflow **automatically** when an entry is created, updated, or deleted inside the CMS. No external call needed.

**Use cases**

- When a new blog post is published, post a summary to Slack.
- When a comment sub-entry is submitted on a post, send a moderation notification.
- When a product review is added, call a backend URL to update the average rating.

**How to set it**

1. Create or edit a workflow and choose **Entry created**, **Entry updated**, or **Entry deleted** as the trigger.
2. Use the **collection picker** to choose which collection to watch (e.g. "Blog posts"). Leave it blank to trigger on any collection.
3. If you want to react only to **sub-entries** (e.g. only to new comments, not to the blog post itself), enable the **sub-collection filter** and choose the sub-collection (e.g. "Comments").
4. Save and enable the workflow.

**Testing**

- **Scheduled:** Temporarily set the schedule to "every minute" or use "Run now" if the admin offers it, to verify actions without waiting.
- **Webhook:** Use curl or Postman to POST to the webhook URL and confirm the workflow runs and appears in the Automation logs.
- **Entry trigger:** Create or update an entry in the chosen collection and check the Automation logs to confirm the workflow ran.

## Advanced Users

**Scheduled trigger**

- **Behavior:** Workflow runs at fixed times (cron-like). Server must have a scheduler that invokes the Birkly automation runner (e.g. cron entry or internal loop).
- **Config:** Schedule expression (e.g. `0 9 * * *` for 9:00 daily) and timezone. UI may offer presets (Every hour, Daily, Weekly) or raw cron.
- **Use cases:** Digests, periodic sync, cleanup, scheduled publish.

**Webhook trigger**

- **Behavior:** Workflow runs when the server receives an HTTP request (usually POST) to the workflow's URL. Request body (JSON or form) is typically exposed as **payload** for conditions and actions.
- **Config:** Webhook URL (shown in admin), optional secret (header or query) for verification.
- **Use cases:** Form handlers, Zapier/IFTTT, payment/CI callbacks, any HTTP-capable system.
- **Security:** HTTPS; optional secret token or signature so only trusted callers can trigger. Don't expose the URL in client-side code if the workflow performs sensitive actions.

**Entry trigger**

- **Behavior:** Workflow runs when an entry (or sub-entry) is created, updated, or deleted in a specified collection. The CMS fires the trigger internally — no external webhook call required.
- **Config:** Select trigger type **Entry created**, **Entry updated**, or **Entry deleted**. Use the **collection picker** to narrow to one collection. To match only sub-entries, enable the **sub-collection filter** and choose the sub-collection handle (e.g. `comments` on `blog_posts`).
- **Payload context for sub-entry triggers:**

| Key | Value |
|-----|-------|
| `is_sub_entry` | `true` |
| `parent_collection` | handle of the parent collection |
| `parent_entry_id` | ID of the parent entry |
| `sub_collection` | handle of the sub-collection |

- **Use cases:** "When a comment is submitted on any blog post, notify the moderation Slack channel." "When a review is added to a product, call a backend URL to recalculate the average rating."

**Manual trigger**

- Run once from the admin for testing or one-off jobs.

**Payload**

For webhook triggers, the incoming body is parsed (JSON or form) and available as `payload` in conditions (e.g. "payload.email exists") and in action templates (e.g. `{{ payload.name }}`). For entry triggers, the entry's fields and metadata are available as payload. Exact structure and variable syntax are version-dependent.

**Testing**

- Scheduled: use "every minute" or "Run now" to confirm execution and logs.
- Webhook: `curl -X POST -d '{"test":true}' 'https://your-cms.com/api/automation_webhook.php?workflow=...'` (adjust URL/body to your setup).
- Entry trigger: create/update an entry in the target collection; check Automation logs.

**Commerce plugin triggers (when Commerce is active)**

| Trigger | When |
|---------|------|
| `commerce_order_paid` | Order paid (primary post-purchase trigger; recipe pack uses this) |
| `commerce_order_receipt` | Order paid — customer receipt |
| `commerce_order_admin_notify` | Order paid — staff notification |
| `commerce_subscription_payment_failed` | Subscription renewal failed (`past_due`) |
| `commerce_subscription_recovered` | Subscription payment recovered after failure |
| `commerce_subscription_started` | Recurring membership (`fulfillment: none`) paid — **canonical** (User plugin handles tier/activation) |
| `commerce_membership_started` | **Deprecated alias** for `commerce_subscription_started` — migrate workflows |
| `commerce_physical_fulfilled` | Physical line fulfilled |
| `commerce_digital_delivered` | Digital download delivered |
| `commerce_event_registered` | Event/workshop registration completed |
| `commerce_gift_card_issued` | Sellable gift-card line issued codes after pay |
| `commerce_shipment_created` | Shipment created on an order (Manual or EasyPost) |
| `commerce_order_shipped` | Customer notify when a shipment is created with notify enabled |
| `commerce_tracking_updated` | EasyPost tracking webhook updates a shipment |
| `commerce_low_stock` | Available inventory hits/goes below SKU threshold (debounced; Commerce 1.0.29) |

Starter workflows: [Commerce recipe pack](commerce-recipes.md). See also [Commerce subscriptions](../06-extensibility/commerce-subscriptions.md), [Commerce gift cards and draft orders](../06-extensibility/commerce-gift-cards-quotes.md), [Commerce fulfillment](../06-extensibility/commerce-fulfillment.md), and [Commerce analytics](../06-extensibility/commerce-analytics.md).

## Related

- [Automation overview](automation-overview.md)
- [Commerce recipe pack](commerce-recipes.md)
- [Conditions and actions](conditions-and-actions.md)
- [Webhooks](webhooks.md)
- [Sub-collections](../02-content/sub-collections.md)
