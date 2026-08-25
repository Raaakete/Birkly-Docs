# Discovery

**Discovery** is the admin home for how your public site is found — by search engines, chat AIs, and visitor browser assistants.

Open **Discovery** in the admin sidebar (aliases: `?page=agent-guide`, `?page=ai-presence` redirect here).

## Three packs

Each pack is independent. Turn a pack **off** to stop public output; your settings are never deleted.

| Pack | Who it helps | Public outputs |
|------|----------------|----------------|
| **SEO** | Google, Bing, search-based AIs | Meta tags, `/sitemap.xml`, `robots.txt` `Sitemap:` line, JSON-LD |
| **Agent Guide** | Chat and search AIs | `/for-agents`, `/llms.txt`, `/.well-known/agent-guide.json` |
| **WebMCP** | AI helpers in the visitor's browser | `birkly-webmcp.js` tools from **installed plugins only** |

## Delivery modes

Each pack supports:

- **Auto-inject** — Birkly adds tags on Birkly-hosted `project/` pages (SSR).
- **Manual** — Copy URLs and snippets for external sites or SEO plugins.
- **Download** — Agent Guide JSON export (where applicable).

## Verify checklist

Use the **Verify & monitor** panel at the bottom of Discovery after publishing. It checks the discovery cross-link mesh: `llms.txt` ↔ sitemap ↔ robots ↔ `/for-agents` ↔ `agent-guide.json`, plus **SEO health** (missing titles, duplicates, redirect loops).

## Site URL Map

Per-URL search and social listings live in **Discovery → SEO → Site URL Map** — not in the entry editor. See [Site URL Map](site-url-map.md).

## Related

- [Agent Guide getting started](../02-content/agent-guide-getting-started.md)
- [WebMCP tools](../04-integration/webmcp-tools.md)
- [Agent Guide public API](../04-integration/agent-guide-public-api.md)
