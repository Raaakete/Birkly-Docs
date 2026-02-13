# Webhooks

Webhooks in Birkly can mean two things: (1) **Incoming** — a URL that other services call to **trigger** an automation workflow when something happens elsewhere; (2) **Outgoing** — Birkly calling **your** URL when something happens in the CMS (e.g. entry created). Both let you connect Birkly to external tools without polling.

## Summary

**Incoming webhook:** You get a URL from an automation workflow (trigger type = Webhook). When another app (form, Zapier, payment provider) sends a POST to that URL, the workflow runs. Use it to start workflows from outside Birkly. **Outgoing webhook:** You configure a URL in the admin (e.g. under Webhooks or Settings). When a chosen event happens (e.g. “entry published”), Birkly sends an HTTP request to your URL with details. Use it to notify your backend or a third-party service. In both cases, use HTTPS and optional secrets for security.

## Beginner

**Incoming webhook = “Something else calls Birkly”**

When you create an automation workflow and choose **Webhook** as the trigger, Birkly gives you a **URL**. When any other system (your form handler, Zapier, a payment provider) sends a POST request to that URL, the workflow runs. So “incoming” means: the request comes **into** Birkly from the outside.

**Example:** Your contact form is submitted. Your server (or Birkly’s form endpoint) then POSTs to the workflow’s webhook URL. Birkly runs the workflow and, for example, sends a Slack message. You don’t have to poll or wait—one HTTP call starts the workflow.

**Outgoing webhook = “Birkly calls you”**

You tell Birkly: “When this event happens (e.g. an entry is published), send an HTTP request to **this** URL.” When the event occurs, Birkly **calls your** server or a third-party URL with details (e.g. entry ID, collection, changed fields). That way your backend can update a cache, sync to another system, or trigger more logic.

**Example:** Every time a blog post is published, Birkly POSTs to `https://your-site.com/api/cms-event`. Your endpoint receives the payload and, for example, rebuilds a static site or updates a search index.

**Difference in one sentence**

- **Incoming:** Others call Birkly → a workflow runs.
- **Outgoing:** Birkly calls you (or another URL) when something happens in the CMS.

**Security**

- Use **HTTPS** for all webhook URLs.
- For **incoming** webhooks, if the workflow can do sensitive things, use a **secret token** so only trusted callers can trigger it (e.g. send the token in a header; Birkly checks it).
- For **outgoing** webhooks, **validate** the request on your side (e.g. shared secret in header or signature) so only Birkly can call your endpoint. That way random people can’t fake “entry published” events.

## Advanced Users

**Incoming webhooks (automation trigger)**

- **Setup:** Create a workflow; set trigger to “Webhook”. Admin shows the URL and optional secret.
- **Usage:** Any HTTP client can POST to that URL. Body (JSON or form) is typically available as **payload** in conditions and actions.
- **Security:** HTTPS; optional secret in header or query; don’t expose URL in client-side code if the workflow is sensitive.
- **Test:** `curl -X POST -d '{"test":true}' 'https://your-cms.com/api/automation_webhook.php?workflow=...'` (adjust to your URL and body format).

**Outgoing webhooks (event notification)**

- **Setup:** In admin (e.g. **Settings → Webhooks** or **Webhooks** in sidebar), add a webhook: URL, optional secret, and which events to send (e.g. Entry created, Entry published).
- **Behavior:** On event, Birkly sends HTTP request (usually POST) to your URL with payload (e.g. entry id, collection, fields). Your endpoint can update cache, sync, or trigger further logic.
- **Security:** HTTPS; validate request (shared secret or signature) so only Birkly can call. Handle duplicate deliveries (idempotency) if the CMS retries.

**Incoming vs Automation “HTTP” action**

- **Incoming webhook** = **trigger** for a workflow (something calls Birkly to start it).
- **HTTP action** = **step inside** a workflow (“as part of this workflow, call this URL”). You choose when it runs (after which trigger and conditions).
- **Outgoing webhook** = **event-driven**; Birkly calls your URL whenever the configured event happens. No workflow conditions or multi-step logic—just “notify this URL on event.”

Use automation + HTTP action when the call is part of a multi-step workflow; use outgoing webhooks when you want simple “notify this URL on event” with no extra steps.

## Related

- [Automation overview](automation-overview.md)
- [Triggers](triggers.md)
- [Conditions and actions](conditions-and-actions.md)
- [Public forms](../04-integration/public-forms.md)
