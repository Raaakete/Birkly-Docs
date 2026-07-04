# Payments plugin

The **Payments** plugin is a **connection hub** for payment providers. It stores credentials, routes webhooks, and exposes a unified **payment shelf** service that other plugins call. It does **not** include a shop, cart, or checkout — consumer plugins (Cart, Events, Membership, etc.) use the shelf API described in [Payment shelf API](payment-shelf-api.md).

## Summary

Enable **Payments** under **Settings → Plugins**. Open **Payments** in the sidebar to connect up to eight providers (Stripe, Mollie, PayPal, Adyen, Square, Razorpay, Komoju, Payssion), copy webhook URLs into each provider’s dashboard, and review activity in one log. Choose **auto** or **fixed** provider selection in Settings. Optionally enable a dashboard stats widget (off by default). Deactivating the plugin stops the shelf; consumer plugins should call `isConfigured()` before charging.

## Beginner

**What the Payments plugin does**

- **Connects providers** — Add one or more connections (test or live) with API keys stored encrypted on the server.
- **Unified activity log** — Payments, captures, refunds, subscriptions, and webhooks appear in one place with provider, status, amount, and source plugin reference.
- **Provider selection** — Site-wide rules pick which connected provider to use when a consumer plugin does not specify one.
- **Shelf for other plugins** — Cart, Events, and future commerce plugins call `get_plugin_service('payment_shelf')`; they never talk to Stripe or Mollie directly.

The plugin **does not** sell products, show a checkout page, or manage orders by itself.

**Enable the plugin**

1. **Settings → Plugins** → find **Payments** → **Enable**.
2. **Payments** appears in the sidebar.
3. Open **Connections** and click **Add Connection** for each provider you use.

**Add a provider connection**

1. Open **Payments → Connections**.
2. Click **Add Connection**.
3. Choose **Provider**, enter a **Label** (e.g. “Stripe Live”), and select **Mode** (Test / Sandbox or Live).
4. Fill in the credential fields for that provider (see table below).
5. Click **Test connection** if available, then **Save**.
6. Copy the **Webhook URL** shown for that connection into the provider’s webhook settings (see [Webhooks](#webhooks)).

Each provider ID can have one active connection at a time. The provider matrix at the top of Connections shows which adapters are connected and their capabilities (currencies, methods, refunds, subscriptions).

**Supported providers and credentials**

| Provider | ID | Credential fields |
|----------|-----|-------------------|
| Stripe | `stripe` | Secret Key |
| Mollie | `mollie` | API Key |
| PayPal | `paypal` | Client ID, Client Secret |
| Adyen | `adyen` | API Key, Merchant Account, HMAC Key (webhooks) |
| Square | `square` | Access Token, Location ID |
| Razorpay | `razorpay` | Key ID, Key Secret |
| Komoju | `komoju` | Secret Key |
| Payssion | `payssion` | API Key, Secret Key |

Enable only the providers you need. Unused adapters stay available but unconfigured.

**Webhooks**

Each provider sends payment status updates to a single Birkly endpoint. The URL is shown per connection in the connections table and follows this format:

```
{site_base_url}/api/index.php?route=payments_webhook&provider={provider_id}
```

Examples:

- Stripe: `https://yoursite.example/api/index.php?route=payments_webhook&provider=stripe`
- Mollie: `https://yoursite.example/api/index.php?route=payments_webhook&provider=mollie`

Register the URL in the provider’s dashboard for the events they support (e.g. payment succeeded, failed). Birkly verifies signatures, deduplicates events, writes to the activity log, and fires automation triggers when configured.

Use **HTTPS** in production so webhook payloads and credentials stay protected.

**Activity log**

Open **Payments → Activity** to review:

- **Type** — payment, capture, refund, subscription, webhook
- **Provider** — which adapter handled the event
- **Status** — succeeded, failed, pending, refunded, etc.
- **Source** — `source_plugin` and `source_ref` from the consumer that initiated the action (when provided)
- **Amount and currency** — when applicable

Filter by provider or status, then **Refresh**. Secrets in metadata are redacted; API keys never appear in the log.

**Provider selection (Settings tab)**

| Setting | Description |
|---------|-------------|
| **Provider selection mode** | **Auto** — resolve by currency, country, payment method, then default. **Fixed** — always use the default provider when the consumer does not specify one. |
| **Default provider** | Fallback when mode is fixed, or when auto rules do not match. Must be a connected provider. |

**Auto mode** (when the consumer passes `'auto'` or an empty provider) applies rules in order:

1. Explicit provider on the request (if connected)
2. Consumer hint (`provider_hint` in params or metadata)
3. Currency (e.g. JPY → Komoju, INR → Razorpay, CNY → Payssion)
4. Country (e.g. CN → Payssion, JP → Komoju, IN → Razorpay; EU → Mollie; US → Square when connected)
5. Payment method (e.g. iDEAL → Mollie, Alipay / WeChat → Payssion, Konbini / PayPay → Komoju)
6. Site default provider
7. First configured provider

**Fixed mode** uses the default provider (or the first connected provider if the default is not connected).

**Dashboard widget (opt-in)**

Payment stats on the admin home are **off by default**.

1. Open **Payments → Settings**.
2. Check **Enable dashboard widget**.
3. Choose **Dashboard widget roles** (default: Admin only).
4. Save.

When enabled, eligible roles see volume, success rate, and a link to **Payments**. Leave disabled if you prefer not to expose payment aggregates on the dashboard.

## Advanced Users

**Capabilities**

| Capability | Purpose |
|------------|---------|
| `manage_payments` | Create, edit, delete connections; save plugin settings |
| `view_payment_activity` | Read activity log and connection list |
| `view_payment_stats` | View aggregated stats (dashboard widget API) |
| `access_payment_shelf` | Granted to **consumer plugins** (not human roles) via plugin capability UI |

Admin access is enforced on `/api/index.php?route=payments`. Webhooks use the public `payments_webhook` route with signature verification only.

**Plugin paths**

- Plugin root: `plugins/payments/`
- Admin UI: `admin/payments.html`, `payments.js`, `payments.css`
- Admin API: `api/payments.php` (connections, activity, stats, settings)
- Webhooks: `api/webhook.php` (routed as `payments_webhook`)
- Runtime data: encrypted connections and activity under plugin data dir (not committed)

**Automation triggers**

When the Automation plugin is active, Payments registers:

- **Payment Succeeded** — optional filter by provider ID
- **Payment Failed** — optional filter by provider ID

Webhooks map provider events to these triggers and pass context: `payment_id`, `provider`, `status`, `amount_cents`, `currency`.

**Consumer integration**

Other plugins depend on the shelf, not on provider SDKs. See [Payment shelf API](payment-shelf-api.md) for `get_plugin_service('payment_shelf')`, method signatures, and granting `access_payment_shelf`.

**Deactivate behaviour**

Disabling Payments unregisters the shelf. Consumer plugins must handle a missing or unconfigured shelf gracefully (`isConfigured()` returns false).

## Related

- [Payment shelf API](payment-shelf-api.md) — developer guide for consumer plugins
- [Plugins](plugins.md)
- [Automation overview](../05-automation/automation-overview.md)
- [Dashboard](../01-admin/dashboard.md)
- [Roles and permissions](roles-and-permissions.md)
