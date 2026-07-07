# Marketplace — provider publishing guide

Publish plugins, themes, and template packs on the [Birkly Marketplace](https://marketplace.birkly.io). This guide is for **providers** (developers and agencies who sell or distribute extensions). Buyers installing plugins in the CMS should see [Marketplace — buyer license and install](marketplace-buyer-guide.md) or [Marketplace go-live — installing plugins](marketplace-go-live.md).

## Summary

**Providers** create a marketplace account, accept the Provider Agreement, complete Stripe Connect onboarding, then publish offers with versioned zip artifacts. Each offer has a manifest (title, pricing, license seats, compatibility) and one or more releases. Automated preflight checks validate `plugin.json`, zip structure, and security patterns; verified-tier offers also go through manual review. Payouts flow through Stripe Connect after buyer checkout.

## Beginner

**What you need before publishing**

1. A **provider account** on [marketplace.birkly.io](https://marketplace.birkly.io) (email + password — separate from your CMS admin login).
2. Acceptance of the **Provider Agreement** (seller liability, content warranty).
3. **Stripe Connect** onboarding (identity and payout details).
4. A valid **plugin package** — a `.zip` containing at minimum `plugin.json` and `plugin.php` (or `index.php`).

**Publishing steps**

1. Sign up at **Provider → Sign up** on the marketplace site.
2. Log in and open **Provider dashboard**.
3. Accept the **Provider Agreement** when prompted.
4. Complete **Stripe Connect** onboarding (charges and payouts must be enabled).
5. Click **New offer** and fill in:
   - **Slug** — stable URL id (lowercase, hyphens, e.g. `my-seo-plugin`)
   - **Title** and **summary** — shown in the public catalog
   - **Offer type** — plugin, theme, or template pack
   - **Category** and **tags** — help buyers find your offer
   - **Pricing** — free, one-time, or subscription (with currency and amount)
   - **License seats** — single site, multi-site tiers, or unlimited
   - **Compatibility** — `requires_birkly` and `requires_php` semver ranges; optional capability declarations
6. **Upload a release** — zip artifact for a semver version (e.g. `1.0.0`) plus changelog text.
7. **Publish** — preflight and QC run automatically; verified-tier offers enter a manual review queue first.
8. After publish, your offer appears in the [public catalog](https://marketplace.birkly.io/catalog) and the registry API for CMS installs.

**After publish**

- Upload new versions from the offer editor; each version re-runs preflight (and manual review when required for verified tier).
- View sales and payouts in the provider dashboard (Stripe Connect).
- Reply once to verified-purchase reviews on your listing.

## Advanced Users

**Manifest schema**

Offers validate against `offer-manifest.schema.json` in the marketplace repo. Required fields include `slug`, `title`, `summary`, `offer_type`, `category`, `pricing`, `license`, `compatibility`, `trust_level`, and at least one `releases[]` entry with artifact URL, SHA-256 checksum, and size.

**Plugin package (`plugin.json`)**

Artifacts are validated against `plugin-package.schema.json`. Required: `name`, `version`, `description`. Recommended: `requires_birkly`, `requires_php`, declared `capabilities` (least privilege).

**Registry API**

Published offers are exposed at:

- `GET /api/v1/registry` — catalog index
- `GET /api/v1/offer?slug={slug}` — offer detail + releases
- `GET /api/v1/release?slug={slug}&version={version}` — release metadata + download URL

The Birkly CMS marketplace client consumes these endpoints; do not break slug or checksum contracts without a major version bump.

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

## Related

- [Marketplace — buyer license and install](marketplace-buyer-guide.md)
- [Plugins](plugins.md) — managing plugins in the CMS admin
- [Updates](updates.md) — updating marketplace-sourced plugins
- [Birkly Marketplace](https://marketplace.birkly.io) — public catalog and provider signup
