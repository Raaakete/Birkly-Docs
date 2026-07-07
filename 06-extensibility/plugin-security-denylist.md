# Plugin security denylist

Block plugins from accessing specific collections, entries, or path patterns regardless of granted capabilities.

## Summary

The **plugin security denylist** is a global hard deny list in **Settings → Security**. Resources on the denylist cannot be read or modified by any plugin hook, UI injection, or service call — even if the plugin declared and was granted the relevant capability. Storage: `settings/plugin_denylist.json`.

## Beginner

**Why use a denylist**

Some collections hold sensitive data (HR, payroll, legal). You may grant a plugin broad `read_entries` access for most content but want specific collections permanently off-limits. The denylist enforces that boundary.

**Add a protected resource**

1. Open **Settings → Security**.
2. Find **Plugin security denylist**.
3. Click **Add resource**.
4. Enter an identifier:
   - Collection slug: `payroll`
   - Entry id: `entry:blog:confidential-post`
   - Wildcard pattern: `payroll/*`
5. Save — the resource appears in the list immediately.

**Remove a resource**

Click **Remove** next to the entry. Plugins regain access subject to their normal capability grants.

**What gets blocked**

When a collection slug or entry id matches the denylist:

- Plugin hooks that read or write entries are denied.
- Capability checks return false before permission lookup.
- UI injections targeting denied scopes are skipped.

This does not affect **admin users** or **core CMS** — only plugin code paths that use the capability system.

## Advanced Users

**Storage format**

`settings/plugin_denylist.json`:

```json
{
  "resources": ["payroll", "legal/*", "entry:settings:secrets"],
  "updated_at": "2026-07-07T12:00:00+00:00"
}
```

**Enforcement**

`has_plugin_capability($plugin_id, $capability, $scope)` calls `is_resource_protected($scope)` first (denylist-first model). Wildcard patterns use `*` glob semantics converted to regex.

**API** (`/api/plugins_permissions.php`, requires `manage_plugins`):

| Action | Body |
|--------|------|
| `get_denylist` | — |
| `add_to_denylist` | `{ resource }` |
| `remove_from_denylist` | `{ resource }` |
| `set_denylist` | `{ resources: [] }` |

**Resource identifier conventions**

| Pattern | Matches |
|---------|---------|
| `blog` | Collection slug `blog` |
| `payroll/*` | Any resource starting with `payroll/` |
| `entry:products:sku-123` | Specific entry scope |

**Audit**

Permission changes log to the plugin permissions audit trail. Test denylist behavior with `plugin_denylist_test.php` in the Birkly test suite.

## Related

- [Settings](../01-admin/settings.md)
- [Plugins](plugins.md)
- [Security](../07-operations/security.md)
