# Automation Overview

Automation in Birkly lets you run workflows when something happens (a trigger)—e.g. on a schedule or when the CMS receives a webhook. Each workflow can check conditions and then run actions (e.g. send a Slack message, call an external URL, or update content).

## Summary

**Automation** = “When X happens, do Y.” You create **workflows** in the admin (e.g. under **Automation**). Each has a **trigger** (e.g. “Every day at 9:00” or “When we receive a webhook”), optional **conditions** (e.g. “only if the new entry has a certain field”), and **actions** (e.g. “POST to Slack”, “Send email”, “Call a URL”). Use it to notify your team, sync with other tools, or run recurring tasks without writing code. See [Triggers](triggers.md), [Conditions and actions](conditions-and-actions.md), and [Webhooks](webhooks.md) for details.

## Beginner

**Automation** means “when something happens, Birkly does something for you automatically.” You set it up once in the admin; after that, it runs without you clicking anything.

**What you can do with it**

- **Scheduled tasks:** “Every Monday at 9:00, do X” or “Every hour, check something and call an API.”
- **Reactive workflows:** “When someone submits the contact form, send a Slack message to the team” or “When a new entry is published, notify another system.”
- **Integrations:** Connect Birkly to Slack, email, CRMs, or your own backend by having Birkly call a URL or send a message.

You don’t need to set up cron jobs or write server code for basic flows—you configure them in the Birkly admin.

**Main pieces**

1. **Trigger** — When the workflow runs.
   - **Scheduled:** At a fixed time (e.g. daily at 9:00, every 5 minutes).
   - **Webhook:** When another app or your server sends an HTTP request to a special Birkly URL (e.g. after a form is submitted or a payment is received).
2. **Conditions** (optional) — “Only run the rest if …” (e.g. only if the submission has an email, or only on weekdays).
3. **Actions** — What actually runs: e.g. “Post to Slack”, “Send an email”, “Call this URL with this data.”

**Example: “Notify team when contact form is submitted”**

1. In the admin, go to **Automation** and create a new workflow.
2. **Trigger:** Choose **Webhook**. Birkly shows you a URL (e.g. `https://your-cms.com/api/automation_webhook.php?workflow=abc123`). When your form handler or another service POSTs to this URL, the workflow starts.
3. **Conditions:** Optional. e.g. “Payload has field `email`” so you only notify when the submission looks valid.
4. **Actions:** Add “Slack” — enter your Slack webhook URL and a message like “New contact: {{ payload.name }} – {{ payload.message }}”.
5. Save and enable the workflow.
6. On your website, when the form is submitted, your backend (or a Birkly form endpoint) can POST to the workflow’s webhook URL. Birkly then runs the workflow and sends the Slack message.

**Example: “Every day at 9:00, call an API”**

1. Create a workflow with a **Scheduled** trigger.
2. Set the schedule to “Daily at 9:00” (and your timezone).
3. Add an **HTTP** action: e.g. GET or POST to your own API or a third-party service.
4. Save and enable. The server will run this workflow every day at 9:00.

**Where to configure**

In the admin sidebar, open **Automation** (or **Workflows**). Create a new workflow, pick a trigger, add conditions if needed, then add one or more actions. For webhook triggers, the admin shows the URL to call; for scheduled triggers, set the time and timezone.

**Good practices**

- **Secrets:** Put API keys and webhook URLs in the workflow config or environment variables—not in screenshots or public docs.
- **Errors:** If an action fails (e.g. Slack is down), check the Automation logs in the admin to see the error and whether you need to fix the URL or credentials.
- **Rate limits:** If you run workflows very often, respect external APIs’ rate limits; the system may throttle or queue runs.

## Advanced Users

**Building blocks**

| Block | Role |
|-------|------|
| **Trigger** | When the workflow runs: Scheduled (cron-like), Webhook (HTTP request), or Entry created/updated (if supported). |
| **Conditions** | Optional filters: payload field equals X, time in range, entry collection, etc. AND/OR logic depends on UI. |
| **Actions** | Steps executed in order: Slack, HTTP request, Email, internal (e.g. update entry, log). |
| **Queue / rate limit** | System may queue or throttle to avoid overloading external services. |

**Where it runs**

- Triggers: scheduler (cron or internal) for time-based; webhook endpoint for HTTP-triggered.
- Conditions and actions run in order; conditions gate whether actions execute. Implementation details in core/automation or admin Help.

**Idempotency**

If a workflow can run twice for the same event (e.g. webhook retried), design actions to be idempotent where possible (e.g. “create entry” only if it doesn’t already exist, or use a unique key).

**Secrets and errors**

- Store API keys and tokens in workflow config or env; never in templates or logs.
- On action failure, the engine may retry or log; check automation logs. Retry/backoff behavior is version-dependent.

**Relation to webhooks**

- **Incoming webhook** = trigger for a workflow (something calls Birkly).
- **Outgoing webhook** = Birkly calls your URL when an event happens (e.g. entry published). See [Webhooks](webhooks.md).

## Related

- [Triggers](triggers.md)
- [Conditions and actions](conditions-and-actions.md)
- [Webhooks](webhooks.md)
- [Public forms](../04-integration/public-forms.md)
