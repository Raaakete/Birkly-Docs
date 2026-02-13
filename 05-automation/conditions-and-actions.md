# Conditions and Actions

In automation workflows, **conditions** decide whether the rest of the workflow runs (e.g. “only if field X is set”), and **actions** are the steps that run (e.g. “send Slack message”, “POST to URL”). You can have multiple conditions and multiple actions in one workflow.

## Summary

**Conditions** = “Only run the rest if …”. Examples: “payload has field `email`”, “entry status is published”, “hour is between 9 and 17.” **Actions** = “Do this.” Examples: **Slack** — post a message to a channel; **HTTP** — send a POST/GET to a URL (e.g. your backend, Zapier); **Email** — send an email (if configured). Add conditions in the workflow editor so the workflow doesn’t run when it’s not needed; add actions in the order you want them to run. See the Automation page in the admin for the exact options in your version.

## Beginner

**Conditions** are filters: “Only do the next steps if this is true.” **Actions** are the steps that actually do something: post to Slack, call a URL, send an email.

**Conditions**

They let you avoid running actions when it’s not relevant. Examples:

- “Only run if the webhook payload contains an `email` field” — so you don’t post to Slack when the request is invalid or a bot.
- “Only run if the new entry’s status is Published” — so you only notify when something goes live, not on every save.
- “Only run on weekdays” or “only between 9 and 17” — so you don’t send notifications at night.

You add one or more conditions in the workflow editor. If any condition fails (depending on whether your UI uses AND or OR), the actions are skipped.

**Example: “Notify only if contact form has email”**

1. Trigger: Webhook (e.g. called when the form is submitted).
2. Condition: “Payload has key `email`” (or “Payload field `email` is not empty”).
3. Action: Slack — “New contact: {{ payload.name }}, {{ payload.email }}”.

So if someone POSTs to the webhook without an email, the Slack message is not sent.

**Actions**

These are the “do this” steps. Common types:

- **Slack** — Post a message to a Slack channel. You configure: Slack webhook URL (or app), channel, and message text. The message can include variables (e.g. `{{ payload.name }}` or `{{ entry.title }}`) so each run shows real data.
- **HTTP request** — Call an external URL (GET, POST, PUT, etc.) with optional headers and body. Use this to notify your own API, Zapier, a CRM, or any service that accepts HTTP.
- **Email** — Send an email (if the server or plugin is configured for mail). You set recipient(s), subject, and body; body can often use the same variables (e.g. “New submission from {{ payload.name }}”).
- **Internal** — Some setups let you “update entry”, “create entry”, or “log” as actions. Check the Automation UI for the full list.

Actions run **in order**. If the first action is “POST to Slack” and the second is “POST to my API”, Slack runs first, then your API. If one action fails (e.g. Slack returns an error), the rest may be skipped—see the admin and logs.

**Example: two actions in one workflow**

1. Trigger: Webhook (contact form).
2. Condition: Payload has `email`.
3. Action 1: Slack — “New contact: {{ payload.name }} ({{ payload.email }}). Message: {{ payload.message }}”.
4. Action 2: HTTP POST to `https://my-crm.com/api/lead` with body `{"name":"{{ payload.name }}","email":"{{ payload.email }}"}`.

So each valid submission both notifies the team and creates a lead in your CRM.

**Variables in messages and URLs**

Where your version supports it, you can use placeholders like:

- `{{ payload.name }}` — from the webhook body.
- `{{ entry.title }}` — from an entry (when the trigger is “entry created/updated”).
- `{{ entry.slug }}`, `{{ entry.id }}`, etc.

Exact syntax (double braces, naming) depends on your Birkly version. Test with a simple message first.

**If something fails**

If an action fails (e.g. Slack is down or the URL returns 500), the workflow may stop and log the error. Check **Automation** or **Logs** in the admin to see what happened. Fix the URL or credentials and run again if needed; some setups support retries.

## Advanced Users

**Conditions**

- **Purpose:** Skip actions when the condition is false; reduces unnecessary API calls and keeps behavior predictable.
- **Where:** Workflow editor, “Conditions” section. Typical options: payload contains key X, payload field Y equals Z, time is weekday, time in range, entry collection, entry status.
- **Logic:** Multiple conditions may be AND (all must be true) or OR (at least one); depends on UI.
- **Payload:** For webhook triggers, “payload” is the parsed request body (JSON or form). Use for filtering (e.g. `payload.type == 'contact'`).

**Actions**

| Type | Config | Use |
|------|--------|-----|
| **Slack** | Webhook URL or app, channel, message text (with variables) | Notify a channel. |
| **HTTP** | Method, URL, headers, body (with variables) | Call your API, Zapier, CRM. |
| **Email** | Recipient(s), subject, body (with variables) | Send mail (if mail is configured). |
| **Internal** | Entry update/create, log | Modify content or log for debugging. |

Order of execution is sequential. Failure handling (stop vs continue, retries) is version-dependent.

**Variables in actions**

- Message bodies and URLs may support placeholders: `{{ payload.name }}`, `{{ entry.id }}`, etc. Syntax and available keys depend on the engine. Escape or sanitize if payload can contain user-controlled content that might break the request (e.g. newlines in URLs).

**Error handling**

- On action failure, workflow may stop and log. Check automation logs. Retry/fallback behavior is version-specific.

## Related

- [Automation overview](automation-overview.md)
- [Triggers](triggers.md)
- [Webhooks](webhooks.md)
