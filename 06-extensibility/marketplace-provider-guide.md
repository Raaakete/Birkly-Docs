# Marketplace — provider publishing guide

Publish plugins, themes, and site packs on the [Birkly Marketplace](https://marketplace.birkly.io). Buyers install them from the CMS **Hub**. This guide is for **providers** (developers and agencies who sell or distribute extensions). Buyers installing in the CMS should see [Marketplace — buyer entitlement and install](marketplace-buyer-guide.md) or [Marketplace go-live — installing plugins](marketplace-go-live.md).

## Summary

**Providers** create a marketplace account, accept the Provider Agreement, complete Stripe Connect onboarding, then publish offers with versioned zip artifacts — including **site packs** (`offer_type: template_pack`). For third-party offers, the provider is the seller and merchant of record; Birkly collects a Stripe Connect application fee (default **15%**, configurable by Ops). Birkly is merchant of record only for official Birkly offers. P55 supports **Stripe Connect only** for Hub checkout and payouts; Mollie, multi-PSP, and regional PSPs are out of scope for this phase.

## Beginner

**What you need before publishing**

1. A **provider account** on [marketplace.birkly.io](https://marketplace.birkly.io) (email + password — separate from your CMS admin login).
2. Acceptance of the **Provider Agreement** (seller liability, content warranty).
3. **Stripe Connect** onboarding (identity and payout details). Paid third-party publishing is limited to countries where Stripe supports connected accounts.
4. A valid **package** for your offer type:
   - **Plugin** — `.zip` with at least `plugin.json` and `plugin.php` (or `index.php`)
   - **Site pack** — `.zip` with `manifest.json` + `collections/` + `project/` (Ops starter shape; not `plugin.json`)
   - **Theme** — theme zip that installs under `themes/`

**Publishing steps**

1. Sign up at **Provider → Sign up** on the marketplace site.
2. Log in and open **Provider dashboard**.
3. Accept the **Provider Agreement** when prompted.
4. Complete **Stripe Connect** onboarding (charges and payouts must be enabled). P55 does not support Mollie or another PSP for Hub provider payouts.
5. Click **New offer** and fill in:
   - **Slug** — stable URL id (lowercase, hyphens, e.g. `my-seo-plugin`)
   - **Title** and **summary** — shown in the public catalog and CMS Hub
   - **Offer type** — plugin, theme, or site pack (`template_pack`)
   - **Category** and **tags** — help buyers find your offer
   - **Pricing** — free, freemium, no-card trial, one-time, or **subscription** (with currency, amount, and interval `month` / `year`)
   - **Entitlement seats** — single site, multi-site tiers, or unlimited
   - **Compatibility** — `requires_birkly` and `requires_php` semver ranges; optional capability declarations
6. **Upload a release** — zip artifact for a semver version (e.g. `1.0.0`) plus changelog text. Match the zip layout to the offer type.
7. **Publish** — preflight and QC run automatically; verified-tier offers enter a manual review queue first.
8. After publish, your offer appears in the [public catalog](https://marketplace.birkly.io/catalog) and the registry API for CMS Hub installs.

**After publish**

- Upload new versions from the offer editor; each version re-runs preflight (and manual review when required for verified tier).
- View sales and payouts in the provider dashboard (Stripe Connect).
- Reply once to verified-purchase reviews on your listing.
- **Connect GitHub** (optional) — automate release builds when you push tags (see below).

**Provider responsibility**

For third-party offers, you are the seller and merchant of record. You are responsible for the listing, support, taxes or invoices required by your jurisdiction, and the first refund decision. Birkly operates the platform, official Birkly offers, marketplace infrastructure, and Ops escalation.

## Advanced Users

**Manifest schema**

Offers validate against `offer-manifest.schema.json` in the marketplace repo. Required fields include `slug`, `title`, `summary`, `offer_type`, `category`, `pricing`, `license`, `compatibility`, `trust_level`, and at least one `releases[]` entry with artifact URL, SHA-256 checksum, and size.

**Pricing models**

| `pricing.model` | Fields | Buyer experience |
|-----------------|--------|------------------|
| `free` | `amount_cents: 0` | CMS installs immediately; hidden entitlement, no visible key |
| `freemium` | Free plan plus paid plans/capabilities | Hidden free entitlement with plan capabilities; paid upgrade uses Stripe |
| `trial` | `trial_days`, optional paid plan | No-card trial entitlement until `trial_ends_at`; no offline extension past trial end |
| `one_time` | `amount_cents` > 0, `currency` | Single Stripe payment; entitlement plus fallback activation key per seat tier |
| `subscription` | `amount_cents` > 0, `currency`, `subscription_interval` (`month` / `year`) | Stripe Billing; entitlement active while subscription active; lapsed subscriptions lose update/install rights after grace |

Example subscription block in offer manifest:

```json
"pricing": {
  "model": "subscription",
  "amount_cents": 999,
  "currency": "USD",
  "subscription_interval": "month"
}
```

Stripe webhooks (`customer.subscription.updated`, `customer.subscription.deleted`) update entitlement/license status. CMS update checks call the marketplace status API and block updates when subscription access lapses.

**Entitlements and seats**

Paid checkout issues an entitlement and a fallback activation key. Free and freemium offers issue hidden entitlements so buyers do not see or copy keys. A signed local entitlement token lets the CMS continue checks during short outages; this is practical deterrence, not perfect DRM.

Single-site tiers allow **one production** activation plus **one staging** activation. Buyers can deactivate an old installation to free that environment seat. Multi-site and unlimited tiers follow the seat limits declared on the offer.

**Partner keys (complimentary entitlements)**

Use **Partner keys** in Provider Studio when you want to give a friend, agency, or press contact access to a **paid or freemium** offer without sending them through checkout:

1. Open **Partner keys** and choose the offer.
2. Optionally set a recipient email, internal note, and expiry date.
3. Generate the key and share it securely — they activate it in Birkly Hub like a purchased key.
4. Revoke the key later if the partnership ends.

Partner keys use the same seat rules as paid purchases. They are audited and count toward a soft monthly limit (default 50 per 30 days; Ops can raise). Pure free catalog offers already install without keys, so partner keys are not issued for those. Prefer partner keys for one-off handoffs; use promo/discount codes when you want a reusable marketing campaign.

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

Stripe Connect splits: buyer pays gross price → Stripe fee → Birkly application fee → remainder to your Connect account. The default Birkly application fee is **15%**; Ops may override the fee for a provider or agreement. Paid third-party offers can only be sold by providers in Stripe-supported connected-account countries during P55.

**Refunds and chargebacks**

- Buyers may request refunds within the default **14-day** window.
- Providers approve or deny third-party refund requests first; Birkly Ops can escalate under marketplace policy.
- A full refund revokes the entitlement and active activation slots.
- Chargebacks put the entitlement on **hold** immediately. If the dispute is lost, the entitlement is revoked; if won, Ops may restore access.

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

- [Marketplace — buyer entitlement and install](marketplace-buyer-guide.md)
- [Plugins](plugins.md) — managing plugins in the CMS admin
- [Updates](updates.md) — updating marketplace-sourced plugins
- [Birkly Marketplace](https://marketplace.birkly.io) — public catalog and provider signup
