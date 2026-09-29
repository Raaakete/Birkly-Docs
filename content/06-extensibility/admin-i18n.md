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
- PHP: `__('admin.save', ['name' => $name])` with `{name}` interpolation (`{{name}}` still works).
- HTML templates: `{translate 'admin.settings'}`.
- PHP partials (not plugin HTML): `<?= __('admin.save') ?>` — use `{translate}` in plugin `.html` admin pages.
- JavaScript: `Birkly.i18n.t('admin.save', 'Save', { name: name })` (flat full-key dictionary injected in `layout_head.php`). The dictionary includes `admin.*` and every active plugin catalog, so dashboard widgets resolve `plugins.{id}.*` on pages they do not own.

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

## Selectable admin UI languages

The picker lists every `lang/{code}.json` whose `_meta.selectable` is true. English, German, French, Japanese, and Spanish ship that way. A file with `selectable` false, or with no `selectable` field, stays out of the picker.

Add a language from English only:

```bash
php scripts/i18n-new-locale.php nl --name=Dutch --native=Nederlands
```

That writes `lang/nl.json` and does not change PHP, tests, or CI. Translate the copied English values. Set `selectable` to true only after:

```bash
php scripts/i18n-audit.php --selectable --strict-quality
```

Do not scaffold from `de`, `fr`, `es`, or `ja`. Do not run `scripts/p85-es-full-pass.sh` or `scripts/p85-es-fr-to-es.php`. Those rebuilds are deprecated.

## Keeping catalogs in step

After adding or changing keys in `lang/en.json`:

```bash
php scripts/i18n-sync-locale.php --all
php scripts/i18n-audit.php --selectable --strict-quality
```

The audit checks core and, when the sibling repo is on disk, User, Commerce, Automation, Events, and Studio. It fails when a selectable locale is missing a key, a `{placeholder}` set differs from English, a value still contains a translation sentinel, a value is still the English sentence, or a value was copied from another locale.

## Related

- [Plugin development](plugin-development.md)
- P85 plan (internal): Birkly-Marketplace `internal/planning/reviews/P85-admin-i18n-platform-plan.md`
