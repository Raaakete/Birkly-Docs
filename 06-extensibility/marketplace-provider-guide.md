# Marketplace — provider publishing guide

Publish plugins, themes, and site packs on the [Birkly Marketplace](https://marketplace.birkly.io). Buyers install them from the CMS **Hub**. This guide is for **providers** (developers and agencies who sell or distribute extensions). Buyers installing in the CMS should see [Marketplace — buyer license and install](marketplace-buyer-guide.md) or [Marketplace go-live — installing plugins](marketplace-go-live.md).

## Summary

**Providers** create a marketplace account, accept the Provider Agreement, complete Stripe Connect onboarding, then publish offers with versioned zip artifacts — including **site packs** (`offer_type: template_pack`). Each offer has a manifest (title, pricing, license seats, compatibility) and one or more releases. Automated preflight is offer-type-aware: plugins need `plugin.json`; site packs need starter/pack layout (`manifest.json` + `collections/` + `project/`). Verified-tier offers also go through manual review. Payouts flow through Stripe Connect after buyer checkout.

## Beginner

**What you need before publishing**

1. A **provider account** on [marketplace.birkly.io](https://marketplace.birkly.io) (email + password — separate from your CMS admin login).
2. Acceptance of the **Provider Agreement** (seller liability, content warranty).
3. **Stripe Connect** onboarding (identity and payout details).
4. A valid **package** for your offer type:
   - **Plugin** — `.zip` with at least `plugin.json` and `plugin.php` (or `index.php`)
   - **Site pack** — `.zip` with `manifest.json` + `collections/` + `project/` (Ops starter shape; not `plugin.json`)
   - **Theme** — theme zip that installs under `themes/`

**Publishing steps**

1. Sign up at **Provider → Sign up** on the marketplace site.
2. Log in and open **Provider dashboard**.
3. Accept the **Provider Agreement** when prompted.
4. Complete **Stripe Connect** onboarding (charges and payouts must be enabled).
5. Click **New offer** and fill in:
   - **Slug** — stable URL id (lowercase, hyphens, e.g. `my-seo-plugin`)
   - **Title** and **summary** — shown in the public catalog and CMS Hub
   - **Offer type** — plugin, theme, or site pack (`template_pack`)
   - **Category** and **tags** — help buyers find your offer
   - **Pricing** — free, one-time, or **subscription** (with currency, amount, and interval `month` / `year`)
   - **License seats** — single site, multi-site tiers, or unlimited
   - **Compatibility** — `requires_birkly` and `requires_php` semver ranges; optional capability declarations
6. **Upload a release** — zip artifact for a semver version (e.g. `1.0.0`) plus changelog text. Match the zip layout to the offer type.
7. **Publish** — preflight and QC run automatically; verified-tier offers enter a manual review queue first.
8. After publish, your offer appears in the [public catalog](https://marketplace.birkly.io/catalog) and the registry API for CMS Hub installs.

**After publish**

- Upload new versions from the offer editor; each version re-runs preflight (and manual review when required for verified tier).
- View sales and payouts in the provider dashboard (Stripe Connect).
- Reply once to verified-purchase reviews on your listing.
- **Connect GitHub** (optional) — automate release builds when you push tags (see below).

## Advanced Users

**Manifest schema**

Offers validate against `offer-manifest.schema.json` in the marketplace repo. Required fields include `slug`, `title`, `summary`, `offer_type`, `category`, `pricing`, `license`, `compatibility`, `trust_level`, and at least one `releases[]` entry with artifact URL, SHA-256 checksum, and size.

**Pricing models**

| `pricing.model` | Fields | Buyer experience |
|-----------------|--------|------------------|
| `free` | `amount_cents: 0` | Checkout may capture email; CMS one-click or license |
| `one_time` | `amount_cents` > 0, `currency` | Single Stripe payment; perpetual license per seat tier |
| `subscription` | `amount_cents` > 0, `currency`, `subscription_interval` (`month` / `year`) | Stripe Billing; license `active` while subscription active; revoked on `customer.subscription.deleted` |

Example subscription block in offer manifest:

```json
"pricing": {
  "model": "subscription",
  "amount_cents": 999,
  "currency": "USD",
  "subscription_interval": "month"
}
```

Stripe webhooks (`customer.subscription.updated`, `customer.subscription.deleted`) update license status. CMS update checks call `GET /api/v1/licenses/status` and block updates when subscription lapses.

**Plugin package (`plugin.json`)**

Plugin artifacts are validated against `plugin-package.schema.json`. Required: `name`, `version`, `description`. Recommended: `requires_birkly`, `requires_php`, declared `capabilities` (least privilege).

**Site pack package**

Site pack (`template_pack`) artifacts use the starter/pack layout. QC expects pack `manifest.json` + `collections/` + `project/` — a plugin zip fails pack preflight. Buyers install to `content/collections/` + `project/` (never `themes/`). See [Hub, themes, and site packs](../06-plugin-economy/theme-and-template-packs.md).

**Registry API**

Published offers are exposed at:

- `GET /api/v1/registry` — catalog index
- `GET /api/v1/offer?slug={slug}` — offer detail + releases
- `GET /api/v1/release?slug={slug}&version={version}` — release metadata + download URL

The Birkly CMS Hub client consumes these endpoints; do not break slug or checksum contracts without a major version bump.

**Trust levels**

| Level | Meaning |
|-------|---------|
| `untrusted` | Community listing; automated preflight only |
| `trusted` | Passed automated checks; Birkly team may spot-check |
| `verified` | Manual technical review for first release and major updates |

**QC and security**

- Zip must not contain path traversal (`..`).
- PHP files are scanned for dangerous patterns (`eval`, `shell_exec`, etc.).
- Declared capabilities should match what the plugin requests at install time.

**Revenue**

Stripe Connect splits: buyer pays gross price → Stripe fee → Birkly application fee → remainder to your Connect account. Refunds are primarily the provider's responsibility; see the Provider Agreement.

**GitHub App — automated releases (Phase 12)**

Third-party providers can connect a repository so new tags trigger build → preflight → QC enqueue (offers are **not** auto-published).

1. Install the **Birkly Marketplace GitHub App** on your repository (organization or user).
2. In **Provider dashboard → Connect GitHub repository**, enter:
   - **Installation ID** (from GitHub App settings)
   - **Owner** and **repository** name
   - **Offer slug** to map releases to
   - **Tag pattern** (default `v*` — matches `v1.0.0`, `v2.1.3`, etc.)
3. Publish a GitHub **Release** or tag matching the pattern.
4. Marketplace webhook `POST /webhooks/github` verifies the signature, downloads the release asset (or builds from tag archive), runs preflight, and enqueues **QC review**.
5. After admin approval (verified tier) or automatic pass (trusted/untrusted per policy), the catalog release updates.

**Official plugins (Birkly repo)**

Raaakete official plugins use CI on tag `plugin/{name}/v*` → `build-all-official-plugin-zips.sh` → registry API upload. See Birkly `plugins/README.md` and [Production deploy checklist](../07-operations/production-deploy-checklist.md).

**Provider webhooks (optional, Phase 12)**

Configure a webhook URL in the provider dashboard to receive JSON events:

| Event | When |
|-------|------|
| `sale` | Buyer completes checkout for your offer |
| `refund` | Refund processed |
| `qc_result` | Preflight/QC completes |
| `payout` | Stripe Connect payout recorded |

Verify webhook signatures using the secret shown in the dashboard. Use for internal ERP, Slack, or license fulfillment systems.

**Stripe webhooks (platform)**

Marketplace operators configure Stripe → `POST /webhooks/stripe` for `account.updated`, `payment_intent.succeeded`, `charge.refunded`. Provider dashboard payout charts read from Connect APIs.

## Related

- [Marketplace — buyer license and install](marketplace-buyer-guide.md)
- [Plugins](plugins.md) — managing plugins in the CMS admin
- [Updates](updates.md) — updating marketplace-sourced plugins
- [Birkly Marketplace](https://marketplace.birkly.io) — public catalog and provider signup
