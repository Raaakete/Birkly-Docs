# Connections overview

## Summary

**Connections** is the shared Settings home for email, notification channels, HTTP API credentials, and webhook signing that Birkly and plugins use to *deliver* messages and call external services. Templates, Commerce emails, Automation workflows, and forms decide *what* to say; a healthy Connection is the pipe that actually delivers. This is separate from **Settings → AI** (AI providers and MCP). Mental model: **Connections = pipes · templates/workflows = messages**.

## Beginner

### What Connections is

Open **Settings → Connections**. You will see:

1. **Email (transactional)** — outbound mail health, From address, transport (SMTP, Log, Resend, Postmark, Amazon SES, Mailgun), Test send, and who uses it.
2. **Notification channels** — Slack, Discord, SMS (Twilio), plus **notification routes** (which events go where).
3. **API credentials** — shared HTTP secrets plugins can use without storing their own passwords.
4. **Webhooks** — signing secrets and inbound bounce/complaint endpoints for your email provider.
5. **Delivery log & health** — recent attempts, queue, and suppression list.

Subtitle in the admin: *“Email, notifications, and credentials Birkly and plugins share.”*

### Connections vs AI connections

| Place | What it configures |
|-------|--------------------|
| **Settings → Connections** | Email delivery, Slack/Discord/SMS, HTTP credentials, webhook secrets |
| **Settings → AI** | Built-in assistant API keys, MCP endpoints for Claude / Cursor / ChatGPT |

They share the word “connection” but are different products. AI never replaces SMTP; SMTP never lives under AI.

### Pipes vs templates (mental model)

- **Pipe (Connection)** — How mail or a Slack message leaves your server (SMTP host, Resend API key, Slack webhook URL).
- **Template / workflow / form notify** — What the message says and when it fires (Commerce thank-you template, Automation “Send email”, contact form notify).

Nothing reaches an inbox or Slack channel until the matching Connection is **healthy**. Enabling a Commerce email template alone does **not** deliver mail — see [Commerce email prerequisite](commerce-email-prerequisite.md).

### First setup (recommended path)

1. Go to **Settings → Connections**.
2. Under **Outbound mail**, set **From name** and **From email** (a real address on a domain you control).
3. Choose a **Transport**:
   - Local/dev: **Log only** (messages are recorded, not delivered — the UI will say *Logged only*, never *Sent*).
   - Production: **SMTP** or an ESP (**Resend**, **Postmark**, **Amazon SES**, **Mailgun**).
4. Fill provider fields (host/API key). Save.
5. Enter your own address in **Test send** and click **Test send**.
6. Check your inbox (or the Delivery log if you used Log).

When Email shows healthy, Commerce, Automation, public forms, invitations, password reset, and health alerts can all use the same pipe.

### Who uses transactional email

- Commerce transactional templates (orders, shipping, donations)
- Automation **Send email** actions
- Public form notifications and team invitations
- User Management password reset / email verify
- System health alerts (alias `ops_alerts`)

### Related beginner guides

- [Email setup](email-setup.md) — provider recipes
- [Notification routes](notification-routes.md) — Slack / Discord / SMS
- [Migration from Automation](migration-from-automation.md) — if you used Automation Setup SMTP before

## Advanced Users

### Architecture

```
Settings → Connections (admin UI)
        ↓
Core Connections service
  registry · aliases · encrypted secrets · audit · health
        ↓
┌─────────────────┬──────────────────┬────────────────────┐
│ birkly_send_mail│ birkly_notify    │ birkly_get_connection│
│ queue · retry   │ routes · fan-out │ HTTP / webhook helpers│
└────────┬────────┴────────┬─────────┴──────────┬─────────┘
   smtp/esp/log      slack/discord/sms/email   credentials
```

### Storage (under `settings/connections/`)

| Path | Role |
|------|------|
| `index.json` | Connection metadata (no raw secrets) |
| `secrets.enc` (vault) | Encrypted secret fields |
| `aliases.json` | Purpose aliases → connection id |
| `notification_routes.json` | Event → channel fan-out |
| `inbound_webhooks.json` | ESP bounce/complaint endpoints |
| `delivery_log/` | Rolling attempt log |
| `queue/` | Durable file queue |
| `suppressions.json` | Hard bounces / complaints |

### Aliases (shipped)

| Alias | Purpose |
|-------|---------|
| `transactional_email` | Orders, resets, invites, form notify (default) |
| `marketing_email` | Opt-in / promo-style plugin sends |
| `ops_alerts` | Health / system alerts |

Plugins bind to aliases, not to a hard-coded SMTP UI.

### Types & email providers

**Types:** `email`, `slack`, `discord`, `twilio_sms`, `http_credential`, `webhook_signing`, `inbound_webhook`.

**Email providers:** `smtp`, `log`, `mail` (PHP `mail()` — advanced escape hatch), `resend`, `postmark`, `ses`, `mailgun`.

### Delivery statuses

| Status | Admin language |
|--------|----------------|
| `queued` | Queued |
| `accepted` | Accepted by mail server / provider |
| `logged` | Logged only — not delivered |
| `failed` | Failed (+ stage) |
| `suppressed` | Suppressed |
| `bounced` / `complained` | From provider webhook |

Log transport must never be labeled “Sent.”

### Plugin & admin API

```php
require_once __DIR__ . '/../core/connections.php';

birkly_list_connections(['type' => 'email']);
birkly_get_connection('transactional_email'); // secrets only with include_secrets in trusted code
birkly_connection_health('transactional_email');
birkly_send_mail($to, $subject, $html, $opts);
birkly_notify($event, $payload, $opts);
birkly_http_with_connection($id, $request);
birkly_verify_webhook($endpointId, $rawBody, $headers);
```

Admin REST: `api/connections.php` — CRUD, `health`, `test_send`, `test_channel`, queue, log, suppressions, routes, aliases, inbound webhooks. Requires `read_settings` / `manage_settings`; secrets redacted on GET.

### Env overrides (production)

| Variable | Role |
|----------|------|
| `BIRKLY_SECRETS_KEY` | Vault encryption key (env preferred over local `security.json`) |
| `BIRKLY_SMTP_*` | SMTP host/port/user/password/encryption overrides |
| `BIRKLY_MAIL_FROM_*` | Default From name/email |
| `BIRKLY_RESEND_API_KEY`, `BIRKLY_POSTMARK_API_KEY`, `BIRKLY_MAILGUN_*`, `BIRKLY_SES_*` | ESP credentials |
| `BIRKLY_TWILIO_*` | SMS channel |

See [Email setup](email-setup.md) for the full table.

### MCP / agent tools

Agents diagnose delivery without reading passwords:

| Capability | Behavior |
|------------|----------|
| List / get **connection health** | Always available to connected MCP clients (metadata + checklist; **no secrets**) |
| Propose connection update / test send | Privileged AI role; **approval required by default** (same spirit as other write tools) |
| Secret fields | Never returned in tool results |

Help topic ids for admin Help / `ai_topic` mapping: `connections`, `connections-email`, `connections-notification-routes`, `connections-http-credentials`, `connections-webhooks`, `connections-migration`, `commerce-email-prerequisite`. Offline CMS snapshots live under Birkly `admin/docs/snapshots/` (sync separately — not in this repo).

### Distinction from Ops Marketplace mail

CMS Connections (`birkly_send_mail`) is **not** the Ops Hub license mailer (`marketplace_send_mail` / Resend on Ops). Different runtime, different secrets. Pattern parity only.

### Out of scope

Connections is not a marketing campaign / newsletter product, hosted ESP, or the home for Stripe payment keys or AI/MCP keys.

## Related

- [Email setup](email-setup.md)
- [Notification routes](notification-routes.md)
- [HTTP credentials](http-credentials.md)
- [Webhooks](webhooks.md)
- [Migration from Automation](migration-from-automation.md)
- [Commerce email prerequisite](commerce-email-prerequisite.md)
- [AI connections](../ai-connections.md) — Settings → AI (different product)
- [Settings](../settings.md)
