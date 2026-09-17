# Admin internationalization (i18n)

How the Birkly admin panel loads translations for core UI and plugins.

## Two systems

| System | Purpose |
|--------|---------|
| **Admin UI i18n** | Panel chrome, settings, plugin admin pages |
| **Content multilang** | Site visitor content (see [Multilingual templating](../03-templating/multilingual-templating.md)) |

Admin language is chosen per user (user menu → language). It does **not** follow browser `Accept-Language` automatically.

## Core strings

- Canonical catalog: `lang/en.json` under the CMS root (`admin.*` keys).
- PHP: `__('admin.save')` with `{{param}}` interpolation.
- HTML templates: `{translate 'admin.settings'}`.
- PHP partials (not plugin HTML): `<?= __('admin.save') ?>` — use `{translate}` in plugin `.html` admin pages.
- JavaScript: `Birkly.i18n.t('admin.save')` (flat full-key dictionary injected in `layout_head.php`).

Admin language is stored on the **user profile** and applied on the next full page load after `api/users.php` `set_language`. There is no separate per-plugin language control.

## Plugin strings

Plugins ship their own catalogs:

```
plugins/my-plugin/lang/en.json
plugins/my-plugin/lang/de.json
```

Declare in `plugin.json`:

```json
"admin": {
  "i18n": { "path": "lang", "namespace": "plugins.my_plugin" }
}
```

Keys use namespace `plugins.{plugin_id}.{key}` (underscores in plugin id).

- HTML: `{translate 'plugins.commerce.tab_orders'}`
- JS: `Birkly.i18n.t('plugins.commerce.tab_orders')`
- Settings labels: `"label": "@i18n:plugins.commerce.settings.default_currency.label"`

Core merges active plugin catalogs when loading the admin language. Inactive plugins contribute nothing.

## Tier-1 locales (P85)

**French (`fr`)** and **Spanish (`es`)** are tier-1 admin locales: full `admin.*` parity with `lang/en.json`, plus Wave 1 official plugins (User, Commerce, Automation, Events, Studio).

Spanish catalogs are rebuilt **from English only** (no machine translation, no French fallback). After adding or changing `lang/en.json` keys:

```bash
./scripts/p85-es-full-pass.sh
php scripts/i18n-audit.php --locale=es --strict
php scripts/i18n-audit-es-quality.php
```

`i18n-audit-es-quality.php` flags FR→ES heuristic leaks (same-as-`fr.json`, mixed EN/ES, French phrases). CI runs it warn-only for core and sibling plugin repos.

Do **not** use `scripts/p85-es-fr-to-es.php` (deprecated).

## Tooling

```bash
php scripts/i18n-audit.php --locale=de --strict
php scripts/i18n-sync-locale.php de
```

- **`--strict`**: fail on missing keys vs `en.json`.
- **`--check-untranslated`**: also fail when locale values are identical to English.

## Related

- [Plugin development](plugin-development.md)
- P85 plan (internal): Birkly-Marketplace `internal/planning/reviews/P85-admin-i18n-platform-plan.md`
