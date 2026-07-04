# Birkly Docs — Contents Index

This index lists every documentation topic and its file path. Use it for navigation, tooling, or to ensure nothing is missing when syncing to the CMS or website.

## 00 — Overview

| Topic | File | Description |
|-------|------|-------------|
| What is Birkly | `00-overview/what-is-birkly.md` | Product overview and key differentiators |
| What is a CMS | `00-overview/what-is-a-cms.md` | CMS concept for non-technical readers |
| Getting started | `00-overview/getting-started.md` | First steps: login, project name, first collection |
| Closed alpha guide | `00-overview/closed-alpha-guide.md` | Invited tester guide: feedback, scope, doc links |

## 01 — Admin

| Topic | File | Description |
|-------|------|-------------|
| Dashboard | `01-admin/dashboard.md` | Admin home, widgets, at-a-glance info |
| Content overview | `01-admin/content-overview.md` | Content area: collections and entries |
| Media library | `01-admin/media-library.md` | Upload, organize, use media in content |
| Settings | `01-admin/settings.md` | General and branding settings |
| Roles and permissions | `01-admin/roles-and-permissions.md` | User roles and what they can do |
| Account | `01-admin/account.md` | Profile, password, 2FA |
| Help and onboarding | `01-admin/help-and-onboarding.md` | In-admin help and first-time setup |
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
| Security | `07-operations/security.md` | Hardening, HTTPS, auth |
| Backup and restore | `07-operations/backup-and-restore.md` | Content and media backup |
| Troubleshooting | `07-operations/troubleshooting.md` | Common issues and fixes |

## Meta (maintainers)

| Topic | File | Description |
|-------|------|-------------|
| Glossary | `meta/glossary.md` | Term definitions |
| Audience matrix | `meta/audience-matrix.md` | Which topics for which audience |
| Changelog (docs) | `meta/changelog-docs.md` | Doc-only changes |
