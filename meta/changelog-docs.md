# Documentation Changelog

Doc-only changes (new topics, restructures, wording fixes) that don’t necessarily match a product release. For product changes, see the main Birkly changelog or release notes.

## Summary

This changelog records **documentation** updates: new pages, reorganized sections, and wording or example improvements. It does not describe Birkly product features or code changes. Use it to see what changed in the docs and when.

## Format

- **YYYY-MM-DD** — Short description. (Optional: file or section.)

---

---

---

## 2026-08-02 — Shopify cutover playbook (P54 P1-M2)

- **New:** `06-extensibility/commerce-shopify-cutover.md` — one-time Shopify → Birkly cutover (not perpetual sync); steps 1–3 detailed; steps 4–11 checklist outline; dry-run/rollback; archived orders do not re-fulfill; customers without passwords.
- **Updated:** `plugins/commerce.md`, `commerce-plugin.md`, `commerce-live-import.md`, `commerce-import.md`, `commerce-migration-wizard.md` — cross-links and Import & migrate wording.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`, `help-manifest.json`.

---

## 2026-08-02 — Hub & site packs (P53-M12)

- **Rewritten:** `06-plugin-economy/theme-and-template-packs.md` — Hub naming, site packs (`template_pack` → `content/collections/` + `project/`, never `themes/`), Upload pack, required-plugins confirm, demo opt-in, safe updates, provider publish.
- **Updated (buyer-facing Hub label):** `for-site-owners.md`, `marketplace-buyer-guide.md`, `marketplace-go-live.md`, `plugins.md`, `overview.md`, `official-plugins.md`.
- **Updated (providers):** `for-providers.md`, `marketplace-provider-guide.md` — site pack offer type and pack ZIP layout.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`, `help-manifest.json` labels/keywords.

---

## 2026-07-29 — Content model documentation hub (P50)

- **New:** `02-content/content-model-overview.md` — decision tree, blog/site-elements/forms examples, best practices.
- **New:** `02-content/dynamic-items-field.md` — Add Block workflow, multilang, site-elements use case.
- **New:** `02-content/site-elements-pattern.md` — header/footer pattern with `<birkly-region>`.
- **Expanded:** `collections.md`, `entries.md`, `sub-collections.md` — cross-links to overview and related topics.
- **Updated:** `help-manifest.json` — topics `content-model-overview`, `collections`, `dynamic-items-field`, `site-elements-pattern`; fixed `entry-editor` path.
- **Updated:** `CONTENTS_INDEX.md`.

---

## 2026-07-27 — Agent Guide documentation (rename from AI Presence)

- **Renamed & rewritten:** All Agent Guide docs — product name **Agent Guide**, neutral language, sources-of-truth-first workflow.
- **Renamed:** `02-content/ai-presence*.md` → `02-content/agent-guide*.md` (7 files).
- **Renamed:** `04-integration/ai-presence-*.md` → `04-integration/agent-guide-*.md` (2 files).
- **Updated:** Schema references to `agent_guide.v1`, well-known path `/.well-known/agent-guide.json`, MCP tools `get_agent_guide_context`, admin URL `?page=agent-guide`.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`, `help-manifest.json`, `meta/glossary.md`.

---

## 2026-07-27 — AI Presence documentation (full set)

- **Rewritten:** `02-content/ai-presence.md` — overview hub, mental model, doc map, FAQ.
- **New:** `02-content/ai-presence-getting-started.md` — step-by-step first publish tutorial.
- **New:** `02-content/ai-presence-workflows.md` — tab-by-tab admin workflows.
- **New:** `02-content/ai-presence-claims-evidence-and-links.md` — claims, evidence, cross-links, marketplace examples.
- **New:** `02-content/ai-presence-ai-assist.md` — Copilot, Brand Studio, field Generate, link suggestions.
- **New:** `02-content/ai-presence-best-practices.md` — governance, quality, operational cadence.
- **New:** `02-content/ai-presence-data-model.md` — schema, storage, publish pipeline, completeness.
- **Expanded:** `04-integration/ai-presence-public-api.md` — views, graph, examples, caching, integration.
- **New:** `04-integration/ai-presence-mcp-and-agents.md` — MCP tools, resources, agent patterns.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`, `help-manifest.json`.

---

## 2026-07-26 — P45 templating stacks (M8–M10)

- **New:** `04-integration/choose-your-stack.md` — decision hub for HTML, web components, SPA, SSR.
- **New:** `04-integration/web-components.md`, `03-templating/web-components.md` — `<birkly-region>`, `data-birkly-region`, Light vs Shadow, enhance-only.
- **New:** `04-integration/spa-react-vue.md` — Public API / `getEntryBySlug`; no `{for each}` in JSX.
- **New:** `04-integration/ssr-and-build-time.md` — PHP, Astro, Next + `page_bundle.php` snippets.
- **Updated:** `03-templating/canonical-syntax.md` — `data-birkly-region` supported; region component pointer.
- **Updated:** `04-integration/website-integration.md`, `04-integration/client-library.md` — stack hub, `processTemplates`, events, `birkly-components.js`.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`, `help-manifest.json`.

---

## 2026-07-25 — P43 configurable hosting URLs (P43-M9)

- **Updated:** `07-operations/dokploy-hosting.md` — CMS URL vs public site URL, `settings/hosting.json`, Dokploy Internal Path `/`, two-domain example (`cms.birkly.cloud` + `birkly.cloud`), no `cms.` subdomain requirement.
- **Updated:** `07-operations/deployment.md` — Hosting settings instead of `cms.` convention; cross-links.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`.

---

## 2026-07-25 — P41 plugin navigation icon and admin design system (P41-M12, P41-M13)

- **New:** `06-plugin-economy/plugin-navigation-icon.md` — `navigation.icon` registry names, inline SVG fallback, `core/icons.php` and `admin/assets/icons/`.
- **New:** `01-admin/design-system.md` — mint primary tokens, neutral scale, `birkly_icon` / `Birkly.icon`, dark mode, `.card`, `.empty-state`, `.status-badge`.
- **Updated:** `06-plugin-economy/plugin-development.md`, `06-extensibility/plugins.md`, `01-admin/admin-appearance.md` — cross-links.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`, `README.md`.

---

- **New:** `02-content/collection-groups.md` — nested group tree (`groups.json`), max depth 3, public API and templating overview.
- **Updated:** `03-templating/loops-and-lists.md` — `{for each group in collection_groups}`, nested `group.children`, collection handle loops.
- **Updated:** `03-templating/canonical-syntax.md` — collection groups loop example.
- **Updated:** `04-integration/public-api.md` — `list_collection_groups` action and page bundle request type.
- **Updated:** `04-integration/client-library.md` — page bundle prefetch for `collection_groups`.
- **Updated:** `02-content/collections.md`, `01-admin/content-overview.md` — cross-links and group overview UX.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`, `help-manifest.json` — collection groups topic.

---

## 2026-07-24 — P36 plugin economy curriculum (P36-M16)

- **New:** `06-plugin-economy/` — eight-page curriculum: overview, site owners, providers, plugin development, themes and template packs, security and review, official plugins, API reference.
- **Updated:** `manifest.json`, `CONTENTS_INDEX.md`, `help-manifest.json` — Plugin economy navigation and Help search entries.
- **Updated:** `06-extensibility/plugins.md` — cross-links to plugin economy section.

---

## 2026-07-21 — P31 responsive dashboard documentation prepared (P31-M17)

- **New:** `01-admin/admin-responsive-dashboard.md` — responsive widget grid, core and plugin widgets, Widget API v2, and dashboard behavior.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`, and `help-manifest.json` — dashboard guide navigation and Help search entry.

---

## 2026-07-20 — P29 Collections & entries excellence (P29-M13)

- **New:** `01-admin/entry-editor.md` — sidebar tabs (General, Meta Data, Templating), slug in sidebar only, auto-generate checkbox.
- **New:** `01-admin/collection-editor.md` — Settings tab slug parity with entry editor.
- **Updated:** `02-content/slugs-and-status.md`, `entries.md`, `collections.md` — sidebar slug UX, ID fallback, cross-links.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json` — entry/collection editor topics.

---

## 2026-07-08 — Phase 20 reference projects & production path (P20-M11)

- **New:** `03-templating/reference-projects.md` — six starter sites (blog, portfolio, yoga, coffee, social, influencer); live `birkly-client.js` only; `scripts/install-reference-project.sh`.
- **New:** `03-templating/production-optimization.md` — hydrate/snapshot/bake as optional advanced path; default live client (mirrored from Birkly `docs/advanced/production-optimization.md`).
- **Updated:** `03-templating/templating-overview.md` — Related links to reference projects and production optimization.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json` — new templating entries.

## 2026-07-07 — Phase 16–19 platform sync (P16-M8 / P17-M6 / P18-M8 / P19-M7)

- **Updated:** `01-admin/help-and-onboarding.md` — START_HERE first-run; wizard v2 (install path, use case, marketplace hint, optional BYOAI mini-wizard with skip always visible); dashboard checklist v2 (essential only; Connect AI only when wizard AI step skipped) (P19).
- **Updated:** `00-overview/getting-started.md` — Step 0: extract zip, open START_HERE.html before admin login; wizard v2 and checklist v2 cross-ref (P19-M7).

## 2026-07-07 — Phase 13–15 platform sync (P13-M7 / P14-M6 / P15-M7)

- **New:** `00-overview/alpha-legal.md` — closed-alpha terms, privacy, feedback (P15-M4).
- **New:** `01-admin/admin-appearance.md` — light/dark/system theme, responsive admin (P15-M1).
- **New:** `07-operations/monitoring-alerts.md` — Settings → Monitoring, health alert email/webhook (P13-M4).
- **New:** `06-extensibility/commerce-multi-currency.md` — site default + per–purchase-option currency (P14-M1).
- **New:** `06-extensibility/commerce-inventory-webhooks.md` — Shopify/Woo HMAC webhooks (P14-M2).
- **New:** `06-extensibility/commerce-warehouse-stock.md` — SKU warehouse, pay/refund stock (P14-M3).
- **New:** `06-extensibility/scaffold-plugin-cli.md` — `scripts/scaffold-plugin.php` (P15-M5).
- **New:** `help-manifest.json` — public CMS Help manifest for live Birkly-Docs fetch (P15-M3).
- **Updated:** `01-admin/account.md` — optional Birkly cloud account link (P13-M1).
- **Updated:** `01-admin/help-and-onboarding.md` — live manifest + offline snapshot fallback (P15-M3).
- **Updated:** `01-admin/settings.md` — Monitoring tab, denylist spaces cross-link.
- **Updated:** `00-overview/closed-alpha-guide.md` — P13–P15 alpha scope, marketplace, commerce, theme.
- **Updated:** `06-extensibility/marketplace-buyer-guide.md` — paid official, subscription licenses (P13-M2/M3).
- **Updated:** `06-extensibility/marketplace-go-live.md` — paid official plugins table.
- **Updated:** `06-extensibility/marketplace-provider-guide.md` — subscription pricing in manifest.
- **Updated:** `06-extensibility/commerce-live-import.md` — Etsy/Square adapters, webhook cross-ref.
- **Updated:** `06-extensibility/plugin-security-denylist.md` — `deny_spaces` enforcement (P14-M5).
- **Updated:** `06-extensibility/plugins/commerce.md` — P14 admin tabs and guide links.
- **Updated:** `07-operations/production-deploy-checklist.md` — monitoring alerts step.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`, `help-manifest.json`.

## 2026-07-07 — Phase 11–12 commerce and ecosystem docs (P11-M7 / P12-M7)

- **New:** `06-extensibility/commerce-subscriptions.md` — plan upgrades, dunning, automation triggers, retry.
- **New:** `06-extensibility/commerce-gift-cards-quotes.md` — issue/redeem gift cards, B2B quote accept flow.
- **New:** `06-extensibility/commerce-analytics.md` — revenue summary, top products, CSV export, dashboard widget.
- **New:** `06-extensibility/commerce-migration-wizard.md` — Shop/Events → Commerce fieldtype import.
- **New:** `06-extensibility/commerce-live-import.md` — Shopify/WooCommerce REST API sync (P12).
- **New:** `06-extensibility/commerce-membership.md` — purchase mappings, tier grant, PostPurchaseRouter.
- **New:** `06-extensibility/plugin-security-denylist.md` — Settings → Security denylist enforcement.
- **New:** `07-operations/production-deploy-checklist.md` — CMS, marketplace, kekaba smoke and human steps.
- **Updated:** `06-extensibility/plugins/commerce.md` — P11/P12 admin tabs and guide links.
- **Updated:** `06-extensibility/commerce-import.md` — import wizard steps, live import cross-link.
- **Updated:** `06-extensibility/commerce-coexistence.md` — migration wizard path.
- **Updated:** `06-extensibility/marketplace-provider-guide.md` — GitHub App connect, provider webhooks, official CI publish.
- **Updated:** `01-admin/settings.md` — denylist detail and link.
- **Updated:** `CONTENTS_INDEX.md`, `manifest.json`.

---

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
