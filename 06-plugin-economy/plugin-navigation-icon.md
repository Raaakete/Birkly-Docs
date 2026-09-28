# Plugin navigation icon

How to set the sidebar icon for a plugin via `plugin.json` → `navigation.icon` (or `sidebar.icon` in the admin shelf metadata).

## Summary

A plugin that adds an admin sidebar item declares `navigation` in `plugin.json`, and its **`icon`** field sets the glyph beside the plugin name. Use a **registry name** from the Birch icon set, such as `"card"`, `"calendar"`, `"users"`, `"zap"` or `"template"`. The admin draws it as a 13 px pixel icon that plays its hover gesture, exactly like Dashboard, Content and Settings. A plugin's own inline SVG still works as a fallback: it is sized to the same 13 px box, but it has no gesture.

## Beginner

When your plugin appears in the admin sidebar, a small icon sits beside its label. You choose that icon in `plugin.json`:

```json
{
  "name": "My Plugin",
  "navigation": {
    "name": "My Plugin",
    "page": "my-plugin",
    "icon": "calendar"
  }
}
```

**Registry name (recommended).** Pick a name from the icon set in [Admin design language § Icons](../01-admin/admin-design-language.md#6-icons). The sidebar draws it in the same pixel style as core items, and it moves when the row is hovered or focused: a calendar hops, a bell rings, a truck bounces.

**Custom inline SVG (fallback).** If nothing fits, set `icon` to a full `<svg>…</svg>` string using `currentColor`. It is shown at 13 × 13 px. For a crisp result, draw it on a 13 × 13 `viewBox` in whole cells with `shape-rendering="crispEdges"`.

**If you omit `icon`,** or give a name that doesn't exist, the sidebar shows the default plugin icon (`sliders`).

## Advanced Users

### `navigation` block

| Field | Purpose |
|-------|---------|
| `name` | Sidebar label |
| `page` | Admin page slug (matches your registered admin route) |
| `icon` | Registry name **or** inline SVG string |

Plugins that register through the admin shelf (`register_plugin_admin_meta()`) set the same value as `sidebar.icon`; the shelf entry wins over `plugin.json`:

```php
register_plugin_admin_meta('my-plugin', [
    'title' => '@i18n:plugins.my_plugin.title',
    'root_page' => 'my-plugin',
    'sidebar' => ['show' => true, 'label' => '@i18n:plugins.my_plugin.title', 'order' => 50, 'icon' => 'calendar'],
]);
```

### Rendering

`birkly_nav_icon($icon)` in `core/icons.php` renders the value. It is used by `admin/partials/sidebar.php` and by the `get_navigation` action of `api/plugins.php`.

| Value | Result |
|-------|--------|
| A registry name (`[a-z0-9-]+`) that resolves | `birkly_icon($name, ['class' => 'nav-icon'])`: a 13 px Birch icon with its gesture |
| A string starting with `<svg` | Returned as is. The sidebar sizes it to `var(--icon)` |
| Anything else, or empty | The default plugin icon |

Pre-Birch names (`gear`, `shopping-bag`, `file-text`) still resolve through aliases, but the aliases are going away. Use the Birch name instead (`sliders`, `bag`, `content`); the full table is in [Plugin admin styling § Icon names](plugin-admin-styling.md#icon-names).

**Listing names:** `birkly_icon_names()` in PHP, `Birkly.iconNames` in JS.

### Choosing an icon

| Plugin | Icon |
|--------|------|
| Commerce | `card` |
| Events | `calendar` |
| User | `users` |
| Automation | `zap` |
| Studio | `template` |

Pick the icon that names what the plugin *is*, not a brand mark. Don't reuse an icon that a core item already shows (`dashboard`, `content`, `media`, `sparkle` for Discovery, `bag` for the Hub, `sliders` for Settings, `help`). If no registry icon fits, ship inline SVG for that plugin only. To contribute a reusable icon to core, add its grid to `core/icon_data.php` and run `php scripts/build-icons.php`.

Icons inherit `currentColor` from the sidebar row, so check them in light and dark.

## Related

- [Plugin development](plugin-development.md)
- [Plugin admin styling](plugin-admin-styling.md)
- [Admin design system](../01-admin/design-system.md)
- [Plugins](../06-extensibility/plugins.md)
