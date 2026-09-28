# Admin design system

## Summary

The Birkly admin is drawn in **Birch**. Tokens live in `admin/css/core/variables.css`, the eight surface roles in `admin/css/birch/roles.json`, the component kit in `admin/css/birch/kit.css`, and icon gestures and micro-interactions in `admin/css/birch/motion.css`. Pages compose those pieces and ship no CSS of their own. **[Admin design language](admin-design-language.md) is the full reference**, covering roles, tokens, density, components, shell, icons, motion and the CI rules. This page is the short orientation.

## Beginner

### The look, in five sentences

The page is warm grey. Each thing on it sits in a white block with no outline, and groups of blocks sit inside a thin titled frame. One mint button per view marks the main action; blue means on, selected or focus; the text colour marks where you are. Status colours appear only in small badges and message blocks. Icons are small pixel drawings that play a short stepped gesture when you hover them.

### Where the page title comes from

Admin pages have no heading of their own. Each page emits a breadcrumb trail, and the last segment *is* the page title. The admin moves it into the top bar, so you see "Settings › Roles" once, at the top of the window.

### Light, dark and density

The theme switcher (light, dark or auto) is in the top bar, or in the drawer on a phone, and your choice is remembered. **Account → Display** sets the density to Compact, Comfortable (the default) or Large. Text, rows and controls resize with it; icons stay 13 px.

### Building something

- **[Admin design language](admin-design-language.md)**: the four questions, the eight roles, every token and component with markup, icons and motion
- **[Plugin admin styling](../06-plugin-economy/plugin-admin-styling.md)**: Birch for plugin pages, fieldtypes, and the P56-to-Birch rename tables

## Advanced Users

### Source of truth

| Layer | File |
|-------|------|
| Tokens (the only file with colour literals) | `admin/css/core/variables.css` |
| Density | `admin/css/core/density.css` |
| Reset, focus, the one reduced-motion block | `admin/css/core/reset.css` |
| Roles → generated CSS | `admin/css/birch/roles.json` → `roles.generated.css` |
| Component kit | `admin/css/birch/kit.css` |
| Icon gestures, micro-interactions | `admin/css/birch/motion.css` |
| Icons | `core/icon_data.php` → `core/icons.php`, `admin/js/icon.js`, `admin/assets/icons/` |
| P56 names (temporary, for plugin CSS) | `admin/css/core/migration-aliases.css`, `admin/css/core/compat-tokens.css` |
| Layout helpers | `admin/css/core/helpers.css` |
| Import hub | `admin/css/style.css` (kit, then motion, load last) |

### Three things that catch people out

1. **Mint and blue are fills, not text.** Mint (`--mint`) is the one main action and takes `--on-mint` text. Blue (`--accent`) means on, selected and focus, and blue text is `--accent-text`. In P56 `--accent` was mint; plugin CSS that painted mint with it now paints blue.
2. **Slabs have no border.** Blocks are separated by gaps: 4 px when stacked, 8 px in a grid, 24 px between frames. Selection is a 2 px accent ring, and only floats and menus cast shadows.
3. **Dark mode is a token remap.** If a component seems to need a `[data-theme="dark"]` rule, a colour is hard-coded somewhere. CI rejects component dark rules.

### Icons

There are 102 pixel icons on a 13 × 13 grid, at 13 px (`--icon`) or 26 px (`--icon-l`) only, plus smooth-stroke wayfinding chevrons and arrows. Each icon names a hover gesture.

```php
<?= birkly_icon('trash') ?>
<?= birkly_icon('inbox', ['size' => 26]) ?>
<?= birkly_icon('grip', ['gesture' => false]) ?>
```

```javascript
Birkly.icon('trash');
Birkly.initIcons(document);  // hydrates [data-icon="name"]
Birkly.iconPlay(el);         // plays the gestures inside el once
```

The list, the grid alphabet and the gestures are in [Admin design language § Icons](admin-design-language.md#6-icons). Plugin sidebar icons are covered in [Plugin navigation icon](../06-plugin-economy/plugin-navigation-icon.md).

### Theming

`admin/js/theme.js` (`Birkly.Theme`) sets `data-theme` on `<html>` and `<body>` to `light`, `dark` or `system`. `core/variables.css` remaps the tokens under `[data-theme="dark"]`, and under `[data-theme="system"]` inside `@media (prefers-color-scheme: dark)`, and sets `color-scheme: dark` so native controls follow. User-facing behaviour: [Admin appearance](admin-appearance.md).

### Contributing to admin CSS

- Colours, durations, z-index and sizes come from tokens. No literals.
- Every block takes a role; a named component gets its surface from `roles.json`, not from its own rule.
- Everything is sentence case and whole pixels.
- There is one mint button per view.
- Icons come from `birkly_icon()` and are sized only by `--icon` / `--icon-l`.
- Motion uses the duration tokens: no `transition: all`, no scale, no component reduced-motion block.
- New pages ship no page CSS. If one seems necessary, that is a kit gap worth filing.

`internal/cms/scripts/design-language-check.sh` (Birkly-Ops) enforces these rules. The list is in [Admin design language § CI rules](admin-design-language.md#11-ci-rules).

## Related

- [Admin design language](admin-design-language.md): the full reference
- [Plugin admin styling](../06-plugin-economy/plugin-admin-styling.md): plugin pages, fieldtypes, rename tables
- [Admin appearance](admin-appearance.md): theme switcher and responsive layout
- [Admin chrome and action zones](admin-chrome-action-zones.md)
- [Plugin navigation icon](../06-plugin-economy/plugin-navigation-icon.md)
- [Plugin development](../06-plugin-economy/plugin-development.md)
