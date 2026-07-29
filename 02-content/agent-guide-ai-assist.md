# Agent Guide — AI Assist

## Summary

AI Assist helps you build and maintain Agent Guide faster. It **suggests** — it never writes to your draft until you **Accept**. You can use rule-based suggestions without any AI provider; connecting Settings → AI connections unlocks Copilot, Fill 100%, field Generate, and smarter source/link suggestions.

**Grounding rule:** AI Assist prefers declared **sources of truth** before inferring. When sources are missing, it may suggest `sources_of_truth.new` entries first.

## Where AI Assist lives

- **Right sidebar** — AI Assist panel (FAB on smaller viewports)
- **Context fields** — **Generate** button per field
- **Overview / Sources** — Suggest sources and cross-links (same engine as sidebar)

**AI connection picker** — Top of sidebar. Empty = rules-only mode.

## Modes (sidebar)

### Auto tab

| Action | Mode | Behavior |
|--------|------|----------|
| **Auto-fill** | `fill_complete` (creative) | Target ~100% completeness; infers gaps from draft + sources |
| **Fill gaps** | `fill_gaps` | Only incomplete completeness sections |
| **Fill 100%** | `fill_complete` | Same as auto-fill — explicit label |
| **Suggest cross-links / sources** | `links` + rules | Registry entries, product→CMS links, evidence URLs, derived-from |

All return a **review queue** in the sidebar unless you use field **Generate** (direct apply).

### Advanced tab

| Action | Behavior |
|--------|----------|
| **Guide Studio** | Select CMS collections → wizard generates identity, products, claims from entries |
| **Improve** | Refine existing copy |
| **Suggest claims** | Claim ideas grounded in source excerpts |

Guide Studio may add narrative **`cms_collection`** sources for chosen collections.

## Suggestion lifecycle

```
Trigger (Copilot / field / links)
        ↓
Suggestions appear in sidebar
        ↓
Accept one / Accept all / Reject
        ↓
Draft updated in memory → Save draft → Publish
```

**Accept all** applies every pending suggestion sequentially — review count badge first.

### Suggestion fields (common)

| field | Applies |
|-------|---------|
| `sources_of_truth.new` | New registry entry `{type, role, label, url?, ref?}` |
| `identity.short_description` | Identity text |
| `positioning.best_known_for` | Array append |
| `products_services.new` | New product object |
| `products_services.link` | Add source to existing product |
| `claims.new` | New claim string or object |
| `evidence.new` | New evidence with optional claim link |
| `identity.derived_from.short_description` | Mark source for summary |
| `relationships.new` | Partner/parent/etc. |

Each suggestion includes `source` (cms, source, ai, rule, wizard, inferred) and `confidence`.

## Field-level Generate (Context tab)

Click **Generate** next to a field:

- Calls field AI with full draft + **sources of truth** context
- **Applies directly** to that field (no sidebar queue)
- Uses creative grounding when AI connection set

Use for quick single-field polish; use Copilot for multi-section passes.

## Creative vs grounded modes

| Mode | When | AI behavior |
|------|------|-------------|
| **Creative** | Fill 100%, field Generate default | Prefer sources; infer plausible values when missing; mark source inferred |
| **Grounded** | Some copilot modes without creative flag | Do not invent facts unsupported by sources |

For regulated industries, review inferred suggestions carefully before accept.

## Link and source suggestions (rules + AI)

**Rule-based** (always available):

- Empty registry → suggest first CMS collection or primary website as `sources_of_truth.new`
- Product name ≈ CMS entry label → suggest `products_services.link`
- Claim mentions amazon/review/rating without marketplace evidence → suggest `evidence.new`
- Short description filled + narrative CMS source exists → suggest `derived_from`

**AI-enhanced** (with connection):

- Copilot `links` mode adds AI proposals filtered to source/link fields
- Copilot `sources` mode focuses on `sources_of_truth.new` only

## Context gathering

AI Assist reads **sources_of_truth** (CMS entry/collection refs) and excerpts text fields (title, body, description, etc.) — max ~2–4 KB per entry. More declared sources = better suggestions.

Guide Studio scans selected collections (up to ~12 entries each).

## Loading and cancel

Bulk operations show **AI is working** overlay with **Cancel** — aborts in-flight request via AbortController.

## AI errors

If provider fails, sidebar may still show **rule-based** suggestions. Error string returned in API response (`ai_error`) — check connection, API key, model.

## Permissions

AI Assist read paths need `read`. Accept/save needs `manage_settings`. AI connections respect role access from Settings.

## What AI Assist does not do

- Auto-publish
- Replace legal/compliance review
- Scrape third-party sites into your draft
- Modify published snapshot without explicit Publish

## Related docs

- [Getting started](agent-guide-getting-started.md)
- [Claims, evidence & cross-links](agent-guide-claims-evidence-and-links.md)
- [AI connections](../01-admin/ai-connections.md)
