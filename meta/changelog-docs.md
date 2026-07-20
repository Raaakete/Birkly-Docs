# Documentation Changelog

Doc-only changes (new topics, restructures, wording fixes) that don’t necessarily match a product release. For product changes, see the main Birkly changelog or release notes.

## Summary

This changelog records **documentation** updates: new pages, reorganized sections, and wording or example improvements. It does not describe Birkly product features or code changes. Use it to see what changed in the docs and when.

## Format

- **YYYY-MM-DD** — Short description. (Optional: file or section.)

---

---

## 2026-07-20 — P29 Collections & entries excellence (P29-M13)

- **New:** `01-admin/entry-editor.md` — sidebar tabs (General, Meta Data, Templating), slug in sidebar only, auto-generate checkbox.
- **New:** `01-admin/collection-editor.md` — Settings tab slug parity with entry editor.
- **Updated:** `02-content/slugs-and-status.md`, `entries.md`, `collections.md` — sidebar slug UX, ID fallback, cross-links.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json` — entry/collection editor topics.

## 2026-07-07 — Phase 10 marketplace go-live (P10-M5)

- **New:** `06-extensibility/marketplace-go-live.md` — fresh install without bundled plugins, official plugins table, grandfathered upgrades.
- **Updated:** `06-extensibility/marketplace-buyer-guide.md` — free official one-click install (no license key), paid checkout flow, refund policy summary.
- **Updated:** `06-extensibility/plugins.md` — official plugins marketplace table; removed bundled-plugins messaging.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json` — marketplace go-live topic.

## 2026-07-07 — Phase 9 Birkly Marketplace (P9-M7)

- **New:** `06-extensibility/marketplace-provider-guide.md` — provider signup, Stripe Connect, offer publishing, QC.
- **New:** `06-extensibility/marketplace-buyer-guide.md` — checkout, license keys, CMS Marketplace tab install/update.
- **Updated:** `06-extensibility/plugins.md` — marketplace links and guide cross-references.
- **Updated:** `CONTENTS_INDEX.md` — marketplace provider and buyer topics.

## 2026-07-06 — Phase 8 reference site & commerce templating (P8-M2 / M6)

- **New:** `03-templating/storefront-patterns.md` — Demo shop/cart/checkout patterns for Commerce fieldtype sites (kekaba reference).
- **New:** `03-templating/events-functions.md` — Events plugin template functions (calendar, list, single event, iCal).
- **Updated:** `06-extensibility/plugins/commerce.md` — Tax, refunds, subscriptions, order automation triggers.
- **Updated:** `CONTENTS_INDEX.md` — storefront + events templating topics.

## 2026-07-04 — Phase 5.7 settings UX, security enforcement & storage (P5.7-M5)

- **Updated:** `01-admin/settings.md` — Global Save UX (single save bar, toast feedback); security settings table (session timeout, lockout, password rules, CSRF enforcement); storage backends (flat-file default, MySQL/PostgreSQL setup, test connection, migrate workflow); tab summaries and deep links.

## 2026-07-03 — Phase 5.6 admin polish, AI knowledge, onboarding & automation (P5.6-M4)

- **New:** `02-content/sub-collections.md` — Admin guide: define sub-collections in schema, manage sub-entries from the entry editor, public submission API, AI/MCP tools, automation triggers.
- **Updated:** `01-admin/help-and-onboarding.md` — Onboarding wizard redesign: progress bar, five steps (welcome, site info, demo content, optional Connect AI, complete), skippable AI step; dashboard checklist trimmed to four essential items (removed media upload and template items).
- **Updated:** `05-automation/triggers.md` — Added Entry trigger type with collection picker and sub-collection filter; sub-entry trigger payload context; manual trigger note; testing guidance.
- **Updated:** `05-automation/automation-overview.md` — Added entry/sub-entry trigger examples; dry-run / test-run semantics (log only, no side effects unless user confirms); sub-collection picker note.
- **Updated:** `CONTENTS_INDEX.md` — Added sub-collections topic to 02-Content section.

## 2026-07-03 — ContentEditor layout studio (P5.5-M5)

- **New:** `02-content/content-editor.md` — Editor field type, tables & grids, layout studio workflow.
- Updated **CONTENTS_INDEX.md** and **field-types.md** related links.

## 2026-06-29 — Phase 4.1 unified AI & Integrations (P4.1-M2-T6 / M6)

- **Updated:** `01-admin/ai-connections.md` — Outbound BYOAI under **Settings → AI & Integrations**; removed MCP provider type; legacy `#ai-connections` deep link.
- **Updated:** `01-admin/mcp-connections.md` — Inbound MCP in unified tab; stdio bridge recommended; remote connector OAuth path; auth modes; shared approval queue.
- **Updated:** `01-admin/ai-overview.md`, `01-admin/settings.md`, `01-admin/ai-approvals.md`, `01-admin/ai-chat-and-actions.md` — unified tab paths and cross-links.
- **Updated:** `meta/glossary.md` — AI connection vs MCP connection terms.

## 2026-06-26 — Phase 4 inbound MCP split (P4-M9)

- **Updated:** `01-admin/mcp-connections.md` — standalone MCP endpoints tab, `settings/mcp_endpoints.json`, migration script, client matrix.
- **Updated:** `01-admin/ai-connections.md` — outbound BYOAI only; API key vs subscription; link to MCP connections.
- **Updated:** `01-admin/ai-chat-and-actions.md` — connection picker in chat header; MCP not in picker.

## 2026-06-25 — Phase 3 docs pack (P3-M14)

- **New:** `00-overview/closed-alpha-guide.md` — tester guide for closed alpha.
- **New:** `01-admin/mcp-connections.md` — per-connection MCP keys, Claude Desktop setup.
- **New:** `02-content/content-editor.md` — ContentEditor fieldtype and blocks (callout, quote, CTA, table, image).
- **New:** `06-extensibility/user-plugin.md` — User Management plugin overview.
- **Updated:** `01-admin/ai-connections.md` — BYOAI, default approval, MCP cross-link.
- **Updated:** `05-automation/automation-overview.md` — automation as deactivatable plugin.
- **Updated:** `01-admin/help-and-onboarding.md` — Help manifest topic list (AI, MCP, automation, user plugin, ContentEditor).
- **Updated:** `manifest.json` and `CONTENTS_INDEX.md` for new topics.

## 2026-06-19 — Phase 2 product sync (P2-M3–M7)

- **01-admin/help-and-onboarding.md** — Onboarding state (`setup_wizard_completed`, skip vs complete, checklist merge).
- **02-content/field-types.md** — ContentEditor (`content-editor`): Visual/HTML tabs, preview CSS, bundled components.
- **04-integration/public-api.md** — Action-based `public.php` API; `list_collections` metadata; bundle/snapshot pointers.
- **04-integration/client-library.md** — `page_bundle.php`, `page_snapshot.php`, `birkly-hydrate.js` batch/snapshot loading.

Aligned with Birkly platform changelog through P2-M7 (`Raaakete/Birkly` `docs/changelog/CHANGELOG-PLATFORM.md`).

## 2025-02-05 (continued)

- **New doc structure:** Replaced Shortcut + Detailed with **Summary** (for all users) + **Beginner** (toggle, plain language for non-technical users) + **Advanced Users** (toggle, technical language). See **DOCS_ARCHITECTURE.md**.
- Updated **build-static.js** to render Summary always visible and Beginner / Advanced Users as `<details>` toggles.
- Added CSS for `.doc-summary`, `.doc-toggle`, `.doc-toggle-inner`, `.doc-related`.
- Converted to new structure: **00-overview** (what-is-birkly, what-is-a-cms, getting-started), **01-admin** (all), **02-content** (collections, entries, field-types, slugs-and-status), **03-templating** (all 6), **04-integration** (all 4), **05-automation** (all 4), **06-extensibility** (all 4), **07-operations** (all 4), **meta** (glossary, audience-matrix, changelog-docs).
- Extended all topic docs with detailed **Beginner** and **Advanced Users** content and **examples** throughout.
- Updated **meta/audience-matrix.md** for Summary / Beginner / Advanced Users.
- Expanded **meta/glossary.md** with more terms, examples, and cross-links.

## 2025-02-05

- Initial creation of **Birkly Docs** as single source of truth.
- Added **DOCS_ARCHITECTURE.md**: folder structure, consumption (CMS, website, dev portal).
- Added **README.md** and **CONTENTS_INDEX.md**.
- Added topic folders and all topic files (initially with Shortcut + Detailed; later updated to Summary + Beginner + Advanced Users for key docs).

## Related

- [DOCS_ARCHITECTURE](../DOCS_ARCHITECTURE.md)
- [CONTENTS_INDEX](../CONTENTS_INDEX.md)
- [Audience matrix](audience-matrix.md)
