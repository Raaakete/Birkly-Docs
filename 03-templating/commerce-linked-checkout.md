# Commerce linked checkout (storefront)

Use **linked checkout** when a purchase should create or update a CMS entry before payment — supporters, registrants, members, or any collection row tied to an order.

Requires **Commerce 1.0.97+** and `birkly-client.js` on the page. The client loads the Commerce storefront script when Commerce is active. Put `data-commerce-autobind` on the document element so linked checkout forms bind.

## Summary

| Piece | Role |
|-------|------|
| Commerce product entry | Purchase options (fixed or variable amounts) |
| `catalog_item` API | Storefront SSOT for options and min/max |
| `begin_linked_checkout` | Server creates linked entry + hosted checkout session |
| `data-commerce-linked-checkout` | Form binder — no custom donate/checkout JS |
| `commerce_entry_sync_*` settings | Maps checkout metadata → entry fields after pay/abandon |

## Minimal form

```html
<script src="/birkly-client.js"></script>

<form
  data-commerce-linked-checkout
  data-product-collection="donations"
  data-product-entry="support-birkly"
  data-linked-collection="supporters"
  data-consent-field="featured"
  data-hosted-checkout="1"
  data-success-url="/project/thank-you.html"
  data-cancel-url="/project/sponsors.html?canceled=1#supporters"
  data-onetime-option-id="once"
  data-recurring-option-id="monthly">
  <input name="name" required>
  <input type="email" name="email" required>
  <select id="amount-select">
    <option value="15" selected>€15</option>
    <option value="custom">Custom</option>
  </select>
  <input id="custom-amount" type="number" min="1" step="0.01" data-commerce-custom-amount>
  <input type="checkbox" name="show" value="yes" checked>
  <label>Optional logo (public list)
    <input type="file" name="logo" accept="image/png,image/jpeg,image/webp,image/gif">
  </label>
  <button type="submit">Donate</button>
  <p data-commerce-linked-status hidden role="alert"></p>
</form>
```

## Thank-you / return page

```html
<script src="/birkly-client.js"></script>
```

On cancel, the binder calls `abandon_checkout` so linked entries move to the abandoned payment state.

## Purchase options binder (optional)

For catalog-driven option UI instead of a hand-built amount select:

```html
<div
  data-commerce-purchase-options
  data-product-collection="donations"
  data-product-entry="support-birkly"></div>
```

The binder reads `catalog_item`, renders radios, and validates amounts against `min_price_cents` / `max_price_cents`.

## Product configuration

In the entry editor (Commerce field):

- Set **pricing mode** to **variable** for custom amounts.
- Set **min_price_cents** / **max_price_cents** on each purchase option (e.g. €1 minimum = `100`).
- Re-save the entry or **Rebuild catalog** so `catalog_item` reflects changes.

## Entry sync settings

Commerce → Settings → General → **Entry sync** keys (`commerce_entry_sync_*`):

- Metadata keys written on checkout (entry id, collection, consent)
- CMS fields updated when payment succeeds or is abandoned

See the Commerce plugin RFC: `RFC-STOREFRONT-PLATFORM-V2.md`.

## API sketch

```json
POST /api/commerce.php
{
  "action": "begin_linked_checkout",
  "product": {
    "collection": "donations",
    "entry_id": "support-birkly",
    "purchase_option_id": "once",
    "amount_cents": 1500
  },
  "customer": { "email": "a@b.com", "name": "Ada" },
  "linked_entry": {
    "collection": "supporters",
    "fields": { "title": "Ada", "email": "a@b.com", "featured": "1" },
    "consent_field": "featured"
  },
  "hosted_checkout": true,
  "success_url": "https://example.com/thank-you.html",
  "cancel_url": "https://example.com/donate.html?canceled=1"
}
```

## File uploads (logos, images)

**Commerce 1.0.97+:** `data-commerce-linked-checkout` automatically pre-uploads `<input type="file" name="…">` fields via `upload_linked_checkout_asset` before `begin_linked_checkout`. Returned URLs are merged into `linked_entry.fields` (field name = input `name`, e.g. `logo`).

- Images only (JPEG, PNG, WebP, GIF), max 5MB
- Stored under `/media/linked_checkout/` on the CMS host
- No custom upload JS required when using the storefront binder

Manual upload (integrators):

```
POST /api/index.php?route=commerce
Content-Type: multipart/form-data

action=upload_linked_checkout_asset
field=logo
file=<binary>
```

Response `data.url` is the value to pass in `linked_entry.fields.logo`.

## Known limits

- **Variable recurring** (pay-what-you-want subscriptions) is deferred; fixed recurring tiers work.

## Related

- [Storefront patterns](storefront-patterns.md)
- [Commerce functions](commerce-functions.md)
- [Public forms](public-forms.md) — for non-payment submissions
