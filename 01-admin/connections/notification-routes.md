# Notification routes

## Summary

**Notification routes** map platform events (order paid, form submission, password reset, health alert, …) to one or more **channels**: email (via an email alias), Slack, Discord, or SMS (Twilio). Configure channels and routes under **Settings → Connections → Notification channels**. Plugins call `birkly_notify($event, $payload)`; admins own the final routing map. This is fan-out for operational messages — not a marketing campaign builder.

## Beginner

### What a route is

A **route** answers: “When *this* happens, tell *these* places.”

Example: when `commerce.order_paid` fires → email the shop owner **and** post to a Slack channel.

### Add a Slack channel

1. In Slack, create an **Incoming Webhook** for the channel you want.
2. In Birkly: **Settings → Connections → Notification channels → Add channel**.
3. Choose **Slack**, paste the webhook URL, name it (e.g. `Ops Slack`), save.
4. Use **Test channel** if offered — you should see a test message in Slack.

### Add Discord

1. In Discord: channel → Integrations → Webhooks → New Webhook → copy URL.
2. **Add channel** → **Discord** → paste URL → save → test.

### Add SMS (Twilio)

1. In Twilio, note **Account SID**, **Auth Token**, and a **From** number (or Messaging Service).
2. **Add channel** → **SMS (Twilio)** → enter SID, token, From number → save.
3. Test with a phone number you control (E.164 format, e.g. `+15551234567`).

### Create a notification route

1. Under **Notification routes**, click **Add route**.
2. Choose an **event** (built-in list or a plugin event key).
3. Add one or more **channels** (email alias, Slack connection, Discord, SMS).
4. For email channels, set the recipient and optionally the alias (`transactional_email` / `ops_alerts`).
5. Save. Keep the route **active**.

### Built-in events (common)

| Event | Typical use |
|-------|-------------|
| `commerce.order_paid` | New paid order |
| `commerce.order_shipped` | Shipment notice to ops |
| `form.submission` | Contact / public form |
| `user.password_reset` | Reset flow ops copy (customer mail still uses templates) |
| `user.email_verify` | Verify flow |
| `system.health_alert` | Degraded / error health |
| `team.invitation` | Admin invite |

Plugins may register additional keys like `my_plugin.event_name`.

### Tips

- Email delivery still needs a healthy [Email setup](email-setup.md) — routes that include email use `birkly_send_mail` under the hood.
- Automation workflows can still call Slack/email actions directly; Connections is the shared vault for credentials and fan-out.
- Start with one event → one Slack channel, then add email CC for ops.

## Advanced Users

### API

```php
require_once __DIR__ . '/../core/connections.php';

$result = birkly_notify('commerce.order_paid', [
    'to' => 'ops@example.com',
    'subject' => 'Order paid',
    'html' => '<p>Order #123 paid.</p>',
    'text' => 'Order #123 paid.',
], [
    'mode' => 'sync', // or 'queue'
    'idempotency_key' => 'notify_order_123_paid',
    // Optional ad-hoc channels when no admin route exists:
    // 'channels' => [
    //   ['type' => 'email', 'to' => 'ops@example.com', 'alias' => 'ops_alerts'],
    //   ['type' => 'slack', 'connection_id' => 'conn_slack_ops'],
    // ],
]);
```

### Route storage

`settings/connections/notification_routes.json`:

```json
{
  "routes": [
    {
      "id": "route_abc123",
      "event": "form.submission",
      "active": true,
      "channels": [
        { "type": "email", "to": "hello@example.com", "alias": "transactional_email" },
        { "type": "slack", "connection_id": "conn_slack_ops" }
      ]
    }
  ]
}
```

Admin REST: `routes_list`, `route_save`, `route_delete`, `events`, `test_channel` on `api/connections.php`.

### Channel connection types

| Channel `type` | Connection type | Secret / config |
|----------------|-----------------|-----------------|
| `email` | Email alias | Uses `birkly_send_mail` |
| `slack` | `slack` | `webhook_url` (incoming webhook) |
| `discord` | `discord` | Webhook URL |
| `sms` / Twilio | `twilio_sms` | `account_sid`, `auth_token`, `from_number` |

### Twilio env overrides

| Variable | Field |
|----------|-------|
| `BIRKLY_TWILIO_ACCOUNT_SID` | Account SID |
| `BIRKLY_TWILIO_AUTH_TOKEN` | Auth token |
| `BIRKLY_TWILIO_FROM` | From number |

### Dispatch semantics

- No matching active route → `ok: true` with empty results and a warning (not a hard error).
- Email channel without `to` fails that channel only; other channels still run.
- `mode => 'queue'` enqueues a notify job in the Connections file queue.

### Relation to Automation

Automation **Send email** / Slack actions remain valid. Prefer Connections for shared secrets and multi-channel fan-out so deactivating Automation does not remove the only Slack webhook store. Chat Setup notes should deep-link to **Settings → Connections**.

## Related

- [Connections overview](connections-overview.md)
- [Email setup](email-setup.md)
- [Automation overview](../../05-automation/automation-overview.md)
- [Monitoring and health alerts](../../07-operations/monitoring-alerts.md)
