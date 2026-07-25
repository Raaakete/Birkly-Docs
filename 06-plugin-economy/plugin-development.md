# Plugin development — structure and permissions

Build Birkly plugins as self-contained packages with `plugin.json` metadata, a PHP entry point, and declared permissions. The marketplace and CMS use these declarations for preflight checks and install consent.

## Summary

A Birkly **plugin** lives in `plugins/{folder}/` with at minimum `plugin.json` and `plugin.php`. Declare **permissions**, **hooks**, and **data_access** in `plugin.json` so site owners see an accurate consent screen at install. Register admin pages, API routes, field types, and automation actions from `plugin.php`. Package as a zip for marketplace upload or manual install.

## Beginner

**Minimum package**

```
my-plugin/
  plugin.json    ← name, version, description, permissions
  plugin.php     ← registers hooks, routes, services
  admin/         ← optional admin UI pages
  api/           ← optional API endpoints
```

**plugin.json essentials**

| Field | Purpose |
|-------|---------|
| `name` | Display name in admin |
| `version` | Semver (for example `1.0.0`) |
| `description` | Short summary |
| `requires_birkly` | Minimum CMS version |
| `requires_php` | Minimum PHP version |
| `permissions` | Admin capabilities the plugin needs |
| `hooks` | Event names the plugin listens to |
| `data_access` | Read/write scope for entries, media, users, settings |

**Permissions and data access**

Site owners see your declarations before install. Request only what you need:

- **permissions** — strings like `read_entries`, `manage_plugins`, `manage_settings`.
- **hooks** — event names like `entry.saved`, `user.login`.
- **data_access** — per domain (`entries`, `media`, `users`, `settings`), set level to `none`, `read`, or `read_write`.

Example:

```json
{
  "name": "My Integration",
  "version": "1.0.0",
  "description": "Syncs entries to an external CRM",
  "requires_birkly": ">=0.1.0",
  "requires_php": ">=8.1",
  "permissions": ["read_entries", "manage_settings"],
  "hooks": ["entry.saved"],
  "data_access": {
    "entries": "read",
    "media": "none",
    "users": "none",
    "settings": "read"
  }
}
```

**What plugins can add**

- New **admin pages** and sidebar items
- **API endpoints** under `/api/{plugin_handle}/...`
- **Field types** in the collection editor
- **Automation** triggers and actions
- **Template functions** for the storefront

**Local development**

Place your folder in `plugins/` and enable it in **Settings → Plugins**. Use `scaffold-plugin.php` to generate a starter package — see [Plugin scaffolding CLI](../06-extensibility/scaffold-plugin-cli.md).

**Publishing**

Zip the plugin folder (no path traversal, no parent `..` segments) and upload as a marketplace release. Preflight validates `plugin.json` against the package schema.

## Advanced Users

**Entry point (`plugin.php`)**

Register services on load. Typical patterns:

- Navigation via `plugin.json` `navigation` block or programmatic sidebar registration. Set `navigation.icon` to a registry name (for example `"gear"`) or inline SVG — see [Plugin navigation icon](plugin-navigation-icon.md).
- Routes under `api/` mapped to `/api/{handle}/...`.
- Hook callbacks registered against names declared in `plugin.json`.

**Capability enforcement**

Runtime checks use `has_plugin_capability($plugin_id, $capability, $scope)`. The **plugin security denylist** in Settings → Security can hard-block collections or admin spaces regardless of granted capabilities — see [Plugin security denylist](../06-extensibility/plugin-security-denylist.md).

**Permissions manifest at install**

The CMS resolves `permissions_manifest` from the marketplace release metadata or by previewing the zip's `plugin.json`. Consent is stored in `settings/marketplace_consent.json` keyed by `{slug}/{version}`. New versions with changed declarations require re-consent.

**Dependencies**

Declare soft or hard dependencies in `plugin.json` (`requires_plugins`). The CMS blocks activation when dependencies are missing — for example Events soft-depends on Commerce for paid tickets.

**Package validation**

Marketplace preflight checks:

- Valid semver and required fields
- Zip structure (single root folder or flat layout per schema)
- No dangerous PHP patterns (`eval`, `shell_exec`, etc.)
- Capability declarations present for plugins that access data

**Developer tooling**

| Tool | Purpose |
|------|---------|
| `scaffold-plugin.php` | Generate plugin skeleton |
| `plugin-package.schema.json` | Validate local `plugin.json` |
| Birkly test suite | Denylist and capability tests |

## Related

- [Plugin navigation icon](plugin-navigation-icon.md)
- [Admin design system](../01-admin/design-system.md)
- [For providers](for-providers.md)
- [Security and review](security-and-review.md)
- [Official plugins](official-plugins.md)
- [Plugins](../06-extensibility/plugins.md)
- [Plugin scaffolding CLI](../06-extensibility/scaffold-plugin-cli.md)
