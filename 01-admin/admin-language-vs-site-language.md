# Admin language vs site language

## Summary

Birkly separates **two languages**:

| Layer | What it controls | Where you set it |
|-------|------------------|------------------|
| **Admin UI language** | Menus, buttons, onboarding, plugin admin shells | **Account** (and onboarding for the first user) |
| **Site default language** | Default for **content** / storefront-facing defaults where configured | **Settings → General** |

Changing **Settings → General** site language does **not** switch the admin interface. Use **Account** to change admin UI language.

## Beginner

1. **First login:** Onboarding asks for **admin UI language** — this saves to your user profile.
2. **Later:** Open **Account** → language → save → reload admin.
3. **Content:** Collections can use **multilanguage** fields separately; that is not the same as admin UI catalogs. See [Multilingual templating](../03-templating/multilingual-templating.md).

## Advanced

- Admin strings: `lang/*.json` in core and plugin `lang/` packs (P85 i18n).
- Site language in General maps to platform/site settings used for content defaults — not `user.language`.

## Related

- [Account](account.md)
- [Settings](settings.md)
- [Getting started](../00-overview/getting-started.md)
