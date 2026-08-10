# Email setup

## Summary

Configure outbound email under **Settings → Connections → Outbound mail**. Choose a transport (SMTP, Log, Resend, Postmark, Amazon SES, or Mailgun), set From name/email, save, then **Test send**. Production should use SMTP or an ESP; **Log only** is for local development and never claims inbox delivery. PHP `mail()` remains an advanced escape hatch and is discouraged on Docker.

## Beginner

### Before you start

- You need a **From email** on a domain you control (or a provider-verified domain).
- For production, prefer **SMTP** or a hosted provider (**Resend**, **Postmark**, **Amazon SES**, **Mailgun**).
- Use **Log only** on a laptop when you only need to see that templates fire — check **Delivery log**, not your inbox.

### Step-by-step

1. Open **Settings → Connections**.
2. In **Outbound mail**, set:
   - **From name** — e.g. `Acme Shop`
   - **From email** — e.g. `orders@example.com`
3. Pick **Transport** and fill the fields for that choice (recipes below).
4. Click **Save email connection**.
5. Enter your address → **Test send**.
6. Confirm health shows green / Healthy (or *Logged only* for Log).

Optional: review **DNS deliverability hints** under the email section (SPF / DKIM / DMARC guidance). Finish DNS at your DNS host or ESP dashboard — Birkly does not host DKIM keys for you.

### Recipe: Log only (development)

1. Transport → **Log only (development)**.
2. Save → Test send.
3. Open **Delivery log & health** — status is **Logged only**, not Sent.
4. Do **not** leave Log as the production transport; the admin warns if you do.

### Recipe: SMTP

Typical for Google Workspace, Microsoft 365, Mailcow, or any relay.

1. Transport → **SMTP**.
2. Enter **SMTP host**, **Port** (often `587`), **Username**, **Password**.
3. **Encryption**: STARTTLS (common on 587), SSL (often 465), or None (local only).
4. Save → Test send.

Ask your host for the correct host/port. Wrong TLS mode is the most common failure.

### Recipe: Resend

1. Create an API key in the Resend dashboard; verify your sending domain.
2. Transport → **Resend**.
3. Paste the **API key**.
4. From email must be on a Resend-verified domain.
5. Save → Test send.
6. Optional: register Resend bounce webhooks under [Webhooks](webhooks.md).

### Recipe: Postmark

1. Create a Server API token in Postmark; verify the sender domain/signature.
2. Transport → **Postmark**.
3. Paste the **API key**.
4. Save → Test send.
5. Optional: point Postmark bounce/complaint webhooks at Connections inbound endpoints.

### Recipe: Amazon SES

Birkly’s SES adapter uses the **HTTPS API** (not the SES console “SMTP credentials” path by default).

1. In AWS: verify domain/email, move out of sandbox if needed, create an IAM user with `ses:SendEmail` / `ses:SendRawEmail`.
2. Transport → **Amazon SES**.
3. Enter **Access key ID**, **Secret** (API key field), and **Region** (e.g. `us-east-1`).
4. From email must be verified in that region.
5. Save → Test send.

> **Tip:** Prefer SES SMTP credentials? Use transport **SMTP** with Amazon’s SMTP endpoint instead — same Connections page, different transport.

### Recipe: Mailgun

1. Verify domain in Mailgun; create a Private API key.
2. Transport → **Mailgun**.
3. Paste **API key** and **Domain** (e.g. `mg.example.com`).
4. Save → Test send.

### Recipe: PHP mail() (advanced)

1. Transport → **PHP mail() — advanced**.
2. Only use when the host’s MTA is correctly configured.
3. Health may warn on Docker / hosts without a local MTA — prefer SMTP or an ESP.

### After email works

- Wire Commerce templates — still need Connections healthy: [Commerce email prerequisite](commerce-email-prerequisite.md).
- Add Slack/Discord/SMS routes: [Notification routes](notification-routes.md).
- Migrating from Automation Setup SMTP: [Migration from Automation](migration-from-automation.md).

## Advanced Users

### Pipeline API

```php
require_once __DIR__ . '/../core/connections.php';

$result = birkly_send_mail(
    'customer@example.com',
    'Order paid',
    '<p>Thanks for your order.</p>',
    [
        'alias' => 'transactional_email', // or marketing_email / ops_alerts
        'text' => 'Thanks for your order.',
        'mode' => 'sync',                 // or 'queue'
        'idempotency_key' => 'order_123_paid',
        'reply_to' => 'support@example.com',
        // 'attachments' => [['filename' => 'invoice.pdf', 'content' => $bytes, 'mime' => 'application/pdf']],
        // 'brand_key' => 'eu',            // uses config.from_overrides when set
    ]
);
// status: queued|accepted|logged|failed|suppressed|bounced|complained
```

Plugins compose HTML; they must not store platform SMTP passwords. Resolve health with `birkly_connection_health('transactional_email')`.

### Admin REST

`api/connections.php` (auth: `read_settings` / `manage_settings`):

| Action | Purpose |
|--------|---------|
| `list` / `get` / `save` / `delete` | CRUD (secrets redacted on GET) |
| `health` | Checklist + last success/failure |
| `test_send` | Interactive test |
| `process_queue` / `queue_list` | Durable queue |
| `list_log` | Delivery log |
| `suppressions_*` | Bounce/complaint list |

### Environment overrides

When set, env values win over UI-stored secrets (UI may show “Managed by environment”).

| Variable | Use |
|----------|-----|
| `BIRKLY_SECRETS_KEY` | AES key for the secrets vault (64 hex chars or passphrase hashed to SHA-256). **Required in production.** Local installs auto-generate `settings/security.json` `encryption_key` with a warning. |
| `BIRKLY_SMTP_HOST` | SMTP host override |
| `BIRKLY_SMTP_PORT` | Port (e.g. `587`) |
| `BIRKLY_SMTP_USER` / `BIRKLY_SMTP_USERNAME` | Auth user |
| `BIRKLY_SMTP_PASSWORD` / `BIRKLY_SMTP_PASS` | Auth password |
| `BIRKLY_SMTP_ENCRYPTION` | `tls` · `ssl` · `none` |
| `BIRKLY_MAIL_FROM_EMAIL` / `BIRKLY_MAIL_FROM_NAME` | Default From |
| `BIRKLY_RESEND_API_KEY` or `RESEND_API_KEY` | Resend |
| `BIRKLY_POSTMARK_API_KEY` or `POSTMARK_API_TOKEN` | Postmark |
| `BIRKLY_MAILGUN_API_KEY` / `BIRKLY_MAILGUN_DOMAIN` (or `MAILGUN_API_KEY`) | Mailgun |
| `BIRKLY_SES_ACCESS_KEY` / `BIRKLY_SES_SECRET_KEY` / `BIRKLY_SES_REGION` (or standard `AWS_*`) | SES HTTPS API |

### Transports (implementation)

| Provider | Module | Notes |
|----------|--------|-------|
| `smtp` | `core/mail/smtp.php` | Dependency-free sockets; STARTTLS/SSL |
| `log` | `core/mail/log.php` | Returns `logged: true` |
| `mail` | `core/mail/mail_php.php` | PHP `mail()` |
| `resend` / `postmark` / `ses` / `mailgun` | Thin HTTPS adapters | Store provider message id when present |

### Queue & retries

- Default interactive path: **sync**.
- `mode => 'queue'` or transient failures: durable files under `settings/connections/queue/`, exponential backoff, dead-letter in delivery log.
- Drain via admin **Process queue**, request hook, or cron calling `birkly_connections_process_queue()`.

### DNS hints

`birkly_connections_dns_hints($fromEmail)` soft-looks up SPF/DKIM/DMARC TXT for the From domain. Guidance only — not a full deliverability suite.

### Legacy dual-read

If no core email connection exists, resolve falls back to `settings/automation_mail.json`, then User plugin `email_settings.json`. First save in Connections migrates into the vault — see [Migration from Automation](migration-from-automation.md).

## Related

- [Connections overview](connections-overview.md)
- [Webhooks](webhooks.md) — bounce / complaint ingest
- [Commerce email prerequisite](commerce-email-prerequisite.md)
- [Monitoring and health alerts](../../07-operations/monitoring-alerts.md)
