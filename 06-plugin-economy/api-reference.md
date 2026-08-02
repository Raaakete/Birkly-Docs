# API reference — registry, embed, and starters

Integrators and developers consume Birkly marketplace and Ops APIs to browse offers, install artifacts, and fetch starter packs. The CMS marketplace client wraps these endpoints; custom tooling can call them directly.

## Summary

The **marketplace registry API** exposes catalog, offer detail, release downloads, and license status at `marketplace.birkly.cloud/api/v1/`. The **Ops starter API** lists and downloads onboarding template packs at `ops.birkly.cloud/api/ops/v1/starters`. CMS installs use `installation_id` for license activation. Override base URLs via environment variables or settings files for staging.

## Beginner

**Who needs these APIs**

| Audience | Typical use |
|----------|-------------|
| **CMS admin** | Built-in Hub tab — no direct API calls |
| **Site owner** | Use the admin UI; APIs run in the background |
| **Integrator / DevOps** | Custom install scripts, air-gapped workflows |
| **Provider** | Publish via Provider Studio; registry exposes your offers |

**Marketplace base URL**

Production: `https://marketplace.birkly.cloud`

Override in CMS:

- Environment: `BIRKLY_MARKETPLACE_URL`
- Settings file: `settings/marketplace.json` → `marketplace_url`

**Common marketplace endpoints**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/registry` | Catalog index (slugs, titles, latest versions) |
| GET | `/api/v1/offer?slug={slug}` | Offer detail, releases, permissions manifest |
| GET | `/api/v1/release?slug={slug}&version={version}` | Release metadata and download URL |
| POST | `/api/v1/licenses/activate` | Bind license key to `installation_id` |
| GET | `/api/v1/licenses/status` | Check license or subscription state |

Buyer checkout and provider publishing use the marketplace web UI at [marketplace.birkly.cloud](https://marketplace.birkly.cloud) and [providers.birkly.cloud](https://providers.birkly.cloud) — not raw API forms.

**Ops starter API**

Production: `https://ops.birkly.cloud/api/ops/v1/starters`

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/ops/v1/starters?channel={channel}` | List starters with versions and onboarding flags |
| GET | `/api/ops/v1/starters/{id}/download` | Download starter pack zip |

CMS override: `BIRKLY_OPS_STARTERS_URL` or `starters_catalog_url` in platform config.

**Embed and catalog links**

Link to public offer pages:

- Catalog: `https://marketplace.birkly.cloud/catalog`
- Offer: `https://marketplace.birkly.cloud/offers/{slug}`

The CMS Hub tab embeds a read-only catalog view backed by the registry API (`/api/marketplace.php`).

## Advanced Users

**Registry — catalog index**

```
GET /api/v1/registry
Accept: application/json
```

Returns offer summaries: `slug`, `title`, `offer_type`, `pricing`, latest `version`, trust level. CMS caches responses briefly; bust cache on manual refresh in the Hub tab.

**Registry — offer detail**

```
GET /api/v1/offer?slug=birkly-commerce
```

Response includes `releases[]` with `version`, `changelog`, `checksum_sha256`, `download_url`, `permissions_manifest`, and optional embedded `plugin_json`.

**Registry — release download**

```
GET /api/v1/release?slug={slug}&version={version}
```

Returns signed or direct artifact URL. CMS downloads, verifies SHA-256, runs zip preflight, extracts to `plugins/`.

**License activation**

```
POST /api/v1/licenses/activate
Content-Type: application/json

{
  "license_key": "...",
  "installation_id": "..."
}
```

`installation_id` is the CMS-local UUID stored in settings. Seat tiers count distinct installation IDs per key.

**License status (updates)**

```
GET /api/v1/licenses/status?license_key=...&installation_id=...
```

Subscription offers return `active` or inactive state. CMS blocks plugin updates when marketplace reports lapsed subscription.

**Install permissions (CMS internal)**

The CMS resolves install consent via marketplace offer detail or zip preview:

- Input: `slug`, optional `version`
- Output: `permissions_manifest`, `consent_required`, existing `consent_record`

Consent POST is handled by CMS admin API, not the public marketplace registry.

**Ops starters — catalog**

```
GET /api/ops/v1/starters?channel=stable
Accept: application/json
```

Response shape:

```json
{
  "ok": true,
  "starters": [
    {
      "id": "blog",
      "label": "Blog starter",
      "onboarding_enabled": true,
      "latest_version": "1.0.0"
    }
  ]
}
```

**Ops starters — download**

```
GET /api/ops/v1/starters/blog/download
```

Returns zip with collections and `project/` site files. CMS extracts via `birkly_ops_extract_starter_zip()`.

**Error handling**

| HTTP code | Meaning |
|-----------|---------|
| 404 | Unknown slug or starter id |
| 403 | License seat exhausted or revoked |
| 409 | Consent required (`consent_required`) |
| 503 | Registry unreachable — CMS shows retry; installed plugins keep working |

**Staging**

Point CMS at staging marketplace or Ops by setting override URLs. Do not mix production licenses with staging registry unless test keys are issued.

## Related

- [Plugin economy overview](overview.md)
- [For site owners](for-site-owners.md)
- [Hub, themes, and site packs](theme-and-template-packs.md)
- [Security and review](security-and-review.md)
- [Marketplace — buyer license and install](../06-extensibility/marketplace-buyer-guide.md)
- [Marketplace — provider publishing guide](../06-extensibility/marketplace-provider-guide.md)
