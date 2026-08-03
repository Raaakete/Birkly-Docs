# Admin design system

## Summary

The Birkly admin is styled by one internal CSS framework: design tokens in `admin/css/core/variables.css`, a `u-*` helper layer in `admin/css/core/helpers.css`, and a component catalog in `admin/css/components/`. Admin pages are composed from those three and ship no page-specific CSS. **[Admin design language](admin-design-language.md) is the full build kit** — every token, every helper, every component with copy-paste markup, and the page skeleton. This page is the short orientation plus the entry points for icons and theming.

## Beginner

### The look, in four sentences

Content sits in white panels on a warm off-white background. Panels have a thin grey outline instead of a drop shadow. Exactly one mint-green button per screen marks the main action; everything else is neutral. Text is 14px, rows are compact, and animation is short and small.

### Where the page title comes from

Admin pages don't have their own heading. Each page emits a breadcrumb trail, and the last segment of that trail *is* the page title — the admin lifts it into the top bar. So you see "Settings › Roles" once, at the top of the window.

### Light and dark

The theme switcher lives in the top bar (sun / moon / monitor) and the choice is remembered in your browser. Everything in the admin picks up the right colours automatically, because components refer to colours by role — "surface", "text", "border" — rather than by value.

### Building something

If you're writing an admin page or a plugin screen, read the build kit rather than this page:

- **[Admin design language](admin-design-language.md)** — tokens, helpers, components, page recipe
- **[Plugin admin styling](../06-plugin-economy/plugin-admin-styling.md)** — the three adoption tiers, the guaranteed class contract, and a complete worked plugin page

## Advanced Users

### Source of truth

| Layer | File |
|-------|------|
| Tokens | `admin/css/core/variables.css` — the only file allowed to contain a hex literal |
| Legacy token aliases | `admin/css/core/compat-tokens.css` — for plugin CSS only; core admin CSS may not use these names |
| Base | `admin/css/core/reset.css`, `core/typography.css` |
| Components | `admin/css/components/*.css` |
| Layout and page chrome | `admin/css/layout/*.css` |
| Fieldtype CSS API | `admin/css/plugins/fieldtype-api.css` |
| Helpers | `admin/css/core/helpers.css` — imported **last**, so helpers win on source order |
| Import hub | `admin/css/style.css` |

Full reference — surfaces, text, borders, accent, semantic families, spacing, type scale, radius, elevation, z-index, motion, focus, control sizes, measure, breakpoints, the complete `u-*` list and the component catalog — is in [Admin design language](admin-design-language.md). Don't duplicate values here; that page tracks the CSS.

### Three things that catch people out

**1. Mint is a fill, not a text colour.** `--accent` (`#7CE3BF`) measures 1.54:1 on white. Use `--accent-text` for accent text and links, `--ink-on-accent` for text on a mint fill. `--primary-700` (2.95:1) must never be used as a text colour — it survives only as a legacy alias.

**2. Pages don't render an `<h1>`.** The breadcrumb's `.current` segment is the page title and is hoisted into the topbar by `moveBreadcrumbsToTopbar()`. Section titles are `<h2>` in `.card-header` or `.section-header`.

**3. Dark mode is a token remap.** If a component needs a `[data-theme="dark"]` rule, a colour is hardcoded somewhere — fix that instead. CI rejects `data-theme` selectors in admin CSS outside the token file and one documented exception (the topbar shadow cast).

### Icons

Stroke-based, 24×24 viewBox, `stroke="currentColor"`, from a shared registry with PHP and JS parity.

**PHP** — `core/icons.php`:

```php
<?= birkly_icon('pencil-simple', ['size' => 16, 'class' => 'nav-icon']) ?>
```

Options: `size`, `class`, `title`, `aria_hidden`. Output carries the class `.birkly-icon`.

**JavaScript** — `admin/js/icon.js`:

```javascript
Birkly.icon('plus', { size: 16 });
Birkly.iconImg('gear', { size: 16, alt: '' }); // loads admin/assets/icons/gear.svg
Birkly.initIcons(document);                    // hydrates [data-icon="name"]
```

Registry keys are identical in PHP and JS. SVG assets live in `admin/assets/icons/{name}.svg`. Size modifiers: `.birkly-icon--sm` 14px · `--md` 16px · `--lg` 20px · `--xl` 24px. Icons inside `.btn`, `.badge`, `.tab` and `.dropdown-item-icon` are sized by those components already.

Plugin sidebar icons: see [Plugin navigation icon](../06-plugin-economy/plugin-navigation-icon.md).

### Theming

`admin/js/theme.js` (`Birkly.Theme`) sets `data-theme` on `<html>` and `<body>`. Values: `light`, `dark`, `system`.

`core/variables.css` defines the dark palette once as `--dk-*` properties, then remaps the semantic tokens under `[data-theme="dark"]` and under `[data-theme="system"]` inside `@media (prefers-color-scheme: dark)`, and sets `color-scheme: dark` so native controls follow.

User-facing behaviour: [Admin appearance](admin-appearance.md).

### Contributing to admin CSS

- No raw hex outside `core/variables.css`.
- No retired token names (`--spacing-*`, `--border-radius-*`, `--gray-*`, `--shadow-sm/md/lg/xl`, `--font-size-*`, `--primary-N`, `--bg-*`, `--border-light/medium/color`, `--transition-*`) — most survive as aliases in `core/compat-tokens.css` for plugin compatibility only; `--spacing-*` and `--border-radius-*` are not aliased at all.
- No raw `z-index` literal; use `--z-*`.
- Media queries use one of five breakpoint values (640 / 768 / 1024 / 1280 / 1440), `min-width` preferred.
- No `transition: all`, no hover scale, no shadow on a static panel.
- No `!important`; the only allowlisted use is the global `prefers-reduced-motion` block.
- New pages ship no page CSS. If you think you need some, it's a framework gap worth filing.

The do/don't table with the reasoning behind each rule is in [Admin design language](admin-design-language.md).

## Related

- [Admin design language](admin-design-language.md) — the full build kit
- [Plugin admin styling](../06-plugin-economy/plugin-admin-styling.md) — adoption tiers and the public class contract
- [Admin appearance](admin-appearance.md) — theme switcher and responsive layout
- [Admin chrome and action zones](admin-chrome-action-zones.md)
- [Plugin navigation icon](../06-plugin-economy/plugin-navigation-icon.md)
- [Plugin development](../06-plugin-economy/plugin-development.md)
