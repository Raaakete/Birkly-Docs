# Events template functions

Template functions registered by the **Events** plugin when active — upcoming lists, `.ics` links, calendar subscribe, RSVP / ticket checkout.

## Summary

**In short:** Use `{upcoming_events}`, `{event_ics_url}`, `{events_calendar_feed_url}`, `{event_register_url}`, and `{event_ticket_checkout_url}` when Events is installed. List pages can also use normal `{for each entry in 'events' …}` loops. Detail pages resolve one event from the URL — see [Detail pages](detail-pages-and-url-context.md).

> **Media (M4):** Optional events flow video — P3 in media plan.

## Beginner

### Upcoming events helper

```html
{for each event in upcoming_events 10}
  <a href="event.html?collection=events&slug={event.slug}">
    <h3>{event.title}</h3>
    <p>{event.start} · {event.venue}</p>
  </a>
{endfor}
```

Or a standard collection loop:

```html
{for each entry in 'events' with status = published ordered by newest}
  <a href="event.html?collection=events&slug={slug}">{title}</a>
{endfor}
```

### Add one date to a calendar (.ics)

```html
<a href="{event_ics_url events id 0}">Add to calendar</a>
```

Arguments: **collection slug**, entry **id**, **occurrence index** (`0` for single dates).

### Subscribe (iCal)

```html
<a href="{events_calendar_feed_url}">Subscribe (iCal)</a>
```

## Advanced Users

### For developers & AI

| Function | Signature | Returns |
|----------|-----------|---------|
| `upcoming_events` | `limit?` | Upcoming occurrence list |
| `event_ics_url` | `collection`, `entry_id`, `occurrence_index?` | `.ics` URL |
| `events_calendar_feed_url` | none | Whole-calendar feed |
| `event_register_url` | `event_id` | Free RSVP URL |
| `event_ticket_checkout_url` | `event_id`, `ticket_type` | Paid ticket (via Commerce) |

Recurring series expand in `events_index.json`. Pass the correct occurrence / `series_index` for per-date `.ics`.

Page patterns: [Storefront and events patterns](storefront-patterns.md). Extensions model: [Plugin language extensions](plugin-language-extensions.md).

## Related

- [Commerce functions](commerce-functions.md)
- [Storefront and events patterns](storefront-patterns.md)
- [Detail pages & URL context](detail-pages-and-url-context.md)
- [Loops and lists](loops-and-lists.md)
