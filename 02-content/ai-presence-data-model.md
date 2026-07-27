# AI Presence — data model

## Summary

Technical reference for `ai_presence.v1`: storage layout, schema sections, completeness algorithm, publish pipeline, and export enrichment. Schema file: `schema/ai_presence.schema.json` in the Birkly repo.

## Schema version

```json
"schema_version": "ai_presence.v1"
```

Validation rejects unknown schema versions on save.

## Storage (runtime)

Not committed to git — lives under project `settings/`:

```
settings/ai_presence/
  draft.json          ← working copy (admin edits)
  published.json      ← last published snapshot
  meta.json           ← versions, timestamps, checksums
  versions/
    1.json … N.json   ← optional history (cap 50)
```

### meta.json fields

| Field | Description |
|-------|-------------|
| published_version | Integer, increments each publish |
| last_published_at | ISO 8601 |
| draft_updated_at | Last draft save |
| draft_checksum / published_checksum | SHA-256 of normalized JSON |

## Top-level document structure

| Key | Description |
|-----|-------------|
| identity | Brand name, descriptions, website, social, derived_from |
| positioning | Best known for, differentiators, fit |
| communication_guidance | Terms, tone, qualifications |
| connected_content | CMS entry/collection refs with roles |
| products_services | Catalog items |
| claims | Factual statements + status |
| evidence | Proof artifacts |
| media_context | Media library contextual metadata |
| relationships | Partners, parent orgs, etc. |
| publication_settings | Enable, paths, JSON-LD, redactions |
| setup_completed_at / setup_skipped_at | Onboarding markers |

Published export adds: `published_version`, `generated_at`, `usage_hints`, optional `json_ld`.

## identity

```json
{
  "official_name": "Acme Co",
  "short_description": "…",
  "full_description": "…",
  "what_we_do": "…",
  "industry": ["SaaS"],
  "categories": ["Productivity"],
  "locations": ["Berlin", "Remote-first"],
  "website": "https://example.com",
  "social_profiles": [{ "platform": "linkedin", "url": "https://…" }],
  "derived_from": {
    "short_description": {
      "collection": "pages",
      "entry_id": "about",
      "slug": "about",
      "label": "About us"
    }
  }
}
```

On publish, `derived_from.*.url` resolves to public CMS URL when possible.

## connected_content item

```json
{
  "role": "about",
  "ref_type": "entry",
  "collection": "pages",
  "entry_id": "abc123",
  "slug": "about",
  "label": "About us"
}
```

`ref_type`: `entry` | `collection`

## products_services item

```json
{
  "id": "prod_x",
  "name": "Widget Pro",
  "type": "product",
  "short_description": "…",
  "full_description": "…",
  "category": "Hardware",
  "pricing_model": "subscription",
  "best_for": ["Small teams"],
  "not_for": ["Enterprise SSO-only shops"],
  "claim_ids": ["claim_y"],
  "sources": [{ "$ref": "source_link" }],
  "connected_entry": { "collection": "…", "entry_id": "…" },
  "media_id": "…",
  "media_url": "…",
  "public": true
}
```

`connected_entry` legacy field normalized into `sources[]` on save. Export omits raw `connected_entry`; exports resolved `sources`.

## source_link definition

```json
{
  "id": "src_abc",
  "role": "canonical_detail",
  "type": "cms_entry",
  "label": "Widget Pro page",
  "url": "https://example.com/products/widget-pro",
  "notes": "",
  "rating": null,
  "review_count": null,
  "last_verified_at": "2026-07-27T10:00:00+00:00",
  "link_status": "ok",
  "ref": {
    "collection": "products",
    "entry_id": "e1",
    "slug": "widget-pro",
    "label": "Widget Pro"
  }
}
```

**Roles:** canonical_detail, reference, marketplace, review, docs, proof, purchase, social, other

**Types:** cms_entry, public_page, marketplace_listing, review_platform, docs, certification, other

## claims item

```json
{
  "id": "claim_x",
  "statement": "ISO 27001 certified",
  "status": "supported",
  "evidence_ids": ["evidence_a", "evidence_b"],
  "related_content": [],
  "sources": [],
  "last_reviewed_at": "",
  "expires_at": "",
  "notes": ""
}
```

Public graph views add `linked_evidence[]` on export.

## evidence item

```json
{
  "id": "evidence_a",
  "type": "certification",
  "title": "ISO 27001 certificate",
  "url": "https://…",
  "rating": null,
  "review_count": null,
  "publisher": "",
  "verification_status": "user_verified",
  "claim_ids": ["claim_x"],
  "link_status": "ok",
  "last_verified_at": "2026-07-27T10:00:00+00:00",
  "notes": ""
}
```

**Types:** cms_content, external_url, upload, certification, publication, marketplace_listing, review_platform, other

## usage_hints (export only)

Generated at publish — guides AI consumers:

```json
{
  "summary_layer": true,
  "authoritative_fields": ["identity.official_name", "claims.supported", "evidence.user_verified"],
  "marketing_fields": ["positioning.best_known_for", "positioning.differentiators"],
  "citation": "Prefer citing linked sources…",
  "claims_require_evidence": true,
  "follow_links_for": ["product specs", "pricing", "reviews", "certifications"]
}
```

## Completeness scoring (max 100)

| Key | Max | Logic |
|-----|-----|-------|
| identity | 20 | name 10 + short 10 |
| description | 15 | full or what_we_do |
| connected_content | 15 | count ≥ 1 |
| claims | 20 | supported+evidence 20; any claim 8 |
| evidence | 15 | any 10 + URL 5 |
| positioning | 10 | best_known_for non-empty |
| products | 10 | any 5 + grounded 5 |
| terminology | 5 | preferred_terms |
| publishing | 5 | enabled flag |

## Publish pipeline

1. Load draft → validate
2. Require `publication_settings.enabled`
3. Write `published.json`, bump version, save meta
4. Snapshot to `versions/{n}.json`, prune >50
5. `birkly_ai_presence_build_public_export()`:
   - Attach version, timestamp
   - Optional JSON-LD via `birkly_ai_presence_export_json_ld_pro()`
   - `birkly_ai_presence_enrich_public_export()` — resolve sources, usage_hints, linked_evidence
6. Write well-known file if `public_site_mode=project`

## Admin API (authenticated)

Base: `/api/ai_presence.php`

| Action | Method | Notes |
|--------|--------|-------|
| get | read | Draft + published + completeness + staleness |
| save_draft | write | CSRF, merge partial |
| publish | write | Validate + snapshot |
| suggest / copilot | write | AI suggestions |
| suggest_links | write | Link-specific suggestions |
| validate_links | write | Optional `update_status` |
| list_collection_entries | read | CMS picker |
| fetch_url_meta | write | SSRF-safe title fetch |
| cms_diff / cms_refresh | read/write | Sync helpers |

## Permissions

| Capability | Permission |
|------------|------------|
| View | `read` OR `manage_settings` |
| Edit, publish | `manage_settings` |

## Related docs

- [Public API](../04-integration/ai-presence-public-api.md)
- [Claims, evidence & cross-links](ai-presence-claims-evidence-and-links.md)
