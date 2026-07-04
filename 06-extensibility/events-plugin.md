# Events plugin

The **Events** plugin (`plugins/events/`) manages events in the `events` collection, supports **free RSVP without Payments**, and **paid tickets** via `payment_shelf`.

## Prerequisites

| Flow | Requires |
|------|----------|
| Free RSVP | Events plugin only |
| Paid tickets | Payments active + `access_payment_shelf` on Events (auto-granted on activation) |

On activation, the plugin seeds the `events` collection with a demo event if missing.

## Admin

Open **Events** in the admin sidebar.

- **Manage Events** — edit collection entries (start/end, venue, capacity, ticket types JSON).
- **Registrations** — filter by event, export CSV.
- Ticket types are JSON in the `ticket_types` field, e.g.:

```json
[
  {"id":"free","name":"Free RSVP","price":0,"currency":"usd","capacity":0},
  {"id":"vip","name":"VIP","price":49.99,"currency":"usd","capacity":10}
]
```

`capacity: 0` on the event or ticket type means unlimited (ticket type falls back to event capacity when set).

## Registration flows

### Free RSVP

`POST /api/index.php?route=events&action=rsvp` with `event_id`, `name`, `email`. No Payments required. Capacity enforced before save.

### Paid ticket

`POST ...&action=paid_register` with `event_id`, `ticket_type`, `name`, `email`. Creates a pending registration and calls `payment_shelf->createPayment()` with `source_plugin=events`, `source_ref=registration_id`. Webhook → registration **paid**.

## Public API

| Action | Auth | Description |
|--------|------|-------------|
| `list_events` | Public | Published events + remaining capacity |
| `rsvp` | Public | Free registration |
| `paid_register` | Public | Paid ticket checkout |
| `list_registrations` | Admin | Registrations list |
| `export_registrations` | Admin | CSV download |

## Template functions

| Function | Returns |
|----------|---------|
| `{upcoming_events 5}` | Array of upcoming events |
| `{event_register_url event_id}` | Free RSVP API URL |
| `{event_ticket_checkout_url event_id ticket_type}` | Paid registration URL |

## Automation triggers

- `event_rsvp` — free registration confirmed
- `event_registration_paid` — paid registration confirmed
- `event_full` — event capacity reached

## Related

- [Payment shelf API](payment-shelf-api.md)
- [Shopping Cart plugin](shopping-cart-plugin.md)
