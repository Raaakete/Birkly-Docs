# AI Presence — claims, evidence & cross-links

## Summary

Claims, evidence, and cross-links are how AI Presence stays **honest**: summaries tell agents the headline; links tell them where to verify. This doc covers strategy, types, and worked examples — especially marketplace and review URLs.

## Three layers of truth

| Layer | What it is | Agent should… |
|-------|------------|---------------|
| **Summary** | Short description, positioning bullets | Paraphrase carefully |
| **Claim** | Asserted fact with status | Repeat only if supported |
| **Evidence / source** | URL or CMS ref with proof | Follow link to verify |

**Rule:** Don’t paste Amazon review text into AI Presence. Store the **claim** (“Highly rated on Amazon”) + **link** to the listing + optional rating/count metadata.

## Claims

### Writing good claims

Good claims are:

- **Specific** — “ISO 27001 certified since 2023” not “very secure”
- **Checkable** — You can point to evidence
- **Bounded** — Time, geography, audience where relevant

Bad claims:

- Pure opinion without qualification
- Superlatives you can’t prove (“best in the world”)
- Forward-looking guarantees without disclaimer

### Status workflow

```
pending_review → (evidence added, reviewed) → supported
                    ↓
              unsupported / expired / conflicting
```

Public export and `view=summary` only include **supported** claims.

### Claim sources vs evidence

| Mechanism | When to use |
|-----------|-------------|
| **evidence[]** + `evidence_ids` | Reusable proof documents shared across claims |
| **claim.sources[]** | Direct URLs tied only to this claim |

Example: Claim “Featured in TechCrunch 2025” → one evidence row with publication URL. Claim “4.8★ on Amazon” → evidence type `marketplace_listing` + URL; optional rating 4.8, review_count 1200.

## Evidence

### Evidence types (reference)

| Type | Typical URL |
|------|-------------|
| `cms_content` | Resolved public CMS entry URL |
| `external_url` | Any allowed HTTPS page |
| `marketplace_listing` | `amazon.com/dp/…`, App Store, Etsy |
| `review_platform` | G2, Trustpilot, Capterra |
| `certification` | Issuer badge or certificate page |
| `publication` | News article, paper |
| `upload` | Internal — prefer public URL when possible |

### Verification

- **user_verified** — Editor confirmed link matches claim
- **unverified** — Default for new evidence

Use **Verify** in admin after checking the page live.

### Link health

**Check all links** (Overview) performs safe external HEAD requests:

| link_status | Meaning |
|-------------|---------|
| ok | 2xx/3xx response |
| redirect | Final URL differs — may update on check |
| broken | 4xx/5xx or network failure |
| unknown | Not checked yet |
| blocked | SSRF-safe filter rejected URL |

**Staleness:** Evidence URLs not verified in 180 days trigger publish warnings.

### SSRF safety

Admin URL fetch and link check block localhost, private IPs, non-HTTP schemes. Only public HTTPS/HTTP URLs.

## Cross-links (product & brand sources)

### Source link shape

Each source link has:

```json
{
  "id": "src_abc",
  "role": "canonical_detail",
  "type": "cms_entry",
  "label": "Widget Pro — product page",
  "url": "https://example.com/products/widget-pro",
  "ref": {
    "collection": "products",
    "entry_id": "entry_123",
    "slug": "widget-pro",
    "label": "Widget Pro"
  },
  "link_status": "ok",
  "last_verified_at": "2026-07-27T10:00:00+00:00"
}
```

CMS entries without stored URL get **resolved on publish** from collection + slug + public site base.

### Source roles

| Role | Purpose |
|------|---------|
| canonical_detail | Authoritative full detail |
| reference | General background |
| marketplace | Where to buy / listing |
| review | Reviews and ratings |
| docs | Specs, API docs, manuals |
| proof | Supports a specific assertion |
| purchase | Checkout/pricing |
| social | Social profile (also in identity.social_profiles) |

### Product cross-link patterns

**Pattern A — CMS-first**

- Product summary in AI Presence
- Canonical source: CMS product entry
- Optional: Amazon listing as marketplace source

**Pattern B — Site-first**

- Canonical source: public product URL on your domain
- CMS entry as reference if duplicate exists

**Pattern C — Marketplace-heavy**

- Short AI Presence summary
- Canonical: your site page
- Marketplace + review platform sources for social proof

### Brand-level cross-links

**Connected content** (Context) links brand narrative to CMS About/FAQ entries.

**identity.derived_from** marks which entry grounds `short_description` (and other fields as you add them) — published export includes resolved URL.

## Worked example — Amazon reviews

**Goal:** Agents can say you’re well-reviewed without hallucinating review text.

1. **Claim:** “Consistently rated 4.5+ stars on Amazon US”
2. **Evidence:**
   - type: `marketplace_listing`
   - url: `https://www.amazon.com/dp/B0XXXXXX`
   - rating: 4.7
   - review_count: 842
   - verification: user_verified after manual check
3. **Do not** scrape or paste review bodies into AI Presence
4. **Republish** when rating changes materially — set calendar reminder

## Worked example — B2B SaaS

1. **Products:** Plan names with canonical links to `/pricing` anchors
2. **Claims:** “SOC 2 Type II certified” → evidence type certification → auditor page
3. **Claims:** “Listed on G2 with 4.8 rating” → review_platform URL
4. **Cross-links:** Suggest links matches product names to CMS case study entries

## Completeness interaction

- Products: need **grounded source** for full 10 pts
- Evidence: need **URL** for full 15 pts
- Claims: need **supported + evidence_ids** for full 20 pts

Use completeness as quality gate, not checkbox filling.

## Public export & JSON-LD

Published products include resolved `sources[]`. Supported claims in graph views include `linked_evidence`. JSON-LD adds:

- Product `url`, `sameAs` from sources
- Claim `isBasedOn` from evidence URLs

See [Public API](../04-integration/ai-presence-public-api.md).

## Related docs

- [Workflows](ai-presence-workflows.md)
- [Best practices](ai-presence-best-practices.md)
- [Data model](ai-presence-data-model.md)
