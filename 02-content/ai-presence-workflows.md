# AI Presence — workflows

## Summary

Tab-by-tab guide for day-to-day AI Presence editing: what each area is for, typical tasks, and how sections connect. Assumes you’ve read [Getting started](ai-presence-getting-started.md).

## Overview tab

**Purpose:** Dashboard — completeness, CMS drift, link health, public URLs.

### Completeness score (0–100)

| Section | Max pts | Complete when |
|---------|---------|---------------|
| Brand identity | 20 | Official name + short description |
| Description | 15 | Full description or what we do |
| Connected content | 15 | ≥1 linked CMS ref |
| Reviewed claims | 20 | ≥1 **supported** claim with evidence |
| Evidence sources | 15 | ≥1 evidence with **verifiable URL** |
| Positioning | 10 | Best known for filled |
| Products & services | 10 | ≥1 product **with grounded source** |
| Terminology | 5 | Preferred terms defined |
| Publishing enabled | 5 | Publishing toggled on |

**Next steps** list links each gap to the relevant tab.

### CMS sync panel

Compares linked **entry** refs to draft identity fields. Shows:

- **Empty field** — CMS has content, AI Presence field is blank → **Refresh from CMS**
- **Drift** — Content diverged → review before refresh
- **Missing entry** — Linked entry deleted → fix connected content

Roles that drive sync targets: `about` / `brand_description` → full description; `short_description` → short description.

### Cross-links & source health

- **Suggest cross-links** — Opens AI Assist with link suggestions (product→CMS, evidence URLs, derived-from)
- **Check all links** — HEAD-checks external URLs on products, claims, evidence; updates `link_status` and `last_verified_at` on draft

Review broken or redirect links before republishing.

### Public URLs

Shows well-known URL and public API base after publish. Requires **Settings → Site delivery** public site URL.

---

## Context tab

**Purpose:** Who you are, how you position, how you speak, who you’re related to.

### Identity

Core brand fields. Use **Generate** per field when AI Assist is available.

**derived_from** (published): When you accept a suggestion to mark short description as derived from a CMS About entry, published JSON includes resolved public URL for that entry under `identity.derived_from.short_description`.

### Positioning

- **Best known for** — 3–5 bullets agents may quote
- **Differentiators**, **best suited for**, **not ideal for** — Reduce mismatched recommendations
- **Competitive positioning** — Optional narrative (keep factual)

### Terminology & voice

- **Preferred terms** — `{ term, meaning }` pairs (e.g. “workspace” = collaborative editor)
- **Avoided terms** — Words agents should not use for you
- **Required qualifications** — Claims that need hedging in copy
- **Tone** — e.g. professional, approachable

### Relationships

Partners, parent company, subsidiaries — name, type, URL. Exported in full JSON; useful for `sameAs`-style graphs.

### Connected content

Array of CMS **entry** or **collection** refs with **role**:

| Role | Typical use |
|------|-------------|
| `about`, `brand_description` | CMS sync → identity description |
| `reference` | General source for AI Assist |
| `wizard_source` | Added by Brand Studio |

Does not duplicate entry body in AI Presence — references only.

---

## Products & Services tab

**Purpose:** Structured catalog for agent Q&A (“What do you sell?”).

### Product card fields

| Field | Notes |
|-------|-------|
| Name, type, category | Required for clarity |
| Short / full description | Summary layer — link out for specs |
| Best for / not for | Audience fit |
| Pricing model | Text hint (subscription, one-time, free) |
| Media | From Media library or external image URL |

### Source links (modal)

Each product can have multiple **typed sources**:

| Role | Type | Example |
|------|------|---------|
| canonical_detail | cms_entry | Product CMS entry |
| canonical_detail | public_page | `https://yoursite.com/products/x` |
| marketplace | marketplace_listing | Amazon DP URL |
| review | review_platform | G2 product page |
| docs | docs | Technical documentation |
| purchase | public_page | Checkout or pricing page |

On **publish**, CMS refs resolve to public URLs on your site domain. Legacy `connected_entry` is merged into sources automatically.

### Link to claims

Products can reference claim IDs (via data model / AI suggestions). Graph API returns linked claims for a product.

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

### Claim detail sources

Beyond evidence items, claims can have direct **sources[]** (proof/reference URLs). Useful when one link supports the claim without a separate evidence record.

### Workflow tip

1. Select claim in list → detail panel
2. Add evidence filtered to that claim
3. Verify evidence (marks `user_verified`)
4. When ≥2 evidence items attached, status may auto-promote to supported — still review manually

See [Claims, evidence & cross-links](ai-presence-claims-evidence-and-links.md) for strategy.

---

## Media tab

**Purpose:** Tell agents **what an image means**, not just that it exists.

For each media asset in context:

| Field | Example |
|-------|---------|
| Represents | brand, product, person, campaign |
| Description | “2024 product hero — Widget Pro on desk” |
| Intended use | “Marketing hero, not spec diagram” |
| Restrictions | “Do not crop logo; no AI-generated derivatives” |

Link media to products/claims via represents.ref when editing (product id or claim id).

**Staleness:** If linked media metadata changes after publish, Overview/Publish warn you to review.

---

## Publish tab

**Purpose:** Go live, preview, version history.

### Publication settings

| Setting | Effect |
|---------|--------|
| Enabled | Master switch — off = public 404 |
| Public path | Well-known file path (default `/.well-known/brand-context.json`) |
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

- `view=summary` — Lightweight identity + supported claims
- `view=products` — Catalog only
- `view=claims` — Supported claims with sources

---

## Save bar workflow

1. Edit any tab → **Save draft** (validates schema)
2. Review completeness / staleness on Overview
3. **Publish** when ready

Never rely on auto-save for AI suggestions — accept explicitly in AI Assist first, then save draft.

## Related docs

- [Getting started](ai-presence-getting-started.md)
- [AI Assist](ai-presence-ai-assist.md)
- [Best practices](ai-presence-best-practices.md)
