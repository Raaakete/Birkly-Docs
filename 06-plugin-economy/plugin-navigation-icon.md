# Plugin navigation icon

How to set the sidebar icon for a plugin via `plugin.json` → `navigation.icon`.

## Summary

Plugins that add an admin sidebar item declare `navigation` in `plugin.json`. The **`icon`** field controls the glyph shown next to the plugin name. Prefer a **registry name** string (for example `"gear"` or `"shopping-bag"`) that matches the Birkly admin icon set. For one-off artwork, you can instead supply **inline SVG** markup. Icon names are defined in `core/icons.php` (PHP) and mirrored in `admin/js/icon.js` (JavaScript); matching SVG files live under `admin/assets/icons/`.

## Beginner

When your plugin appears in the admin sidebar, visitors see a small icon beside its label. You choose that icon in `plugin.json`:

```json
{
  "name": "My Plugin",
  "navigation": {
    "name": "My Plugin",
    "page": "my-plugin",
    "icon": "gear"
  }
}
```

**Registry name (recommended)** — Use a short name from the built-in set, such as `gear`, `shopping-bag`, `file-text`, or `users`. The admin renders it in the same stroke style as Dashboard, Content, and Settings.

**Custom inline SVG (fallback)** — If you need a unique mark, set `icon` to a full `<svg>...</svg>` string. Keep it **16×16**, use `stroke="currentColor"`, and add `class="nav-icon"` so it aligns with core nav icons.

**If you omit `icon`** — The sidebar falls back to the `gear` registry icon.

## Advanced Users

### `navigation` block

| Field | Purpose |
|-------|---------|
| `name` | Sidebar label |
| `page` | Admin page slug (matches your registered admin route) |
| `icon` | Registry name **or** inline SVG string |

Example with registry name:

```json
"navigation": {
  "name": "Commerce",
  "page": "commerce",
  "icon": "shopping-bag"
}
```

Example with inline SVG fallback:

```json
"navigation": {
  "name": "My Integration",
  "page": "my-integration",
  "icon": "<svg class=\"nav-icon\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"/></svg>"
}
```

### Icon registry sources

| Location | Role |
|----------|------|
| `core/icons.php` | PHP helper `birkly_icon($name, $attrs)` — registry keys and inline SVG paths |
| `admin/js/icon.js` | `Birkly.icon(name, opts)` — same names for admin JavaScript |
| `admin/assets/icons/{name}.svg` | Standalone SVG assets; used by `Birkly.iconImg()` and reference |

Registry names use **kebab-case** (for example `magnifying-glass`, `pencil-simple`, `dots-six-vertical`). Aliases exist where useful (`gauge` / `speedometer`).

**Listing names in PHP:** `array_keys(birkly_icon_paths())`

**Listing names in JS:** `Birkly.iconNames`

### Rendering in admin

- Core nav items call `birkly_icon('gauge', ['class' => 'nav-icon'])` in `admin/partials/sidebar.php`.
- Plugin entries use `navigation.icon` from `plugin.json`. Registry names are resolved through the same helper with `class="nav-icon"` so size and stroke match core items.
- The plugin API (`api/plugins.php`, action `get_navigation`) returns the resolved icon markup for dynamic clients.

### Plugin shelf navigation

Plugins that register via the **admin shelf** API can set `sidebar.icon` in shelf metadata using the same registry names or inline SVG convention. See `core/plugins/admin_shelf.php` → `birkly_plugin_admin_sidebar_navigation()`.

### Choosing an icon

1. Pick a registry name that fits the feature (`shopping-bag` for commerce, `users` for membership, `stack` for automation).
2. If no registry icon fits, add inline SVG only for that plugin — do not fork `core/icons.php` for a single plugin unless you are contributing a reusable icon to core.
3. Test in light and dark themes; icons inherit `currentColor` from the sidebar.

## Related

- [Plugin development](plugin-development.md)
- [Admin design system](../01-admin/design-system.md) — tokens and `birkly_icon` / `Birkly.icon`
- [Plugins](../06-extensibility/plugins.md)
