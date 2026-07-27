# AI Presence

## Summary

**AI Presence** is Birkly’s brand-context layer for the age of AI assistants. It sits on top of your existing CMS content and Media library — it does **not** replace them. You define who you are, what you offer, what you can prove, and how you want to be described; then you **publish** a canonical, machine-readable snapshot on your **public site domain** so AI systems, search crawlers, and connected agents can discover and use it responsibly.

**Product promise:** Publish an authoritative, structured, evidence-aware representation that is easier for AI systems to discover and use. This is **not** a guarantee that every AI model will know your brand, and it is **not** a chatbot builder.

## What problem does it solve?

When someone asks ChatGPT, Claude, or a site-specific agent “What does Acme Co do?” or “Is their widget good for small teams?”, the answer often comes from scattered web pages, outdated summaries, or guesswork. AI Presence gives you a single place to:

1. **Curate** the story you want AI to tell (identity, positioning, products, voice).
2. **Ground** that story in evidence (CMS entries, URLs, certifications, review pages).
3. **Publish** a versioned JSON snapshot agents can read without scraping your whole site.
4. **Cross-link** summaries to deeper sources (product pages, Amazon listings, docs) so agents know where to verify details.

Think of AI Presence as the **index and authority map** for your brand — not the full encyclopedia.

## Mental model

```
┌─────────────────────────────────────────────────────────────┐
│  CMS Content & Media (source of truth)                      │
│  About pages, product entries, images, blog posts           │
└───────────────────────────┬─────────────────────────────────┘
                            │ references (IDs, slugs, URLs)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  AI Presence (draft → publish)                              │
│  Summaries · claims · evidence · cross-links · voice        │
└───────────────────────────┬─────────────────────────────────┘
                            │ publish
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Public export (on your site domain)                        │
│  /.well-known/brand-context.json                            │
│  /api/public/ai_presence.php                                │
│  Optional JSON-LD · MCP tools · agent graph views           │
└─────────────────────────────────────────────────────────────┘
```

**Draft vs published:** All edits save to a **draft**. Public endpoints serve the **published** snapshot only until you publish again. You can iterate safely without affecting what agents see.

## Where to find it

Admin sidebar → **AI Presence** (between Media and Marketplace).

**Permissions:**

| Action | Permission |
|--------|------------|
| View AI Presence | `read` |
| Edit, publish | `manage_settings` |

## Admin tabs (at a glance)

| Tab | Purpose |
|-----|---------|
| **Overview** | Completeness score, section status, CMS sync drift, cross-link health, public URLs |
| **Context** | Identity, positioning, terminology, relationships, connected CMS refs |
| **Products & Services** | Structured catalog with source links to CMS entries and external URLs |
| **Claims & Evidence** | Factual statements, proof sources, review workflow |
| **Media** | Per-asset context (what it represents, intended use, restrictions) |
| **Publish** | Enable publishing, version history, staleness warnings, AI preview |

## AI Assist sidebar

The sticky save bar and right-hand **AI Assist** panel help you fill gaps without auto-saving:

- **Auto-fill / Fill gaps / Fill 100%** — AI suggestions you approve one-by-one or in bulk
- **Suggest cross-links** — Propose CMS entry links, marketplace/review URLs, derived-from mappings
- **Brand Studio** (Advanced) — Multi-collection wizard from CMS sources
- Per-field **Generate** on Context fields — Targeted suggestions applied directly to the field

Suggestions are **never auto-saved** until you accept them.

## Documentation map

| Doc | Audience | Contents |
|-----|----------|----------|
| [Getting started](ai-presence-getting-started.md) | Beginners | First publish in ~30 minutes |
| [Workflows](ai-presence-workflows.md) | Editors | Tab-by-tab how-to |
| [Claims, evidence & cross-links](ai-presence-claims-evidence-and-links.md) | Editors + strategists | Proof, Amazon/review links, source roles |
| [AI Assist](ai-presence-ai-assist.md) | Power users | Copilot modes, Brand Studio, field AI |
| [Best practices](ai-presence-best-practices.md) | Everyone | Quality, governance, what not to do |
| [Data model](ai-presence-data-model.md) | Developers | Schema, storage, completeness scoring |
| [Public API](../04-integration/ai-presence-public-api.md) | Integrators | Endpoints, views, graph, caching |
| [MCP & agents](../04-integration/ai-presence-mcp-and-agents.md) | Developers | MCP tools, resources, agent patterns |

## Quick start (5 steps)

1. **Context** — Official name, short description, link your About CMS entry as **Connected content**.
2. **Products** — Add at least one product/service with a **canonical source link** (CMS entry or product URL).
3. **Claims** — Add 2–3 factual claims; attach evidence with verifiable URLs; mark supported claims as **Supported**.
4. **Publish** — Enable publishing, click **Publish**, note your public URLs on the Overview/Publish tabs.
5. **Verify** — Open `/.well-known/brand-context.json` on your **public site domain** (Settings → Site delivery).

Full walkthrough: [Getting started](ai-presence-getting-started.md).

## What gets published

Published JSON (`ai_presence.v1`) includes:

- **identity**, **positioning**, **communication_guidance**
- **products_services[]** with resolved **`sources[]`** (public URLs)
- **claims[]** with **evidence** and optional direct **sources[]**
- **connected_content** refs, **relationships**, **media_context**
- **`usage_hints`** — Guidance for AI consumers (authoritative vs marketing fields)
- **`identity.derived_from`** — Which CMS entries ground summary fields
- Optional **`json_ld`** — Schema.org graph (Organization, Product/Service, Claim)

## Related Birkly features

- **Settings → Site delivery** — Public site URL where well-known and API are served
- **Settings → AI connections** — Optional BYOAI for Assist (rules-only mode works without AI)
- **MCP connections** — Inbound agents can read published brand context via MCP tools
- **Admin AI chat** — Complementary; AI Presence is structured publish, not conversational UI

## FAQ

**Does AI Presence replace my About page or product CMS entries?**  
No. Content stays in Content; AI Presence references it and summarizes for agents.

**Will ChatGPT automatically use my brand context?**  
Not guaranteed. You make discovery easier via well-known JSON, public API, and JSON-LD. Adoption depends on crawlers, integrations, and MCP-connected tools.

**Can I hide draft work from the public?**  
Yes. Only **published** snapshots are public. Disable publishing or don’t publish until ready.

**Do I need AI connections configured?**  
No. Rule-based suggestions and manual editing work without AI. Connections unlock Copilot, Fill 100%, and link suggestions.
