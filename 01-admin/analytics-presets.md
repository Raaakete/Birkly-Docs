# Analytics presets

## Summary

**Settings → Analytics** controls how much visitor data Birkly collects for your public site. Saving Minimal+ auto-enables tracking for localhost and your site hosts. Choose one site-wide preset — **Off**, **Minimal**, **Standard**, or **Advanced**. Each option trades insight depth against privacy and compliance burden. Birkly shows the upsides and downsides in the admin; you remain responsible for privacy law in your region.

> **Warning:** This page is product guidance, **not legal advice**. Birkly does not guarantee GDPR (or other) compliance. You remain responsible for privacy law in your region (for example GDPR in the EU/EEA), including consent, disclosure, and retention choices.

## Beginner

### Open Analytics settings

1. Sign in to the Birkly admin with a role that can **manage settings** (usually Admin).
2. Open **Settings** (gear icon or sidebar).
3. Open the **Analytics** tab (or **Settings → Analytics** if your build shows it as its own destination).
4. Pick a preset. Read the upside/downside on each card before saving.
5. Click **Save settings** (global Save at the top of Settings).

If a domain is disabled for tracking, that domain collects nothing even when a site-wide preset is Standard or Advanced.

### Choose a preset

| Preset | What it collects (typical) | Upside | Downside |
|--------|----------------------------|--------|----------|
| **Off** | Nothing | Full privacy; no analytics stored | No visitor insights |
| **Minimal** | Page views by path, coarse referrer host, day buckets; no fingerprinting; IP not stored (or hashed only briefly for a day key); short retention (about 30 days) | Privacy-forward aggregates; often the lightest EU-friendly option | Least detail — totals and top paths only |
| **Standard** | Sessions, device/browser family, UTM, entry/exit, top pages, coarse country; longer retention (about 90 days) | Useful site trends and campaigns | **Visitor consent / banner required**; more compliance duty |
| **Advanced** | Everything in Standard, plus events such as outbound clicks, form submits, and plugin funnel hooks (for example commerce checkout); retention longer / configurable (about 180 days default) | Funnel-ready reports, richer event breakdown, CSV export where available | **Strongest consent and disclosure duty**; most data to govern |

### Consent (Standard and Advanced)

- **Off** — no collection; no consent UI needed for analytics.
- **Minimal** — aimed at cookieless / aggregate-only collection. Birkly does **not** treat a consent banner as required for this preset alone, but **you** still decide what your jurisdiction and counsel require.
- **Standard** and **Advanced** — a visitor-facing **consent / banner hook** is **required**. Wire or enable the public-site consent component so collection only starts after the visitor accepts (or as your banner policy defines). Do not leave Standard+ live without a consent path on the public site.

### What Analytics is not

- Not a hosted Matomo/Google Analytics replacement as a SaaS product.
- Not a legal compliance engine — honest presets and hooks only.
- Not the same as [Commerce analytics](../06-extensibility/commerce-analytics.md) (store orders and ops metrics inside the Commerce plugin).

## Advanced Users

**Site-wide vs domain:** The preset is the site-wide default. Per-domain enable/disable still applies — a domain turned off does not collect.

**Event taxonomy (when Advanced is on):** examples include `page_view`, `form_submit`, `outbound_click`, and plugin events such as `commerce_checkout_started` or `events_rsvp` when those plugins emit them.

**Reports:** The Analytics surface is meant for trends, top pages, referrers, devices, and campaigns — not only a short “last 30 days” stub. Depth depends on the active preset.

**Trust and identity (Standard / Advanced):**

- **Sessions** are the primary anchor in the Overview report (browser `sessionStorage` id).
- **Visitors** are counted from a consent-gated first-party **visitor token** when the visitor accepts analytics; otherwise one visitor per **session per calendar day** — not from raw IP alone.
- **Confirmed bots** are excluded from default totals; **suspected** hits stay in sessions/visitors and appear in the traffic-quality breakdown.
- The Overview **trust strip** shows confidence (low / medium / high), payload coverage (session id, user-agent, visitor token), and metric definitions.
- **Pages / visitor** is hidden when the estimate is unreliable (low confidence or contradictory session vs visitor counts).
- Historical JSON logs are indexed in SQLite (`data/analytics/analytics.db`). Use **Rebuild index** in Settings → Analytics or run `php scripts/analytics-rebuild-index.php` on self-hosted installs after upgrades.

**Retention:** Defaults follow the preset matrix above; Advanced may expose configurable windows. Reducing the preset does not automatically erase historical data already stored — check the Analytics UI for retention and purge options when you change levels.

**Export:** CSV export may appear under Analytics and/or when [Developer mode](developer-mode.md) is on, depending on your build.

**API / storage:** Analytics configuration lives with site settings (not in `project/` HTML). Public-site collection runs through the Birkly client / tracking snippet for registered domains.

## Further reading

- [Settings](settings.md)
- [Developer mode](developer-mode.md)
- [Commerce analytics](../06-extensibility/commerce-analytics.md) — store metrics, not visitor presets
- [Security](../07-operations/security.md)
- [Website integration](../04-integration/website-integration.md)
