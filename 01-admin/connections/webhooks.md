# Connections webhooks

## Summary

Under **Settings → Connections → Webhooks**, Birkly stores **signing secrets** in the shared vault and registers **inbound endpoints** for ESP bounce/complaint events. Outbound content webhooks remain listed under **Settings → Integrations → Webhooks**, but secrets migrate into Connections. Inbound URL shape: `/api/connections_webhooks.php?endpoint=<id>`. Hard bounces and complaints update the **suppression list** so future sends short-circuit as `suppressed`.

## Beginner

### Two kinds of webhook

| Kind | Purpose | Where you manage it |
|------|---------|---------------------|
| **Outbound (content)** | Birkly calls *your* URL when content changes | Settings → Integrations → Webhooks (signing secret in Connections vault) |
| **Inbound (ESP)** | Resend / Postmark / SES / Mailgun call *Birkly* about bounces | Settings → Connections → Webhooks |

Stripe payment webhooks stay in Commerce / Payments — Connections does not replace them.

### Add an inbound ESP endpoint

1. Open **Settings → Connections → Webhooks**.
2. Click **Add inbound endpoint**.
3. Name it (e.g. `Resend bounces`), choose provider (**Resend**, **Postmark**, **SES**, **Mailgun**, or generic).
4. Set a **signing secret** (match what you configure at the ESP).
5. Save. Copy the endpoint URL shown (or build it as below).
6. In your ESP dashboard, add a webhook for bounce / complaint (and optionally delivery) pointing at that URL.

Example URL:

```text
https://your-cms.example/api/connections_webhooks.php?endpoint=in_YOUR_ID&provider=resend
```

### Migrate Integrations secrets

If you already had outbound webhooks under Integrations:

1. Open **Connections → Webhooks**.
2. Click **Migrate Integrations secrets**.
3. Signing secrets move into the Connections vault; Integrations keeps the URL list and deep-links here for secret management.

### Suppressions

When a hard bounce or spam complaint arrives:

1. The address is added to **Delivery log & health → Suppressions**.
2. Later sends to that address return status **Suppressed** (no delivery attempt).
3. You can manually **Add** / remove suppressions for testing or GDPR cleanup.

### Signing for outbound webhooks

Integrations outbound webhooks can include an HMAC signature. After migration, the secret is read from the Connections vault. Use the Integrations UI to manage URLs/events; use Connections for the secret itself.

## Advanced Users

### Inbound public endpoint

`api/connections_webhooks.php`:

- Query: `endpoint` (required), `provider` (optional), `simulate=1` (test bypass when developing).
- Verifies signature via `birkly_verify_webhook($endpointId, $rawBody, $headers)` when a secret is registered.
- Accepted signature headers: `X-Birkly-Signature`, `X-Hub-Signature-256`, `X-Webhook-Signature`, `X-Postmark-Signature`, `svix-signature` (prefix `sha256=` stripped).

### Verify / sign helpers

```php
require_once __DIR__ . '/../core/connections.php';

$ok = birkly_verify_webhook($endpointId, $rawBody, $headers);
$sig = birkly_sign_webhook($endpointId, $payload); // HMAC-SHA256 hex
```

Vault ids:

- Inbound: `inbound:<endpointId>`
- Migrated Integrations: `integrations_wh:<webhookId>`
- Dual-read legacy plaintext: `data/webhooks/<id>.json` during migration

### ESP normalization

`birkly_connections_esp_webhook_handle()` maps provider payloads to events:

| Normalized type | Action |
|-----------------|--------|
| `bounce` / `hard_bounce` / `permanent_fail` | Suppression + delivery log `bounced` |
| `complaint` / `spam_complaint` | Suppression + `complained` |
| `soft_bounce` | Log `failed` / retry policy (no hard suppress) |

Native test shape:

```json
{
  "events": [
    { "type": "bounce", "email": "bad@example.com", "detail": "550 user unknown" }
  ]
}
```

### Storage

| File | Role |
|------|------|
| `settings/connections/inbound_webhooks.json` | Endpoint registry |
| Secrets vault | `signing_secret` |
| `settings/connections/suppressions.json` | Suppression list |
| `data/webhooks/*.json` | Legacy Integrations records (dual-read / migrate) |

### Admin REST

`api/connections.php`: `inbound_list`, `inbound_save`, `migrate_webhooks`, suppression CRUD, delivery log.

### Relation to Automation webhooks

Automation **incoming** workflow trigger URLs (`automation_webhook.php`) are a different surface — they start workflows. Connections inbound ESP endpoints update mail suppressions. See [Automation webhooks](../../05-automation/webhooks.md).

## Related

- [Connections overview](connections-overview.md)
- [Email setup](email-setup.md)
- [HTTP credentials](http-credentials.md)
- [Automation webhooks](../../05-automation/webhooks.md)
- [Settings](../settings.md)
