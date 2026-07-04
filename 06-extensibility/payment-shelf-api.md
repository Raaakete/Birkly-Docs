# Payment shelf API

The **payment shelf** is the stable integration surface for plugin authors who need to charge, capture, refund, or manage subscriptions. The Payments plugin registers it as `payment_shelf`. Consumer plugins call the shelf; they do **not** call Stripe, Mollie, or other provider APIs directly.

This document covers the shelf only. Cart, checkout UX, and order storage are out of scope (future consumer plugins).

## Summary

Obtain the shelf with `get_plugin_service('payment_shelf')`. Check `isConfigured()` before use. Resolve a provider with `resolveProvider()` or pass `'auto'` / a provider ID to `createPayment()`. Pass `source_plugin` and `source_ref` in the **context** array so the activity log traces your plugin. Grant your plugin the `access_payment_shelf` capability. Listen for automation events `payment_succeeded` and `payment_failed` if you use workflows.

## Prerequisites

1. **Payments plugin enabled** on the site.
2. At least one **provider connection** configured in admin.
3. Your plugin declares a dependency on Payments (recommended in `plugin.json`).
4. Your plugin is granted **`access_payment_shelf`** (Settings → Plugins → your plugin → capabilities).

Without the capability, `get_plugin_service('payment_shelf')` returns `null` when the registry checks the requesting plugin ID.

## Obtaining the shelf

```php
$shelf = get_plugin_service('payment_shelf');
if (!$shelf || !$shelf->isConfigured()) {
    // Payments off or no connections — degrade gracefully
    return;
}
```

The service is a `PaymentShelf` instance registered at Payments plugin load:

```php
register_plugin_service('payment_shelf', $shelf, [
    'version' => '1.0.0',
    'description' => 'Payment processing shelf for consumer plugins',
    'capability' => 'access_payment_shelf',
    'scope' => 'global',
]);
```

Pass your plugin ID as the third argument to `get_plugin_service()` when calling from generic bootstrap code so capability checks apply:

```php
$shelf = get_plugin_service('payment_shelf', true, 'your_plugin_id');
```

## Core methods

### `isConfigured(): bool`

Returns `true` when at least one provider connection is saved and enabled. Call this before any charge operation.

### `listAvailableProviders(array $filters = []): array`

Returns provider metadata for UI or logic. Each entry includes `id`, `name`, `configured`, and `capabilities` (regions, currencies, methods, features).

Optional filters:

| Filter | Effect |
|--------|--------|
| `configured_only` | Only providers with an active connection |
| `currency` | Providers supporting the currency (or `*`) |
| `country` | Providers supporting the region (or `*`) |
| `method` | Providers supporting the payment method |

`listProviders()` is an alias that calls `listAvailableProviders([])` with no filters.

### `resolveProvider(array $criteria): ?string`

Returns a provider ID string or `null`. Uses site **selection_mode** (`auto` vs `fixed`) and the criteria keys below.

| Key | Purpose |
|-----|---------|
| `provider` or `provider_id` | Explicit provider (must be connected) |
| `provider_hint` | Consumer preference; also read from `metadata.provider_hint` |
| `currency` | ISO currency code (e.g. `eur`, `jpy`) |
| `country` | ISO country code (e.g. `DE`, `CN`) |
| `method` or `payment_method` | e.g. `ideal`, `alipay`, `card` |

Resolution order in **auto** mode: explicit → hint → currency map → country map → method map → site default → first configured.

### `getProviderCapabilities(string $provider): array`

Returns the adapter capability array: `regions`, `currencies`, `methods`, `features` (`capture`, `refunds`, `subscriptions`, `webhooks`).

### `getWebhookUrl(string $provider): string`

Returns the public webhook URL for admin display or debugging:

```
{base}/api/index.php?route=payments_webhook&provider={provider_id}
```

Webhook handling is internal to Payments; consumers normally do not register webhooks themselves.

## Payment operations

All mutating methods accept an optional **`$context`** array. Use it for activity-log tracing:

| Context key | Purpose |
|-------------|---------|
| `source_plugin` | Your plugin ID (e.g. `events_tickets`) |
| `source_ref` | Your reference (order ID, entry ID, invoice key) |

### `createPayment(string $provider, array $params, array $context = []): array`

Creates a payment with the given provider. Pass `'auto'` or `''` as `$provider` to run `resolveProvider()` on merged `$params` and `$context`.

**Params** (typical):

| Key | Required | Description |
|-----|----------|-------------|
| `amount_cents` | Yes | Integer minor units |
| `currency` | Yes | ISO code (e.g. `usd`, `eur`) |
| `description` | No | Shown on provider side when supported |
| `metadata` | No | Key/value passed to provider |

**Returns:** array with at least `ok` (bool). On success: `provider`, `payment_id`, `status`, and provider-specific fields (e.g. `client_secret` for Stripe). On failure: `error` message.

```php
$result = $shelf->createPayment('auto', [
    'amount_cents' => 2900,
    'currency' => 'eur',
    'description' => 'Workshop ticket',
    'metadata' => ['ticket_id' => '42'],
], [
    'source_plugin' => 'my_plugin',
    'source_ref' => 'ticket_42',
]);

if (!($result['ok'] ?? false)) {
    // handle $result['error']
}
```

### `capturePayment(string $provider, string $paymentId, array $params = [], array $context = []): array`

Captures a previously authorized payment when the adapter supports `features.capture`.

### `refundPayment(string $provider, string $paymentId, ?int $amountCents = null, array $context = []): array`

Refunds full or partial amount. Fails with an error if the provider does not support refunds.

### `getPaymentStatus(string $provider, string $paymentId, array $context = []): array`

Polls current status from the provider.

### `createSubscription(string $provider, array $params, array $context = []): array`

Starts a subscription when `features.subscriptions` is true. Params are provider-specific (e.g. Stripe: `customer_id`, `price_id`).

### `cancelSubscription(string $provider, string $subscriptionId, array $context = []): array`

Cancels an active subscription.

### `testConnection(string $provider, array $credentials): array`

Used by admin UI; consumer plugins normally do not call this.

## Result shape

Methods return associative arrays:

```php
// Success
['ok' => true, 'provider' => 'stripe', 'payment_id' => 'pi_…', 'status' => 'pending', …]

// Failure
['ok' => false, 'error' => 'Provider not configured: stripe']
```

Always check `$result['ok']`. Do not assume HTTP was used in your request path — the shelf calls provider adapters internally.

## Activity log and metadata

Every shelf mutation appends to the Payments activity log with:

- `type` — payment, capture, refund, subscription, webhook
- `provider`, `status`, `payment_id`, `amount_cents`, `currency`
- `source_plugin`, `source_ref` from `$context`
- `message` — human-readable summary

Secrets in metadata are redacted in stored log entries. Pass business references in `source_ref`, not API keys.

## Automation events

Payments registers automation **triggers** (when Automation is enabled):

| Trigger ID | When |
|------------|------|
| `payment_succeeded` | Webhook or provider outcome maps to success |
| `payment_failed` | Payment failed or was rejected |

Each trigger supports an optional **provider** filter in workflow config.

**Event context** broadcast to automation (via webhooks):

| Field | Description |
|-------|-------------|
| `payment_id` | Provider payment reference |
| `provider` | Provider ID |
| `status` | Provider status string |
| `amount_cents` | Amount when known |
| `currency` | Currency when known |

Hook workflows to these triggers instead of parsing raw provider webhooks in consumer plugins.

## Capabilities

| Capability | Who | Purpose |
|------------|-----|---------|
| `access_payment_shelf` | Consumer plugins | Required to obtain `payment_shelf` via service registry |
| `manage_payments` | Admin roles | Connections and settings (not for shelf consumers) |
| `view_payment_activity` | Admin roles | Activity log |
| `view_payment_stats` | Admin roles | Dashboard aggregates |

In `plugin.json`, declare that your plugin may request shelf access:

```json
{
  "requires_capabilities": [],
  "permissions": []
}
```

An administrator grants `access_payment_shelf` to your plugin in **Settings → Plugins** (capability grant UI). Without it, the registry withholds the service.

## Example: minimal consumer bootstrap

```php
// plugin.php
require_once __DIR__ . '/includes/checkout.php';

function my_plugin_charge(int $amountCents, string $currency, string $orderRef): array
{
    $shelf = get_plugin_service('payment_shelf', false, 'my_plugin');
    if (!$shelf || !$shelf->isConfigured()) {
        return ['ok' => false, 'error' => 'Payments not available'];
    }

    return $shelf->createPayment('auto', [
        'amount_cents' => $amountCents,
        'currency' => $currency,
        'description' => 'Order ' . $orderRef,
    ], [
        'source_plugin' => 'my_plugin',
        'source_ref' => $orderRef,
    ]);
}
```

## Design rules

1. **Shelf only** — No direct provider HTTP from consumer plugins.
2. **Check configured** — Handle disabled Payments and empty connections.
3. **Trace with context** — Always pass `source_plugin` and `source_ref`.
4. **Respect capabilities** — Refunds and subscriptions may be unsupported; check `getProviderCapabilities()` or handle `ok === false`.
5. **No checkout in Payments** — Your plugin owns UX, order state, and post-payment fulfilment.

## Related

- [Payments plugin (admin guide)](payments-plugin.md)
- [Shopping Cart plugin](shopping-cart-plugin.md) — reference consumer (orders + checkout)
- [Events plugin](events-plugin.md) — reference consumer (RSVP + paid tickets)
- [Plugins](plugins.md)
- [Automation overview](../05-automation/automation-overview.md)
- [Automation triggers](../05-automation/triggers.md)
