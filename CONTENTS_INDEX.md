# Birkly Docs — Contents Index

This index lists every documentation topic and its file path. Use it for navigation, tooling, or to ensure nothing is missing when syncing to the CMS or website.

## 00 — Overview

| Topic | File | Description |
|-------|------|-------------|
| What is Birkly | `00-overview/what-is-birkly.md` | Product overview and key differentiators |
| What is a CMS | `00-overview/what-is-a-cms.md` | CMS concept for non-technical readers |
| Getting started | `00-overview/getting-started.md` | First steps: login, project name, first collection |
| Closed alpha guide | `00-overview/closed-alpha-guide.md` | Invited tester guide: feedback, scope, doc links |
| Alpha legal and feedback | `00-overview/alpha-legal.md` | Terms, privacy, feedback widget (P15) |

## 01 — Admin

| Topic | File | Description |
|-------|------|-------------|
| Dashboard | `01-admin/dashboard.md` | Admin home, widgets, at-a-glance info |
| Responsive dashboard | `01-admin/admin-responsive-dashboard.md` | P31 widget grid, plugin widgets, responsive behavior, and Widget API v2 |
| Admin chrome & action zones | `01-admin/admin-chrome-action-zones.md` | P32 main-actions-bar, sticky save, icon actions, search, trash, redirects |
| Content overview | `01-admin/content-overview.md` | Content area: collections and entries |
| Entry editor | `01-admin/entry-editor.md` | Sidebar tabs, slug auto-generate, reserved fields |
| Collection editor | `01-admin/collection-editor.md` | Field schema, Settings tab slug parity |
| Media library | `01-admin/media-library.md` | Upload, organize, use media in content |
| Settings | `01-admin/settings.md` | General, branding, security, monitoring, Analytics, System tabs |
| Analytics presets | `01-admin/analytics-presets.md` | Off / Minimal / Standard / Advanced visitor analytics; consent for Standard+ |
| Developer mode | `01-admin/developer-mode.md` | Off by default; template/site-pack export; system info and DX tools |
| Project Git sync | `01-admin/project-git-sync.md` | Settings → Project → Git: push/pull `project/` to GitHub/GitLab/generic; project git vs. site packs |
| Roles and permissions | `01-admin/roles-and-permissions.md` | User roles and what they can do |
| Account | `01-admin/account.md` | Profile, password, 2FA, cloud account link |
| Admin appearance | `01-admin/admin-appearance.md` | Light/dark/system theme, responsive admin (P15) |
| Admin design system | `01-admin/design-system.md` | Short orientation: where tokens, helpers, and components live; icons and theming |
| Admin design language | `01-admin/admin-design-language.md` | Full build kit — token reference, `u-*` helpers, component catalog, page chrome, dark mode |
| Help and onboarding | `01-admin/help-and-onboarding.md` | Live Birkly-Docs Help, onboarding wizard |
| AI overview | `01-admin/ai-overview.md` | What the AI system is and where to find it |
| AI connections | `01-admin/ai-connections.md` | Outbound BYOAI providers (OpenAI, Ollama, etc.) |
| MCP connections | `01-admin/mcp-connections.md` | Inbound MCP endpoints (stdio bridge, OAuth) |
| AI site builder | `01-admin/ai-site-builder.md` | MCP tools for project/ HTML, CSS, JS (P38) |
| AI chat and actions | `01-admin/ai-chat-and-actions.md` | Using the chat and what the AI can do |
| AI approvals | `01-admin/ai-approvals.md` | Approval queue for AI write actions |
| Connections | `01-admin/connections.md` | Settings → Connections: email, channels, credentials, webhooks, health |
| Connections provider recipes | `01-admin/connections-provider-recipes.md` | SMTP, Resend, Postmark, SES, Mailgun setup |
| Migrate from Automation Setup email | `01-admin/connections-migration.md` | Move Automation SMTP into Connections |
| Connections MCP rules | `01-admin/connections-mcp-rules.md` | Agent read, approval-gated write, no secret echo |
| Discovery | `01-admin/discovery.md` | SEO, Agent Guide, WebMCP packs — public discoverability hub |
| Site URL Map | `01-admin/site-url-map.md` | Per-URL SEO overrides in Discovery → SEO |
| Activity feed | `01-admin/activity.md` | Auditable timeline of CMS events |
| Admin notifications | `01-admin/notifications.md` | Topbar bell — unread, seen, read states |

## 02 — Content

| Topic | File | Description |
|-------|------|-------------|
| Content model overview | `02-content/content-model-overview.md` | Start here: collections vs entries, decision tree, examples |
| Collections | `02-content/collections.md` | Content types, fields, entry method |
| Site elements pattern | `02-content/site-elements-pattern.md` | Header/footer chrome via site-elements + birkly-region |
| Dynamic items field | `02-content/dynamic-items-field.md` | Add Block fieldtype, repeating blocks in entries |
| Collection groups | `02-content/collection-groups.md` | Nested group tree, groups.json, API and templating |
| Sub-Collections | `02-content/sub-collections.md` | Child content types attached to entries (comments, reviews, etc.) |
| Entries | `02-content/entries.md` | Creating and editing content items |
| Field types | `02-content/field-types.md` | All field types (Text, Editor, Media, etc.) |
| Content editor | `02-content/content-editor.md` | Rich text editor, tables, CSS grids, layout studio |
| Slugs and status | `02-content/slugs-and-status.md` | URL slug, draft vs published |
| ContentEditor | `02-content/content-editor.md` | Rich text fieldtype, blocks, HTML round-trip |
| Agent Guide | `02-content/agent-guide.md` | Structured context for AI systems — overview & doc map |
| Agent Guide — getting started | `02-content/agent-guide-getting-started.md` | Tutorial: first publish in ~30 minutes |
| Agent Guide — workflows | `02-content/agent-guide-workflows.md` | Tab-by-tab admin workflows (sources-first) |
| Agent Guide — claims & links | `02-content/agent-guide-claims-evidence-and-links.md` | Claims, evidence, cross-links, marketplace URLs |
| Agent Guide — AI Assist | `02-content/agent-guide-ai-assist.md` | Copilot, Guide Studio, field Generate |
| Agent Guide — best practices | `02-content/agent-guide-best-practices.md` | Quality, governance, operational cadence |
| Agent Guide — data model | `02-content/agent-guide-data-model.md` | Schema, storage, publish pipeline |

## 03 — Templating

| Topic | File | Description |
|-------|------|-------------|
| Templating overview | `03-templating/templating-overview.md` | Mental model, learning path, Light/Shadow |
| Canonical syntax | `03-templating/canonical-syntax.md` | SSOT pointer + phantoms (aligns to TEMPLATE_LANGUAGE_SPEC) |
| Client setup | `03-templating/client-setup.md` | `birkly-client.js`, `data-cms-url`, SSR vs client |
| Variables and output | `03-templating/variables-and-output.md` | `{title}` vs `{'field'}`, system variables |
| Loops and lists | `03-templating/loops-and-lists.md` | `with`, `ordered by`, `limit N`; no phantom sort= |
| Detail pages & URL context | `03-templating/detail-pages-and-url-context.md` | `.current`, list→detail, anti-patterns |
| Conditionals | `03-templating/conditionals.md` | Existence, has, comparisons, or/else |
| From…get / existence | `03-templating/from-get-and-existence.md` | `{from … get …}`, exist checks |
| Sub-collections in templates | `03-templating/sub-collections-in-templates.md` | `of 'blog'.current` |
| Dates and formatting | `03-templating/dates-and-formatting.md` | `{created_at format "…"}` |
| Media in templates | `03-templating/media-in-templates.md` | Image fields, empty guards (no `{ media }` helper) |
| Public forms templating | `03-templating/public-forms-templating.md` | `{entry for}`, known-bad fetch patterns |
| Multilingual templating | `03-templating/multilingual-templating.md` | Language switcher, `{current.language}` |
| Web components (templating) | `03-templating/web-components.md` | Regions, `ordered="newest"`, enhance-only |
| Plugin language extensions | `03-templating/plugin-language-extensions.md` | Plugin helpers vs core cascade |
| Commerce functions | `03-templating/commerce-functions.md` | Commerce plugin template functions |
| Events functions | `03-templating/events-functions.md` | Events plugin template functions |
| Storefront and events patterns | `03-templating/storefront-patterns.md` | Shop + events page recipes |
| Worked site walkthrough | `03-templating/worked-site-walkthrough.md` | End-to-end tutorial |
| Cheat sheet | `03-templating/cheat-sheet.md` | Quick reference + phantoms |
| Reference projects | `03-templating/reference-projects.md` | Six starter sites; live client only |
| Production optimization | `03-templating/production-optimization.md` | Optional hydrate/snapshot/bake (advanced) |

## 04 — Studio

| Topic | File | Description |
|-------|------|-------------|
| Studio visual builder | `04-studio/getting-started.md` | Visual site builder, SSR publish, export ZIP |
| Studio production builder | `04-studio/production-builder.md` | Design canvas, live preview, engine v2, CSS panel, presets (P25) |

## 04 — Integration

| Topic | File | Description |
|-------|------|-------------|
| Choose your stack | `04-integration/choose-your-stack.md` | Decision hub: HTML, web components, SPA, SSR |
| Website integration | `04-integration/website-integration.md` | Connecting a site to Birkly |
| Web components | `04-integration/web-components.md` | `<birkly-region>`, `data-birkly-region`, enhance-only |
| SPA (React / Vue) | `04-integration/spa-react-vue.md` | Public API / fetch; no template tags in JSX |
| SSR and build-time | `04-integration/ssr-and-build-time.md` | PHP, Astro, Next + page_bundle |
| Client library | `04-integration/client-library.md` | Script tag, processTemplates, events, components |
| Public API | `04-integration/public-api.md` | Reading content via API |
| Public forms | `04-integration/public-forms.md` | Public submission and secure forms |
| Agent Guide public API | `04-integration/agent-guide-public-api.md` | Published guide HTTP endpoints, views, graph |
| Agent Guide MCP & agents | `04-integration/agent-guide-mcp-and-agents.md` | MCP tools, resources, agent patterns |
| Website tools (WebMCP) | `04-integration/webmcp-tools.md` | Public-site WebMCP tool catalog (off by default) |
| AI on localhost | `04-integration/ai-on-localhost.md` | Built-in/Ollama vs remote connectors; mcp-bridge and tunnel recipes |
| Connections API reference | `04-integration/connections-api-reference.md` | birkly_send_mail, birkly_notify, credentials, webhooks |

## 05 — Automation

| Topic | File | Description |
|-------|------|-------------|
| Automation overview | `05-automation/automation-overview.md` | Workflows, triggers, actions |
| Triggers | `05-automation/triggers.md` | Scheduled and webhook triggers |
| Commerce recipe pack | `05-automation/commerce-recipes.md` | Import post-purchase, dunning, low-stock, shipped (P54 P3) |
| Conditions and actions | `05-automation/conditions-and-actions.md` | When to run, what to do |
| Webhooks | `05-automation/webhooks.md` | Outgoing webhooks and usage |

## 06 — Extensibility

| Topic | File | Description |
|-------|------|-------------|
| Plugins | `06-extensibility/plugins.md` | Installing and managing plugins |
| Marketplace go-live | `06-extensibility/marketplace-go-live.md` | Fresh install, paid/free official plugins |
| Marketplace — provider guide | `06-extensibility/marketplace-provider-guide.md` | Publishing offers, subscription pricing |
| Marketplace — buyer guide | `06-extensibility/marketplace-buyer-guide.md` | Paid official, entitlements, subscriptions, install |
| Commerce plugin | `06-extensibility/plugins/commerce.md` | Commerce v2 0→1 complete (1.0.29 / P54 P3) |
| Commerce hybrid cart | `06-extensibility/commerce-hybrid-cart.md` | Mixed ship+deliver+register+subscribe / split checkout |
| Commerce store kit | `06-extensibility/commerce-store-kit.md` | MCP/Agent store kit (`commerce-store-kit`) |
| Commerce customers | `06-extensibility/commerce-customers.md` | Email-keyed profiles, CSV import, timeline (P54 P1) |
| Commerce promotions | `06-extensibility/commerce-promotions.md` | Discounts v2: limits, dates, free shipping, stacking |
| Commerce gift cards and quotes | `06-extensibility/commerce-gift-cards-quotes.md` | Admin + sellable gift cards, draft order editor |
| Commerce tax | `06-extensibility/commerce-tax.md` | Manual / Stripe Tax providers, B2B reverse charge, tax_lines |
| Commerce shipping rates | `06-extensibility/commerce-shipping.md` | Manual zones / EasyPost live rates, weight, fallback |
| Commerce fulfillment | `06-extensibility/commerce-fulfillment.md` | Manual / EasyPost adapters, packing slips, tracking webhook |
| Commerce subscriptions | `06-extensibility/commerce-subscriptions.md` | Upgrades, dunning, retry |
| Commerce analytics | `06-extensibility/commerce-analytics.md` | Dashboard cohorts, SLA, low-stock, CSV export |
| Commerce migration wizard | `06-extensibility/commerce-migration-wizard.md` | Shop/Events → Commerce import |
| Shopify cutover playbook | `06-extensibility/commerce-shopify-cutover.md` | One-time Shopify → Birkly transfer (P54 P1-M2) |
| Commerce live import | `06-extensibility/commerce-live-import.md` | Shopify/Woo/Etsy/Square API sync |
| Commerce multi-currency | `06-extensibility/commerce-multi-currency.md` | Site default + per-option currency (P14) |
| Commerce inventory webhooks | `06-extensibility/commerce-inventory-webhooks.md` | Shopify/Woo real-time stock (P14) |
| Commerce warehouse stock | `06-extensibility/commerce-warehouse-stock.md` | SKU warehouse, decrement on pay (P14) |
| User signup and membership | `06-extensibility/user-signup-membership.md` | Signup flows, membership products, tier lifecycle |
| Membership club depth (P80) | `06-extensibility/membership-club-depth.md` | Onboarding, mentions, digests, moderation, wishes, automation hooks |
| Commerce membership (legacy) | `06-extensibility/commerce-membership.md` | Redirect to User-owned membership guide |
| Plugin security denylist | `06-extensibility/plugin-security-denylist.md` | Denylist collections, resources, spaces |
| Plugin scaffolding CLI | `06-extensibility/scaffold-plugin-cli.md` | `scaffold-plugin.php` developer CLI (P15) |
| Commerce CSV import | `06-extensibility/commerce-import.md` | CSV import wizard and history |
| User plugin | `06-extensibility/user-plugin.md` | User Management plugin: registration, permissions |
| Payments plugin | `06-extensibility/payments-plugin.md` | Connection hub: 8 providers, webhooks, activity log |
| Payment shelf API | `06-extensibility/payment-shelf-api.md` | Developer guide: `payment_shelf` for consumer plugins |
| Templates (pages) | `06-extensibility/templates-pages.md` | Page templates and routing |
| Audit log and activity | `06-extensibility/audit-log-and-activity.md` | Who did what, when |
| Updates | `06-extensibility/updates.md` | Updating Birkly and extensions |

## 06 — Plugin economy

| Topic | File | Description |
|-------|------|-------------|
| Overview | `06-plugin-economy/overview.md` | CMS vs marketplace vs Ops; thin client model |
| For site owners | `06-plugin-economy/for-site-owners.md` | Browse, license, install, consent, updates |
| For providers | `06-plugin-economy/for-providers.md` | Provider Studio, packaging, QC, payouts (summary) |
| Plugin development | `06-plugin-economy/plugin-development.md` | `plugin.json`, hooks, permissions, `data_access` |
| Plugin admin styling | `06-plugin-economy/plugin-admin-styling.md` | Adoption tiers, public class contract, plugin CSS rules, fieldtype contract |
| Plugin navigation icon | `06-plugin-economy/plugin-navigation-icon.md` | `navigation.icon` registry names and inline SVG fallback (P41) |
| Hub, themes, and site packs | `06-plugin-economy/theme-and-template-packs.md` | Hub naming, site packs (`template_pack`), Upload pack, starters, `project/` |
| Security and review | `06-plugin-economy/security-and-review.md` | Permission consent, QC tiers, supply chain |
| Official plugins | `06-plugin-economy/official-plugins.md` | Birkly-maintained vs third-party offers |
| API reference | `06-plugin-economy/api-reference.md` | Registry, embed, Ops starter API |

## 07 — Operations

| Topic | File | Description |
|-------|------|-------------|
| Deployment | `07-operations/deployment.md` | Hosting, server, env |
| Hosting on Dokploy | `07-operations/dokploy-hosting.md` | CMS vs public URLs, `hosting.json`, two-domain Docker |
| Production deploy checklist | `07-operations/production-deploy-checklist.md` | CMS, marketplace, client site smoke |
| Monitoring and health alerts | `07-operations/monitoring-alerts.md` | Health alert email/webhook (P13) |
| Security | `07-operations/security.md` | Hardening, HTTPS, auth |
| Backup and restore | `07-operations/backup-and-restore.md` | Content and media backup |
| Troubleshooting | `07-operations/troubleshooting.md` | Common issues and fixes |

## Meta (maintainers)

| Topic | File | Description |
|-------|------|-------------|
| Glossary | `meta/glossary.md` | Term definitions |
| Audience matrix | `meta/audience-matrix.md` | Which topics for which audience |
| Changelog (docs) | `meta/changelog-docs.md` | Doc-only changes |

## CMS Help manifest

| File | Purpose |
|------|---------|
| `help-manifest.json` | Public topic index for CMS live Help fetch (P15-M3) |
| `manifest.json` | Full navigation manifest for static site and tooling |
