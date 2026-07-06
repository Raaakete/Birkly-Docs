# Events template functions

Template functions registered by the **Events** plugin when active. Use them in client-site HTML (kekaba, Birkly-Website, etc.) to list events, build registration links, and expose calendar files.

## Summary

Events exposes `{upcoming_events}`, `{event_ics_url}`, `{events_calendar_feed_url}`, `{event_register_url}`, and `{event_ticket_checkout_url}` for calendar/list views, per-event `.ics` downloads, an iCal subscribe feed, and RSVP / paid-ticket links. Recurring entries expand into occurrences via the indexer, so pass an **occurrence index** when linking a single date. Functions register via `register_template_function()` in `plugins/events/plugin.php` and are omitted when Events is inactive.

## Beginner

**List upcoming events**

```html
{for each event in upcoming_events 10}
  <a href="event.html?slug={event.slug}">
    <h3>{event.title}</h3>
    <p>{event.start} · {event.venue}</p>
  </a>
{endfor}
```

**Add a single date to a calendar (.ics)**

```html
<a href="{event_ics_url kekaba_events entry_id 0}">Add to calendar</a>
```

- First argument: **collection slug**
- Second argument: entry **id**
- Third argument: **occurrence index** (0 for single events, 0..N for a recurring series)

**Subscribe to all events (iCal / webcal)**

```html
<a href="{events_calendar_feed_url}">Subscribe (iCal)</a>
```

Swap the scheme to `webcal://` so Apple/Google Calendar subscribe instead of downloading.

## Advanced Users

| Function | Signature | Returns |
|----------|-----------|---------|
| `upcoming_events` | `limit?` | List of upcoming occurrences (id, collection, title, slug, start, end, venue, virtual_url, ics_url) |
| `event_ics_url` | `collection`, `entry_id`, `occurrence_index?` | Per-event/occurrence `.ics` download URL |
| `events_calendar_feed_url` | none | Whole-calendar iCal feed URL (works with `webcal://`) |
| `event_register_url` | `event_id` | Free RSVP endpoint URL |
| `event_ticket_checkout_url` | `event_id`, `ticket_type` | Paid-ticket checkout URL (routes through Commerce) |

**Recurring series:** One entry with a `recurrence` block (frequency, interval, `until` **or** `count`, optional `skip_dates`) expands into occurrences in `events_index.json`. Link each occurrence with its `series_index`; use `events_calendar_feed_url` for the whole series.

**Capacity & tickets:** Free RSVP uses `quantity_available`; paid tickets use a Commerce field with `fulfillment: register`. See the [Commerce fieldtype](../06-extensibility/commerce-fieldtype.md).

**API equivalents:**

- Per-event ICS — `/api/index.php?route=events&action=ics&collection=…&entry_id=…&occurrence=…`
- Subscribe feed — `/api/index.php?route=events&action=webcal`
- RSVP — `/api/index.php?route=events&action=rsvp`

## Related

- [Commerce functions](commerce-functions.md)
- [Storefront and events patterns](storefront-patterns.md)
- [Templating overview](templating-overview.md)
- [Loops and lists](loops-and-lists.md)
