# Dates and Formatting

Birkly templates let you output date (and optionally time) fields in a chosen format—e.g. “January 5, 2025” or “2025-01-05”—using format strings.

## Summary

To **format a date** in a template, use the date field with a format string: e.g. `{ date "F j, Y" }` for “January 5, 2025” or `{ published_date "Y-m-d" }` for “2025-01-05”. The format uses placeholders: **F** = full month name, **j** = day without leading zero, **Y** = 4-digit year, **m** = month number, **d** = day with leading zero. The same idea applies to DateTime fields for time (e.g. **H** hour, **i** minute). Check your Birkly version for the exact syntax (e.g. `{ date_field "format" }`).

## Beginner

Dates in the CMS are stored in a standard way (e.g. 2025-01-05). On the website you often want them to look different: “January 5, 2025” or “5 Jan 2025” or “05.01.2025”. You control this with a **format string** in the template.

**Basic syntax**

- Write the date field name, then a space and a format string in quotes: `{ date "F j, Y" }`.
- Replace `date` with your field key if it’s different (e.g. `published_date`, `event_date`).
- **Inside a loop**, `{ date "F j, Y" }` uses the **current entry’s** date.

**Common formats (examples)**

| What you want | Format string | Example output |
|---------------|---------------|----------------|
| Full date, readable | `F j, Y` | January 5, 2025 |
| Short month | `M j, Y` | Jan 5, 2025 |
| Numbers only (ISO-style) | `Y-m-d` | 2025-01-05 |
| European style | `d.m.Y` | 05.01.2025 |
| With weekday | `l, F j, Y` | Sunday, January 5, 2025 |

**Example: blog post date**

```html
<time datetime="{ date "Y-m-d" }">{ date "F j, Y" }</time>
```

- `datetime="2025-01-05"` is good for accessibility and SEO (machine-readable).
- The visible text can be “January 5, 2025”.

**Example: event with time**

If the field is a DateTime (date + time), you can include time placeholders:

```html
<span>{ event_date "F j, Y \a\t g:i A" }</span>
```

That might output “January 5, 2025 at 2:30 PM”. Exact support depends on your engine; see Advanced for placeholders.

**What the letters mean (quick reference)**

- **Y** — 4-digit year (2025)
- **F** — Full month name (January)
- **M** — Short month (Jan)
- **j** — Day of month, no leading zero (5)
- **d** — Day of month, with leading zero (05)
- **l** — Full weekday name (Sunday) — if supported
- **H** / **i** / **s** — Hour (24h), minute, second — for time
- **g** / **i** / **A** — Hour (12h), minute, AM/PM — if supported

Your engine may follow PHP-style date format; see the table in Advanced for a fuller list.

## Advanced Users

**Syntax**

- **Pattern:** `{ date_field_name "format_string" }`. The format string is usually PHP-style (`date()` / `strftime()`-like tokens).
- **DateTime fields:** Same pattern; add time tokens (H, i, s, g, A, etc.) to include time in the output.

**Common format characters (PHP-style)**

| Character | Meaning | Example |
|-----------|----------|--------|
| Y | 4-digit year | 2025 |
| y | 2-digit year | 25 |
| F | Full month name | January |
| M | Short month name | Jan |
| m | Month number, leading zero | 01 |
| n | Month number, no leading zero | 1 |
| d | Day of month, leading zero | 05 |
| j | Day of month, no leading zero | 5 |
| l | Full weekday name | Sunday |
| D | Short weekday name | Sun |
| H | Hour 24h, leading zero | 14 |
| i | Minutes | 30 |
| s | Seconds | 00 |
| g | Hour 12h, no leading zero | 2 |
| A | AM/PM | PM |

**Examples**

| Format | Output |
|--------|--------|
| `F j, Y` | January 5, 2025 |
| `M j, Y` | Jan 5, 2025 |
| `Y-m-d` | 2025-01-05 (ISO date) |
| `d.m.Y` | 05.01.2025 |
| `m/d/Y` | 01/05/2025 |
| `l, F j, Y` | Sunday, January 5, 2025 |
| `H:i` | 14:30 |
| `g:i A` | 2:30 PM |
| `F j, Y \a\t g:i A` | January 5, 2025 at 2:30 PM |

**Escaping literal text**

In some engines, characters that are not format tokens must be escaped (e.g. `\a\t` for “at”). Check the engine docs.

**Time zones**

Stored dates may be in UTC or server time. Output is typically in the same; time zone conversion (e.g. to user’s local time) may require client-side JavaScript or server-side time zone handling depending on your setup.

**Relative dates**

“2 days ago” or “next week” are usually not built into the template language. Implement via a custom helper or client-side script if needed.

## Related

- [Variables and output](variables-and-output.md)
- [Templating overview](templating-overview.md)
- [Field types](../02-content/field-types.md)
