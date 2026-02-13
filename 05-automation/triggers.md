# Triggers

Triggers define **when** an automation workflow runs. In Birkly, common trigger types are **scheduled** (time-based) and **webhook** (when an HTTP request is received).

## Summary

A **trigger** is the “when” of a workflow. **Scheduled trigger:** pick a schedule (e.g. daily at 9:00, every hour). The CMS runs the workflow at those times. **Webhook trigger:** Birkly gives you a URL; when something (another app, Zapier, your server) sends a POST to that URL, the workflow runs. Use scheduled for recurring tasks; use webhook for “when something happens elsewhere” (form submitted, payment received, etc.). Set the trigger when creating or editing a workflow under **Automation**.

## Beginner

The **trigger** is what starts a workflow. Two common options:

**1. Scheduled trigger — “Run at a fixed time”**

You choose when the workflow runs: e.g. “Every day at 9:00”, “Every hour”, “Every Monday at 8:00”. The Birkly server runs the workflow at those times. No one has to click anything.

**Use cases**

- Send a daily or weekly digest.
- Every hour, call an external API to sync or check something.
- Run a cleanup or “publish scheduled posts” job at a set time.

**How to set it**

When creating or editing a workflow, select **Scheduled** as the trigger. Then set:

- **Schedule:** Often presets like “Every hour”, “Daily”, “Weekly”, or a cron-style expression (e.g. “0 9 * * *” for 9:00 every day).
- **Timezone:** So “9:00” is in the right time zone.

Save the workflow. The server needs to have the scheduler enabled (cron or internal runner); on hosted Birkly this is usually already set up.

**2. Webhook trigger — “Run when someone/something calls a URL”**

Birkly gives the workflow a **unique URL**. When anything sends an HTTP request (usually POST) to that URL, the workflow runs. The “anything” can be: your form handler after a contact submission, Zapier, IFTTT, a payment provider, or your own backend.

**Use cases**

- Contact form submitted → workflow runs → Slack notification or email.
- Payment completed → provider calls your webhook → workflow runs → update internal system or send receipt.
- CI/CD pipeline finishes → calls webhook → workflow runs → post to Slack or update a dashboard.

**How to set it**

1. Create or edit a workflow and choose **Webhook** as the trigger.
2. The admin shows the **webhook URL** (e.g. `https://your-cms.com/api/automation_webhook.php?workflow=xyz`). Copy it.
3. Optionally set a **secret token**. Then only requests that include this token (e.g. in a header) will run the workflow. That way random people can’t trigger it by guessing the URL.
4. In your form handler, payment callback, or other app, send a POST request to this URL when the event happens. You can send JSON or form data in the body; that data is often available inside the workflow as “payload” for conditions and actions.

**Example: trigger from a form**

After the user submits your contact form, your server (or Birkly’s form endpoint) can do:

```bash
curl -X POST "https://your-cms.com/api/automation_webhook.php?workflow=abc123" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","message":"Hello"}'
```

The workflow runs and can use `payload.name`, `payload.email`, `payload.message` in conditions (e.g. “only if payload has email”) and in actions (e.g. “Slack message: New contact from {{ payload.name }}”).

**Testing**

- **Scheduled:** Temporarily set the schedule to “every minute” or use “Run now” if the admin offers it, to verify actions without waiting.
- **Webhook:** Use curl or Postman to POST to the webhook URL and confirm the workflow runs and appears in the Automation logs.

## Advanced Users

**Scheduled trigger**

- **Behavior:** Workflow runs at fixed times (cron-like). Server must have a scheduler that invokes the Birkly automation runner (e.g. cron entry or internal loop).
- **Config:** Schedule expression (e.g. `0 9 * * *` for 9:00 daily) and timezone. UI may offer presets (Every hour, Daily, Weekly) or raw cron.
- **Use cases:** Digests, periodic sync, cleanup, scheduled publish.

**Webhook trigger**

- **Behavior:** Workflow runs when the server receives an HTTP request (usually POST) to the workflow’s URL. Request body (JSON or form) is typically exposed as **payload** for conditions and actions.
- **Config:** Webhook URL (shown in admin), optional secret (header or query) for verification.
- **Use cases:** Form handlers, Zapier/IFTTT, payment/CI callbacks, any HTTP-capable system.
- **Security:** HTTPS; optional secret token or signature so only trusted callers can trigger. Don’t expose the URL in client-side code if the workflow performs sensitive actions.

**Other triggers (if supported)**

- **Entry created / updated:** Workflow runs when an entry is saved in a given collection. Useful for “on contact submit, notify team” without a separate webhook call from the form handler.
- **Manual:** Run once from the admin (testing or one-off).

**Payload**

For webhook triggers, the incoming body is parsed (JSON or form) and available as `payload` in conditions (e.g. “payload.email exists”) and in action templates (e.g. `{{ payload.name }}`). Exact structure and variable syntax are version-dependent.

**Testing**

- Scheduled: use “every minute” or “Run now” to confirm execution and logs.
- Webhook: `curl -X POST -d '{"test":true}' 'https://your-cms.com/api/automation_webhook.php?workflow=...'` (adjust URL/body to your setup).

## Related

- [Automation overview](automation-overview.md)
- [Conditions and actions](conditions-and-actions.md)
- [Webhooks](webhooks.md)
