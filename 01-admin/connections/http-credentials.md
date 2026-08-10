# HTTP credentials

## Summary

**API credentials** under **Settings → Connections** store shared HTTP auth (bearer, basic, custom header, or query) that plugins resolve at runtime — so shipping, CRM, or fulfillment plugins do not invent private secret files. Admins create a named credential with base URL and secret; plugins call `birkly_get_connection` / `birkly_http_with_connection`. Secrets are encrypted and never returned in full on ordinary reads.

## Beginner

### When you need this

Use API credentials when a plugin asks for a third-party API key that is **not** email, Slack, Discord, SMS, Stripe payments, or AI. Examples: shipping rate APIs, CRM sync, custom ERP.

Stripe payment keys stay in Commerce / Payments. AI keys stay under **Settings → AI**.

### Add a credential

1. Open **Settings → Connections → API credentials**.
2. Click **Add credential**.
3. Fill in:
   - **Name** — e.g. `Shipping API`
   - **Base URL** — e.g. `https://api.shipper.example`
   - **Auth mode** — Bearer token, Basic, custom header, or query parameter
   - **Secret** — API token / password (stored encrypted; shown masked after save)
4. Optionally set default headers or timeout.
5. Save. Use **Test request** (method + path) to verify connectivity.

### Give plugins access

Most official plugins offer a picker for “use Connections credential …”. Choose the name you saved. You do not paste the raw token into the plugin again.

If a Hub plugin declares that it needs Connections, install/setup may warn until a matching credential or email connection exists.

### Security habits

- Prefer one credential per external system (easier to rotate).
- Rotate secrets in the provider dashboard, then update the Connection (leave password blank to keep the old value only when you are *not* rotating).
- Only admins with settings permission should edit credentials.

## Advanced Users

### Connection type

`type: http_credential`

Typical `config`:

```json
{
  "base_url": "https://api.example.com",
  "auth_mode": "bearer",
  "auth_header": "Authorization",
  "auth_query_param": "api_key",
  "username": "",
  "default_headers": { "Accept": "application/json" },
  "timeout": 20
}
```

Secrets vault fields: `token` / `api_key` / `secret` / `password` (and optional `username` for basic).

### Plugin resolve API

```php
require_once __DIR__ . '/../core/connections.php';

// Metadata only (safe for pickers)
$meta = birkly_get_connection('shipping_api'); // id or alias
$public = birkly_http_connection_public('shipping_api');

// Trusted plugin/core send path — applies auth and performs HTTP
$resp = birkly_http_with_connection('shipping_api', [
    'method' => 'GET',
    'path' => '/v1/rates',
    'query' => ['country' => 'DK'],
    'headers' => ['X-Request-Id' => $requestId],
    'timeout' => 15,
]);
// $resp: ok, status, body, url (query secrets masked)
```

`birkly_get_connection($id, ['include_secrets' => true])` is gated for trusted core/plugin code only. Admin GET and MCP reads must never echo raw secrets.

### Auth modes

| `auth_mode` | Behavior |
|-------------|----------|
| `bearer` | `Authorization: Bearer <secret>` |
| `basic` | `Authorization: Basic base64(user:pass)` |
| `header` | Custom header name from `auth_header` |
| `query` | Query param from `auth_query_param` |

### Admin REST

`api/connections.php`:

- `save` / `delete` / `list` with `type=http_credential`
- `http_test` — exercise method/path without exposing the secret in the response body logs

### Manifest contract

Hub / plugin manifests may declare:

```json
{
  "requires_connections": [
    { "type": "http_credential", "alias": "shipping_api", "optional": false },
    { "type": "email", "alias": "transactional_email", "optional": true }
  ]
}
```

Admin Hub/install UX can warn when required Connections are missing. Marketplace third-party plugins use the same resolve APIs and cannot read raw secrets.

### Aliases

Bind a purpose slug in `aliases.json` (or admin aliases UI) so plugins resolve `shipping_api` / `crm_api` without hard-coding connection ids.

## Related

- [Connections overview](connections-overview.md)
- [Webhooks](webhooks.md)
- [Plugin development](../../06-plugin-economy/plugin-development.md)
- [Payments plugin](../../06-extensibility/payments-plugin.md) — payment keys stay there, not here
