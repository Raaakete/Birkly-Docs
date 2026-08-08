# Plugin language extensions

How plugins add template sentences and functions without overriding the core Birkly language.

## Summary

**In short:** Plugins can register extra helpers (Commerce cart URLs, Events `.ics`, user “logged in” checks, etc.). At runtime the engine loads **plugin language first**, then **core last** — core keywords win on conflicts (CSS-like cascade). Extend; don’t override `{for each}`, `{from}`, or `format`.

## Beginner

### What you might see

When a plugin is **active**, new placeholders appear in docs for that plugin:

| Plugin | Examples |
|--------|----------|
| Commerce | `{commerce_cart_count}`, `{commerce_buy_url …}` — [Commerce functions](commerce-functions.md) |
| Events | `{upcoming_events}`, `{event_ics_url …}` — [Events functions](events-functions.md) |
| User Management | Phrases like `user_logged_in`, `user_current` (when registered) |

If the plugin is inactive, those helpers are omitted — the rest of your templates still run.

### Owner tip

Install/activate plugins from **Admin → Plugins / Hub**. Template extras appear only after activation. See [Plugins](../06-extensibility/plugins.md).

## Advanced Users

### For developers & AI

**Load order**

1. Plugin language definitions  
2. Core / template language definitions (**win on conflict**)

**Registration**

Plugins typically call `register_template_function()` (or the language-module equivalent) from `plugin.php`. Gate on “plugin active” so inactive plugins leave no global names.

**Design rules**

- Prefer distinctive prefixes (`commerce_`, `event_`, `user_`).  
- Do not redefine `for each`, `from`, `if`, `format`, `ordered by`.  
- Document public helpers in Birkly-Docs under `03-templating/` and link from the plugin’s extensibility page.  
- Keep Shadow DOM policy: helpers still run through the string engine; discovery remains Light DOM.

**Testing**

- Activate plugin → reference project or minimal HTML → confirm helper output.  
- Deactivate → page must not throw; helper should be absent.  
- Validator: do not teach phantoms alongside real plugin APIs.

**Related platform surfaces**

- Website tools (WebMCP) are **not** template language — [Website tools](../04-integration/webmcp-tools.md).  
- AI app connections: **Settings → AI** — [MCP connections](../01-admin/mcp-connections.md).

## Related

- [Canonical syntax](canonical-syntax.md)
- [Commerce functions](commerce-functions.md)
- [Events functions](events-functions.md)
- [Plugin development](../06-plugin-economy/plugin-development.md)
- [Storefront patterns](storefront-patterns.md)
