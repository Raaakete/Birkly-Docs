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
| Content overview | `01-admin/content-overview.md` | Content area: collections and entries |
| Media library | `01-admin/media-library.md` | Upload, organize, use media in content |
| Settings | `01-admin/settings.md` | General, branding, security, monitoring tab |
| Roles and permissions | `01-admin/roles-and-permissions.md` | User roles and what they can do |
| Account | `01-admin/account.md` | Profile, password, 2FA, cloud account link |
| Admin appearance | `01-admin/admin-appearance.md` | Light/dark/system theme, responsive admin (P15) |
| Help and onboarding | `01-admin/help-and-onboarding.md` | Live Birkly-Docs Help, onboarding wizard |
| AI overview | `01-admin/ai-overview.md` | What the AI system is and where to find it |
| AI connections | `01-admin/ai-connections.md` | Outbound BYOAI providers (OpenAI, Ollama, etc.) |
| MCP connections | `01-admin/mcp-connections.md` | Inbound MCP endpoints (stdio bridge, OAuth) |
| AI chat and actions | `01-admin/ai-chat-and-actions.md` | Using the chat and what the AI can do |
| AI approvals | `01-admin/ai-approvals.md` | Approval queue for AI write actions |

## 02 — Content

| Topic | File | Description |
|-------|------|-------------|
| Collections | `02-content/collections.md` | Content types, fields, entry method |
| Sub-Collections | `02-content/sub-collections.md` | Child content types attached to entries (comments, reviews, etc.) |
| Entries | `02-content/entries.md` | Creating and editing content items |
| Field types | `02-content/field-types.md` | All field types (Text, Editor, Media, etc.) |
| Content editor | `02-content/content-editor.md` | Rich text editor, tables, CSS grids, layout studio |
| Slugs and status | `02-content/slugs-and-status.md` | URL slug, draft vs published |
| ContentEditor | `02-content/content-editor.md` | Rich text fieldtype, blocks, HTML round-trip |

## 03 — Templating

| Topic | File | Description |
|-------|------|-------------|
| Templating overview | `03-templating/templating-overview.md` | How templates and the client work |
| Variables and output | `03-templating/variables-and-output.md` | `{ variable }`, safe output |
| Loops and lists | `03-templating/loops-and-lists.md` | `{for each entry in 'collection'}` |
| Conditionals | `03-templating/conditionals.md` | `{if}`, `{endif}`, “has” checks |
| Dates and formatting | `03-templating/dates-and-formatting.md` | Date formats in templates |
| Media in templates | `03-templating/media-in-templates.md` | `{ media }` and image options |
| Commerce functions | `03-templating/commerce-functions.md` | Commerce plugin template functions (cart, buy URL) |
| Reference projects | `03-templating/reference-projects.md` | Six starter sites; live client only; install script |
| Production optimization | `03-templating/production-optimization.md` | Optional hydrate/snapshot/bake (advanced) |

## 04 — Studio

| Topic | File | Description |
|-------|------|-------------|
| Studio visual builder | `04-studio/getting-started.md` | Visual site builder, SSR publish, export ZIP |

## 04 — Integration

| Topic | File | Description |
|-------|------|-------------|
| Website integration | `04-integration/website-integration.md` | Connecting a site to Birkly |
| Client library | `04-integration/client-library.md` | Script tag, options, behaviour |
| Public API | `04-integration/public-api.md` | Reading content via API |
| Public forms | `04-integration/public-forms.md` | Public submission and secure forms |

## 05 — Automation

| Topic | File | Description |
|-------|------|-------------|
| Automation overview | `05-automation/automation-overview.md` | Workflows, triggers, actions |
| Triggers | `05-automation/triggers.md` | Scheduled and webhook triggers |
| Conditions and actions | `05-automation/conditions-and-actions.md` | When to run, what to do |
| Webhooks | `05-automation/webhooks.md` | Outgoing webhooks and usage |

## 06 — Extensibility

| Topic | File | Description |
|-------|------|-------------|
| Plugins | `06-extensibility/plugins.md` | Installing and managing plugins |
| Marketplace go-live | `06-extensibility/marketplace-go-live.md` | Fresh install, paid/free official plugins |
| Marketplace — provider guide | `06-extensibility/marketplace-provider-guide.md` | Publishing offers, subscription pricing |
| Marketplace — buyer guide | `06-extensibility/marketplace-buyer-guide.md` | Paid official, subscription licenses, install |
| Commerce plugin | `06-extensibility/plugins/commerce.md` | Commerce v2: fulfillment, purchase_options, variants |
| Commerce subscriptions | `06-extensibility/commerce-subscriptions.md` | Upgrades, dunning, retry |
| Commerce gift cards and quotes | `06-extensibility/commerce-gift-cards-quotes.md` | Store credit, B2B quote workflow |
| Commerce analytics | `06-extensibility/commerce-analytics.md` | Revenue widget, CSV export |
| Commerce migration wizard | `06-extensibility/commerce-migration-wizard.md` | Shop/Events → Commerce import |
| Commerce live import | `06-extensibility/commerce-live-import.md` | Shopify/Woo/Etsy/Square API sync |
| Commerce multi-currency | `06-extensibility/commerce-multi-currency.md` | Site default + per-option currency (P14) |
| Commerce inventory webhooks | `06-extensibility/commerce-inventory-webhooks.md` | Shopify/Woo real-time stock (P14) |
| Commerce warehouse stock | `06-extensibility/commerce-warehouse-stock.md` | SKU warehouse, decrement on pay (P14) |
| Commerce membership wiring | `06-extensibility/commerce-membership.md` | Purchase → user tier mapping |
| Plugin security denylist | `06-extensibility/plugin-security-denylist.md` | Denylist collections, resources, spaces |
| Plugin scaffolding CLI | `06-extensibility/scaffold-plugin-cli.md` | `scaffold-plugin.php` developer CLI (P15) |
| Commerce CSV import | `06-extensibility/commerce-import.md` | CSV import wizard and history |
| User plugin | `06-extensibility/user-plugin.md` | User Management plugin: registration, permissions |
| Payments plugin | `06-extensibility/payments-plugin.md` | Connection hub: 8 providers, webhooks, activity log |
| Payment shelf API | `06-extensibility/payment-shelf-api.md` | Developer guide: `payment_shelf` for consumer plugins |
| Templates (pages) | `06-extensibility/templates-pages.md` | Page templates and routing |
| Audit log and activity | `06-extensibility/audit-log-and-activity.md` | Who did what, when |
| Updates | `06-extensibility/updates.md` | Updating Birkly and extensions |

## 07 — Operations

| Topic | File | Description |
|-------|------|-------------|
| Deployment | `07-operations/deployment.md` | Hosting, server, env |
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
