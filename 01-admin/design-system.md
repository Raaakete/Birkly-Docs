# Admin design system

Design tokens, icons, dark mode, and shared component classes for the Birkly admin UI (Phase 41).

## Summary

The Birkly admin uses a **mint** primary palette and a **neutral** gray-green scale defined in `admin/css/core/variables.css`. Icons are stroke-based (24px viewBox) via `birkly_icon()` in PHP and `Birkly.icon()` in JavaScript, backed by `core/icons.php` and `admin/assets/icons/`. Theme is controlled with `data-theme` on the document root (`light`, `dark`, or `system`). Reusable layout classes include **`.card`**, **`.empty-state`**, and **`.status-badge`** — use these in admin templates and plugin pages for visual consistency.

## Beginner

### Colors you will see

- **Mint green** — Primary actions, active nav highlights, and focus accents (`#7CE3BF` in light mode).
- **Neutral backgrounds** — Soft off-white panels and borders that stay readable in both themes.
- **Semantic colors** — Green for success/published, amber for warnings/drafts, red for errors.

### Icons

Admin icons are simple line drawings. In PHP templates you will see `<?= birkly_icon('gear', ['size' => 16]) ?>`. In JavaScript, `Birkly.icon('gear', { size: 16 })`. Names like `gear`, `plus`, and `trash` come from a fixed registry — you do not need to paste SVG for common actions.

### Dark mode

Users switch theme from the header (sun / moon / monitor). The choice is stored in the browser. Components automatically pick up darker backgrounds and lighter text through CSS variables — you rarely set hex colors directly in new markup.

### Common components

| Class | Use for |
|-------|---------|
| `.card` | Grouped content panels (settings sections, dashboard tiles) |
| `.empty-state` | “Nothing here yet” messages with optional action button |
| `.status-badge` | Entry status pills (draft, published, pending review) |

## Advanced Users

### Source of truth

All design tokens live in:

```
admin/css/core/variables.css
```

Component styles:

| Component | Stylesheet |
|-----------|------------|
| Cards | `admin/css/components/cards.css` |
| Empty states | `admin/css/components/empty-states.css` |
| Status badges | `admin/css/components/status-badges.css` |
| Tables (incl. badges in cells) | `admin/css/components/tables.css` |

### Mint primary tokens

Base brand color and derived scale (light theme defaults):

| Token | Default | Notes |
|-------|---------|-------|
| `--color-primary` | `#7CE3BF` | Primary brand mint |
| `--color-primary-hover` | `#8CECCA` | Hover / dark-theme primary |
| `--color-primary-active` | `#79E1BD` | Pressed state |
| `--primary-50` … `--primary-900` | Mint scale | Tints and shades for backgrounds, borders |
| `--primary-light` | `var(--primary-100)` | Subtle highlight fills |
| `--primary-color` | `var(--primary-500)` | Legacy alias |

Use `var(--color-primary)` in custom admin CSS instead of hard-coded hex so dark mode and future token updates apply automatically.

### Neutral scale

| Token | Default (light) |
|-------|-----------------|
| `--color-neutral-100` | `#F8F9F7` |
| `--color-neutral-200` | `#F4F6F2` |
| `--color-neutral-300` | `#E7EAE4` |
| `--color-neutral-400` | `#D9DBD5` |
| `--color-neutral-500` | `#C4C6C1` |
| `--color-neutral-600` | `#9B9D98` |
| `--color-neutral-700` | `#72746F` |
| `--color-neutral-800` | `#494B46` |
| `--color-neutral-900` | `#20221D` |

Text roles map to neutrals: `--text-primary`, `--text-secondary`, `--text-tertiary`. Backgrounds: `--bg-primary`, `--bg-secondary`, `--bg-elevated`, `--background-global`.

### Icon system

**PHP** — `core/icons.php`:

```php
<?= birkly_icon('pencil-simple', ['size' => 16, 'class' => 'nav-icon']) ?>
```

Options: `size`, `class`, `title`, `aria_hidden`. Output is inline SVG with class `birkly-icon`, 24×24 viewBox, `stroke="currentColor"`.

**JavaScript** — `admin/js/icon.js`:

```javascript
Birkly.icon('plus', { size: 16, class: 'btn-icon' });
Birkly.iconImg('gear', { size: 16, alt: '' }); // loads admin/assets/icons/gear.svg
Birkly.initIcons(document); // hydrates [data-icon="name"]
```

Registry keys are identical in PHP and JS. SVG assets: `admin/assets/icons/{name}.svg`.

Plugin sidebar icons: see [Plugin navigation icon](../06-plugin-economy/plugin-navigation-icon.md).

### Dark mode

**Client:** `admin/js/theme.js` — `Birkly.Theme` sets `data-theme` on `<html>` and `<body>`. Values: `light`, `dark`, `system`.

**CSS:** `[data-theme="dark"]` and `@media (prefers-color-scheme: dark)` on `[data-theme="system"]` remap surface, text, border, and primary tokens in `variables.css`. Dark primary mint shifts to `--dark-color-primary` (`#8CECCA`).

Plugin and custom admin CSS should use semantic variables (`var(--text-primary)`, `var(--border-light)`) — not light-only hex.

See also [Admin appearance](admin-appearance.md) for the user-facing theme switcher.

### Component classes

#### Cards (`.card`)

```html
<div class="card">
  <h3>Section title</h3>
  <p>Body content</p>
</div>

<div class="card card--compact">...</div>
<div class="card card--elevated">...</div>
<div class="card card--bordered">...</div>
```

Split layout: `.card-header` + `.card-body` inside `.card` (padding handled by sub-regions).

#### Empty state (`.empty-state`)

```html
<div class="empty-state">
  <div class="empty-state__icon" data-icon="folder" data-icon-size="24"></div>
  <h3 class="empty-state__title">No items yet</h3>
  <p class="empty-state__message">Create your first item to get started.</p>
  <div class="empty-state__action">
    <a href="..." class="btn btn-primary">Create item</a>
  </div>
</div>
```

Modifiers: `.empty-state--compact`, `.empty-state--loading`, `.empty-state--error`. Template partial: `admin/templates/components/empty-state.html`.

#### Status badge (`.status-badge`)

```html
<span class="status-badge published">Published</span>
<span class="status-badge draft">Draft</span>
<span class="status-badge pending_review">Pending review</span>
```

Status-specific classes: `.published`, `.draft`, `.scheduled`, `.pending_review`, `.approved`, `.rejected`, `.archived`. Template partial: `admin/templates/components/status-badge.html`.

### Spacing, radius, shadows

Also defined in `variables.css`: `--space-*` (rem scale), `--radius-*`, `--shadow-*`, breakpoints `--bp-sm` through `--bp-2xl` (documented for responsive work; use literal values in `@media` queries).

## Related

- [Admin appearance](admin-appearance.md) — theme switcher and responsive layout
- [Admin chrome and action zones](admin-chrome-action-zones.md)
- [Plugin navigation icon](../06-plugin-economy/plugin-navigation-icon.md)
- [Plugin development](../06-plugin-economy/plugin-development.md)
