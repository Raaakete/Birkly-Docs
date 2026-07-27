# AI Presence — MCP & agents

## Summary

When AI Presence is **published** and **publishing enabled**, Birkly exposes brand context to connected AI agents via MCP tools and a dedicated MCP resource. Agents with `read` permission can retrieve summaries, products, claims, and product graphs without scraping your site.

This complements — does not replace — the public HTTP API and well-known JSON file.

## Prerequisites

1. AI Presence published (`published_version` ≥ 1)
2. `publication_settings.enabled` = true
3. MCP connection configured ([MCP connections](../01-admin/mcp-connections.md))
4. Agent role includes `read` permission

Draft content is **never** exposed via MCP.

## MCP resource

| URI | Content |
|-----|---------|
| `birkly://brand-context` | Published brand context, **summary** view JSON |

Use for lightweight agent system prompts or context injection.

## MCP / AI read tools

Registered in Birkly’s AI tool registry (`core/ai_tool_registry.php`):

### get_brand_context

```json
{
  "view": "summary | full | products"
}
```

| view | Returns |
|------|---------|
| summary | Identity, positioning highlights, supported claim statements, usage_hints |
| full | Complete enriched export |
| products | `products_services` array with resolved sources |

Returns error if not published or disabled.

### list_brand_products

No arguments. Returns published `products_services[]` (public products only).

### get_brand_claim

```json
{ "id": "claim_x" }
```

Returns single **supported** claim from full export (includes sources, evidence_ids).

### get_brand_product

```json
{ "id": "prod_x" }
```

Returns **product graph**:

```json
{
  "product": { … },
  "sources": [ … ],
  "linked_claims": [ … ],
  "usage_hints": {
    "follow_sources_for": "full specs, pricing, purchase links, and proof"
  }
}
```

Product id or name match. Respects `public: false` exclusion.

## HTTP public API parity

MCP tools read the same published snapshot as:

- `/.well-known/brand-context.json`
- `/api/public/ai_presence.php`

Graph equivalents:

| MCP | HTTP |
|-----|------|
| get_brand_product | `?action=product&id=x&graph=1` |
| get_brand_claim | `?action=claim&id=x&graph=1` |

See [Public API](ai-presence-public-api.md).

## Agent integration patterns

### Pattern 1 — Summary in system prompt

1. Agent session starts
2. Tool call: `get_brand_context({ view: "summary" })`
3. Inject JSON into system message
4. Instruct: “Cite sources[] and evidence URLs for factual claims”

Low token cost; good for general brand Q&A.

### Pattern 2 — Product lookup

User asks about a specific offering:

1. `list_brand_products()` or summary first
2. `get_brand_product({ id: "prod_widget" })`
3. Follow `sources[].url` for specs/pricing (agent browsing or user handoff)

### Pattern 3 — Claim verification

User asks “Are you SOC2 certified?”:

1. `get_brand_context({ view: "full" })` or claim-specific tool
2. Find supported claim matching topic
3. Resolve evidence URLs from linked evidence
4. Answer with citation links only — do not invent audit details

### Pattern 4 — Combined with CMS tools

Brand context gives the map; CMS tools give depth:

```
get_brand_context(summary)
  → user asks product detail
get_brand_product(id)
  → canonical source is cms_entry
read_entry(collection, slug)
  → full specs from CMS
```

Aligns with AI Presence “index layer” design.

## Claude Desktop / stdio bridge

Standard Birkly MCP setup ([MCP connections](../01-admin/mcp-connections.md)) exposes all read tools. Ensure the connecting user’s role has `read`.

Test:

> “Use get_brand_context with view summary and tell me what this company is known for.”

## Admin AI chat

The admin **AI chat** may also dispatch read actions via `api/ai_read_actions.php` — same backends as MCP for brand tools.

Write actions (edit draft, publish) are **not** exposed as MCP tools — use admin UI or authenticated admin API.

## Caching & freshness

- Published MCP responses reflect last **Publish** action
- Public HTTP cache: 5 minutes (`Cache-Control: max-age=300`)
- Header `X-AI-Presence-Version` on HTTP — MCP consumers should note `published_version` in JSON

After republish, agents may need session refresh to pick up new version.

## Security

- Same permission model as other read tools
- No draft leakage
- Published JSON is already public via HTTP — MCP adds authenticated convenience for connected agents, not secret data

## Error handling

| Condition | Tool result |
|-----------|-------------|
| Never published | Error: Brand context not published |
| Publishing disabled | Error / null |
| Unknown claim/product id | Error: Not found |
| Unsupported claim id | Error (supported only) |

## Related docs

- [AI Presence overview](../02-content/ai-presence.md)
- [Public API](ai-presence-public-api.md)
- [MCP connections](../01-admin/mcp-connections.md)
- [AI overview](../01-admin/ai-overview.md)
