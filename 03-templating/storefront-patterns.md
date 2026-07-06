# Storefront and events patterns

Copy-paste page patterns that combine the [Commerce](commerce-functions.md) and [Events](events-functions.md) template functions into full client-site pages. These mirror the reference implementation on the kekaba demo site (`shop.html`, `product.html`, `cart.html`, `events.html`, `event.html`).

## Summary

A storefront is three pages: a **listing** that loops the catalog, a **product detail** that renders a variant / purchase-option picker and a buy button, and a **cart** that reads cart state and links to checkout. Events add a **calendar/list** page and a **single-event** page with `.ics` download and an iCal subscribe link. All pages use standard loops plus the plugin template functions — no custom endpoints required.

## Beginner

**Shop listing**

```html
{for each product in 'kekaba_products'}
  <a class="box hover" href="product.html?slug={product.slug}">
    <img src="{product.image}" alt="{product.title}">
    <h2>{product.title}</h2>
    <p>From {commerce_price_from product.pricing}</p>
  </a>
{endfor}
```

**Product detail with a variant picker**

```html
<h1>{title}</h1>
{content}

{for each variant in sub_entries variants}
  <label class="variant">
    <input type="radio" name="variant" value="{variant.id}">
    {variant.title} — {commerce_price_from variant.pricing}
  </label>
{endfor}

<a class="button" href="{commerce_buy_url variant.id kekaba_products 1}">Add to cart</a>
```

Simple products (no variants) put the Commerce field on the parent and link `{commerce_buy_url slug kekaba_products 1}` directly.

**Cart badge in the header**

```html
<a href="cart.html">Cart ({commerce_cart_count})</a>
```

**Events calendar / list**

```html
{for each event in upcoming_events 20}
  <a class="events-card" href="event.html?slug={event.slug}">
    <span class="date">{event.start}</span>
    <h3>{event.title}</h3>
  </a>
{endfor}

<a class="button" href="{events_calendar_feed_url}">Subscribe (iCal)</a>
```

**Single event with calendar export**

```html
<h1>{title}</h1>
<p>{schedule.starts_at} – {schedule.ends_at} · {schedule.venue}</p>
{content}

<a href="{event_ics_url kekaba_events id 0}">Add this date (.ics)</a>
```

## Advanced Users

**Fulfillment types on one catalog.** A single products collection can mix `ship` (physical), `deliver` (digital download), `register` (workshop seat), and `none` (subscription / access grant). The CTA and post-purchase flow follow the entry's `fulfillment`; the template only needs the buy URL. See the [Commerce fieldtype](../06-extensibility/commerce-fieldtype.md).

**Multiple purchase options.** Subscriptions expose several `purchase_options` (e.g. monthly + annual). Render one control per option and pass its id as the fourth `commerce_buy_url` argument:

```html
{for each option in pricing.purchase_options}
  <a href="{commerce_buy_url id kekaba_products 1 option.id}">
    {option.label} — {option.price_cents}
  </a>
{endfor}
```

**Recurring events.** A `recurrence` block expands one entry into occurrences in `events_index.json`. List each date with its `series_index` and offer a per-occurrence `.ics` plus a whole-series subscribe:

```html
{for each occ in occurrences}
  <li>
    {occ.starts_at}
    <a href="{event_ics_url kekaba_events id occ.series_index}">Add to calendar</a>
  </li>
{endfor}
```

**Hydrate vs bake.** Client sites can render these patterns server-side (baked HTML) or hydrate them in the browser with `birkly-client.js`. The kekaba demo bakes the page shell and hydrates catalog/event data from JSON, then links buy/cart/checkout and `.ics`/webcal URLs to the live plugin endpoints — so the same markup works offline as a static demo and online against a running CMS.

## Related

- [Commerce functions](commerce-functions.md)
- [Events functions](events-functions.md)
- [Loops and lists](loops-and-lists.md)
- [Conditionals](conditionals.md)
