# Agent Guide — workflows

## Summary

Tab-by-tab guide for day-to-day Agent Guide editing: what each area is for, typical tasks, and how sections connect. Follow the workflow **Sources → Context → Products → Claims → Publish**. Assumes you’ve read [Getting started](agent-guide-getting-started.md).

## Overview tab

**Purpose:** Dashboard — completeness, source registry health, CMS drift, link health, public URLs.

### Completeness score (0–100)

| Section | Max pts | Complete when |
|---------|---------|---------------|
| Identity | 20 | Official name + short description |
| Description | 15 | Full description or what we do |
| Sources of truth | 15 | ≥1 **narrative** source in registry |
| Reviewed claims | 20 | ≥1 **supported** claim with evidence |
| Evidence sources | 15 | ≥1 evidence with **verifiable URL** |
| Positioning | 10 | Best known for filled |
| Products & services | 10 | ≥1 product **with grounded source** |
| Terminology | 5 | Preferred terms defined |
| Publishing enabled | 5 | Publishing toggled on |

**Next steps** list links each gap to the relevant tab.

### CMS sync panel

Compares narrative **sources of truth** and linked CMS refs to draft identity fields. Shows:

- **Empty field** — CMS has content, Agent Guide field is blank → **Refresh from CMS**
- **Drift** — Content diverged → review before refresh
- **Missing entry** — Linked entry deleted → fix sources

Narrative CMS sources drive sync targets for full description and short description.

### Cross-links & source health

- **Suggest cross-links / sources** — Opens AI Assist with registry, product, evidence, and derived-from suggestions
- **Check all links** — HEAD-checks external URLs on products, claims, evidence, and sources; updates `link_status` and `last_verified_at`

Review broken or redirect links before republishing.

### Public URLs

Shows well-known URL (`/.well-known/agent-guide.json`), legacy path when configured, and public API base after publish. Requires **Settings → Site delivery** public site URL.

---

## Sources tab

**Purpose:** Declare **sources of truth** — the canonical reading list for agents. **Start here** before writing summaries elsewhere.

### Why a registry?

Summaries in Context and Products are a **index layer**. The registry tells agents (and AI Assist) which CMS entries, websites, documents, and other URLs to read first for narrative, proof, reference, or archive material.

### Source shape

Each entry in `sources_of_truth[]` has:

| Field | Purpose |
|-------|---------|
| `type` | Kind of source (see types below) |
| `role` | How agents should use it |
| `label` | Human-readable name |
| `url` | Public URL when not CMS-resolved |
| `ref` | CMS collection/entry when type is `cms_entry` or `cms_collection` |
| `priority` | 0–100 hint for ordering (default 50) |
| `notes` | Editor notes (not marketing copy) |

### Source types

| Type | Use for |
|------|---------|
| `cms_entry` | Single CMS entry (About page, product page) |
| `cms_collection` | Whole collection as background reading |
| `website` | External or primary site URL |
| `document` | PDF or file in Media library |
| `media_asset` | Image or media with contextual meaning |
| `marketplace` | Amazon, app store, Etsy listing |
| `review_platform` | G2, Trustpilot, Capterra |
| `other` | Anything else with a URL |

### Source roles

| Role | Meaning |
|------|---------|
| `narrative` | Who you are, what you do — primary story sources |
| `proof` | Evidence and verification material |
| `reference` | Background reading, docs, FAQs |
| `archive` | Historical or superseded material |

**Completeness:** At least one **narrative** source is required for full sources credit.

### Adding sources

1. **Add source of truth** → pick type and role.
2. For CMS types, select collection and optionally entry.
3. For website/document/media, provide URL or media picker.
4. Run **Check all links** periodically on URL-backed sources.

Legacy **`connected_content[]`** refs are migrated into this registry automatically on save.

---

## Context tab

**Purpose:** Who you are, how you position, how you speak, who you’re related to. Summaries here should **reflect** declared sources of truth.

### Identity

Core profile fields. Use **Generate** per field when AI Assist is available — it reads `sources_of_truth` first.

**derived_from** (published): When you mark short description as derived from a narrative CMS source, published JSON includes the resolved public URL under `identity.derived_from.short_description`.

### Positioning

- **Best known for** — 3–5 bullets agents may quote
- **Differentiators**, **best suited for**, **not ideal for** — Reduce mismatched recommendations
- **Competitive positioning** — Optional narrative (keep factual)

### Terminology & voice

- **Preferred terms** — `{ term, meaning }` pairs
- **Avoided terms** — Words agents should not use
- **Required qualifications** — Claims that need hedging in copy
- **Tone** — e.g. professional, approachable

### Relationships

Partners, parent organization, subsidiaries — name, type, URL. Exported in full JSON; useful for graph and `sameAs`-style linking.

---

## Products & Services tab

**Purpose:** Structured catalog for agent Q&A (“What do you offer?”).

### Product card fields

| Field | Notes |
|-------|-------|
| Name, type, category | Required for clarity |
| Short / full description | Summary layer — link out for specs |
| Best for / not for | Audience fit |
| Pricing model | Text hint (subscription, one-time, free) |
| Media | From Media library or external image URL |

### Product source links (modal)

Each product can have multiple **typed sources** (separate from top-level `sources_of_truth`):

| Role | Type | Example |
|------|------|---------|
| canonical_detail | cms_entry | Product CMS entry |
| canonical_detail | public_page | `https://yoursite.com/products/x` |
| marketplace | marketplace_listing | Listing URL |
| review | review_platform | G2 product page |
| docs | docs | Technical documentation |
| purchase | public_page | Checkout or pricing page |

On **publish**, CMS refs resolve to public URLs on your site domain.

### Link to claims

Products can reference claim IDs. Graph API returns linked claims for a product.

---

## Claims & Evidence tab

**Purpose:** Verifiable statements and proof.

### Claim statuses

| Status | Meaning |
|--------|---------|
| `pending_review` | Draft statement, not for public “supported” export |
| `supported` | Reviewed; included in summary/public views |
| `unsupported` | Explicitly not standing behind |
| `conflicting` | Internal disagreement — resolve before publish |
| `expired` | Was true; time-bound claim ended |

Only **supported** claims appear in `view=summary`, `view=claims`, and MCP claim tools.

### Evidence types

| Type | Use for |
|------|---------|
| cms_content | CMS entry as proof |
| external_url | Any HTTPS proof page |
| marketplace_listing | Amazon, Etsy, app store |
| review_platform | G2, Trustpilot, Capterra |
| certification | ISO, SOC2 badge pages |
| publication | Press, research papers |
| upload | Internal doc reference (prefer URL when public) |

Optional **rating** and **review_count** store lightweight metadata — **URL remains source of truth**.

### Workflow tip

1. Select claim in list → detail panel
2. Add evidence filtered to that claim
3. Verify evidence (marks `user_verified`)
4. When ≥2 evidence items attached, status may auto-promote to supported — still review manually

See [Claims, evidence & cross-links](agent-guide-claims-evidence-and-links.md) for strategy.

---

## Media tab

**Purpose:** Tell agents **what an image means**, not just that it exists.

For each media asset in context:

| Field | Example |
|-------|---------|
| Represents | organization, product, person, campaign |
| Description | “2024 product hero — Widget Pro on desk” |
| Intended use | “Marketing hero, not spec diagram” |
| Restrictions | “Do not crop logo; no AI-generated derivatives” |

Link media to products/claims via represents.ref when editing.

**Staleness:** If linked media metadata changes after publish, Overview/Publish warn you to review.

---

## Publish tab

**Purpose:** Go live, preview, version history.

### Publication settings

| Setting | Effect |
|---------|--------|
| Enabled | Master switch — off = public 404 |
| Public path | Well-known file path (default `/.well-known/agent-guide.json`) |
| Include JSON-LD | Embeds schema.org graph in export |
| Public views enabled | API view parameters active |
| Redact public fields | Advanced: omit fields from export |

### Publish action

Creates immutable version snapshot:

- Increments `published_version`
- Writes `published.json`, optional `versions/{n}.json` (cap 50)
- Writes well-known file when hosting mode is `project`
- Public API serves new snapshot (5-minute cache)

### Staleness warnings

After publish, warns when:

- Linked CMS entry updated
- Linked media changed
- External evidence link not verified in 180+ days
- Evidence link status is **broken**

Republish after review when material changes occur.

### API view URLs

Publish tab lists example URLs:

- `view=summary` — Lightweight identity + supported claims + sources hint
- `view=products` — Catalog only
- `view=claims` — Supported claims with sources

---

## Save bar workflow

1. **Sources first** — Ensure narrative sources exist
2. Edit any tab → **Save draft** (validates schema)
3. Review completeness / staleness on Overview
4. **Publish** when ready

Never rely on auto-save for AI suggestions — accept explicitly in AI Assist first, then save draft.

## Related docs

- [Getting started](agent-guide-getting-started.md)
- [AI Assist](agent-guide-ai-assist.md)
- [Best practices](agent-guide-best-practices.md)
