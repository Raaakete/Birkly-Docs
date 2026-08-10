# Glossary

Short definitions of terms used in Birkly documentation. Use these consistently when writing or editing docs.

## Summary

This glossary defines key terms used across Birkly docs. Use it when you’re unsure what a word means (e.g. **handle**, **slug**, **entry**) or when you need a consistent definition for your own documentation.

| Term | Definition |
|------|------------|
| **Agent Guide** | Admin feature that publishes structured context for AI systems (sources of truth, identity, products, claims, evidence). Not a chatbot; references CMS/Media and declared sources rather than duplicating them. See [Agent Guide](../02-content/agent-guide.md). |
| **Sources of truth (Agent Guide)** | Registry (`sources_of_truth[]`) of canonical sources — CMS entries/collections, websites, documents, media, marketplaces — with roles `narrative`, `proof`, `reference`, `archive`. Agents should read these before relying on summaries alone. |
| **Agent guide context** | The published JSON snapshot (`agent_guide.v1`) describing a site or organization for machine consumption — well-known file, public API, MCP. Legacy schema: `ai_presence.v1`; legacy path: `/.well-known/brand-context.json`. |
| **Claim (Agent Guide)** | A factual statement with a review status (`supported`, `pending_review`, etc.). Supported claims appear in public summary views when backed by evidence. |
| **Cross-link (Agent Guide)** | Typed source reference from a product summary to deeper content — CMS entry, public page, marketplace listing, review site. Exported as resolved URLs in product `sources[]`. |
| **Evidence (Agent Guide)** | Proof artifact linked to claims — URL, CMS ref, certification page, marketplace listing, etc. |
| **Well-known agent guide** | Public file at `/.well-known/agent-guide.json` containing the published Agent Guide export. Legacy alias: `/.well-known/brand-context.json`. |
| **AI connection** | A configured outbound link to an AI provider (OpenAI, Ollama, etc.) in Birkly. Stored in **Settings → AI → Built-in assistant**; each has provider, model, role, and optional approval requirement. See [AI connections](../01-admin/ai-connections.md). Not the same as **Connections** (email & services). |
| **MCP connection** | An inbound MCP endpoint that lets external AI tools connect to Birkly. Configured in **Settings → AI** with API key and/or OAuth. See [MCP connections](../01-admin/mcp-connections.md) and [AI on localhost](../04-integration/ai-on-localhost.md). |
| **Connections** | Settings tab for shared system pipes: email transports, notification channels, HTTP API credentials, and webhook signing. Distinct from AI/MCP under **Settings → AI**. See [Connections overview](../01-admin/connections/connections-overview.md). |
| **Email alias (Connections)** | Purpose slug (`transactional_email`, `marketing_email`, `ops_alerts`) bound to an email connection id so plugins send without hard-coding SMTP. |
| **Notification route** | Admin map from an event key (e.g. `commerce.order_paid`) to one or more channels (email, Slack, Discord, SMS). See [Notification routes](../01-admin/connections/notification-routes.md). |
| **Analytics preset** | Site-wide visitor analytics level in **Settings → Analytics**: Off, Minimal, Standard, or Advanced. Standard+ requires a visitor consent hook. See [Analytics presets](../01-admin/analytics-presets.md). |
| **Developer mode** | Admin setting (off by default) that unlocks DX tools such as template/site-pack export and system info. See [Developer mode](../01-admin/developer-mode.md). |
| **AI approval** | A pending AI write action (e.g. create entry) waiting for a human to approve or reject. Shown in the approval queue when “Require approval for AI actions” is on. See [AI approvals](../01-admin/ai-approvals.md). |
| **Action** | In automation, a step that runs when the workflow is triggered—e.g. “send Slack message”, “HTTP request to URL”. You add actions in the workflow editor. |
| **Admin** | The Birkly back office: login, dashboard, content, media, settings. Accessed at `/admin` (or your configured path). |
| **Automation** | Feature that runs workflows on a trigger (schedule or webhook), with optional conditions and actions. See [Automation overview](../05-automation/automation-overview.md). |
| **Client library** | The JavaScript file (`birkly-client.js`) that loads on your website and fetches content from Birkly to render template placeholders. See [Client library](../04-integration/client-library.md). |
| **Collection** | A content type in Birkly: a named schema of fields (e.g. “Blog posts”, “Products”). Each collection has a unique **handle** used in templates and the API. |
| **Condition** | In automation, a rule that must be true for the workflow’s actions to run—e.g. “payload has email”, “entry is published”. |
| **Content** | The area in the admin where you manage collections and entries (the “Content” section in the sidebar). |
| **CORS** | Cross-Origin Resource Sharing. Browser security that blocks your website from calling the CMS API unless the server sends headers allowing your domain. Must be configured on the Birkly server for client-side integration. |
| **Entry** | A single content item in a collection (e.g. one blog post, one product). Has values for each field and system fields like **slug** and **status**. |
| **Entry method** | Setting on a collection: “Admin only” (only logged-in users can create/edit) or “Public API” (allow submissions via API/forms). Affects who can submit and how. |
| **Field** | One piece of data in a collection (e.g. title, content, date). Each field has a **field type** (Text, Editor, Media, etc.) and optional required/validation rules. |
| **Field type** | The kind of data a field holds: Text, Textarea, Editor, Media, Gallery, Number, Date, Select, Tags, etc. See [Field types](../02-content/field-types.md). |
| **Handle** | Unique identifier for a collection (e.g. `blog`, `products`). Lowercase, no spaces. Used in templates (e.g. `{for each entry in 'blog'}`) and in the Public API URL. Choose it once and avoid changing it. |
| **Media library** | Central storage in the admin for uploaded files (images, PDFs, etc.) that can be used in content via Media or File fields. See [Media library](../01-admin/media-library.md). |
| **Onboarding** | First-time setup flow for new users: project name, first collection, optional tour. See [Help and onboarding](../01-admin/help-and-onboarding.md). |
| **Plugin** | Extension that adds features to Birkly: admin pages, APIs, field types, automation actions. Installed from the `plugins/` folder and enabled in Settings. See [Plugins](../06-extensibility/plugins.md). |
| **Public API** | HTTP API for reading (and sometimes submitting) content without admin login. Used by the client library and by your own apps. See [Public API](../04-integration/public-api.md). |
| **Role** | A set of permissions (e.g. Viewer, Editor, Admin) assigned to a user. Controls what they can do in the admin. See [Roles and permissions](../01-admin/roles-and-permissions.md). |
| **Slug** | URL-friendly unique identifier for an entry (e.g. `my-first-post`). Used in URLs and to load one entry by slug in templates and the API. |
| **Status** | Entry state: **Draft** (not visible on the public site) or **Published** (visible). Only published entries are usually returned by the Public API. |
| **Template** | HTML (or other) that contains placeholders and loops filled with Birkly content when rendered. See [Templating overview](../03-templating/templating-overview.md). |
| **Templating** | The language and process of using variables (`{ title }`), loops (`{for each entry in 'blog'}`), and conditionals (`{if} … {endif}`) in templates to output content. |
| **Trigger** | In automation, the event that starts a workflow—e.g. “every day at 9:00” (scheduled) or “when we receive a POST to this URL” (webhook). See [Triggers](../05-automation/triggers.md). |
| **Webhook** | **Incoming:** A URL that other services call to trigger an automation workflow. **Outgoing:** Birkly calling your URL when an event happens (e.g. entry published). See [Webhooks](../05-automation/webhooks.md). |
| **Workflow** | In automation, a configured trigger plus optional conditions and actions. Created and edited in the Automation section of the admin. |

## Related

- [CONTENTS_INDEX](../CONTENTS_INDEX.md)
- [Audience matrix](audience-matrix.md)
