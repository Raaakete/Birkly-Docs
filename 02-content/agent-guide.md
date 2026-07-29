# Agent Guide

Agent Guide is how you publish an **official, structured map of your brand** for AI systems and agents — without building a chatbot or duplicating everything in Content.

## Summary

**Agent Guide** (in the admin sidebar) lets you declare **where the truth lives** (CMS entries, your website, documents), write a concise **profile and positioning**, attach **claims with evidence**, describe **products and media**, then **Publish** a machine-readable file on your **public website**.

Content stays in **Content** and **Media**. Agent Guide **references** it.

This is **not** a vector database and **not** a website support bot. It is the right tool when you want machines to discover **what your brand officially says about itself**.

## Beginner

### Where to find it

Admin sidebar: **Agent Guide** (between Media and Marketplace).

### Typical workflow

1. **Sources** — Add CMS entries, website URLs, or documents agents should read first.
2. **Context** — Official name, descriptions, positioning, tone.
3. **Products & Services** — What you offer (optional but useful).
4. **Claims & Evidence** — Statements you want AI to get right, linked to proof.
5. **Media** — What key images represent (product hero, logo, etc.).
6. **Publish** — Enable public publishing and click **Publish**.

After publish, your guide is available at:

- `https://your-public-site/.well-known/agent-guide.json`
- Public API: `GET /api/public/ai_presence.php` on your CMS host (see [Public API](../04-integration/public-api.md))

### Draft vs published

Edits save to **draft**. Visitors and AI crawlers only see the **published** snapshot until you publish again.

### Context preview

On the **Publish** tab you can ask questions like “What is this brand known for?” Answers use **only the published guide** and list **sources** — this is a sanity check, not a customer chatbot.

## Advanced

### Schema

Internal format: `agent_guide.v1` (stored in site settings, not in git). Legacy alias: `ai_presence.v1`.

### Claims and evidence

Claims are **supported by sources you link**, not “certified true” by Birkly. Statuses: supported, pending review, unsupported, conflicting, expired.

### JSON-LD

Optional structured data in the public export for search engines and crawlers that consume Schema.org-style graphs.

### Settings → AI vs Agent Guide

| Feature | Purpose |
|---------|---------|
| **Settings → AI** | Connect OpenAI/Claude for **admin** chat and MCP tools |
| **Agent Guide** | **Publish** brand context **outward** for machines |

They work together (AI Assist can suggest draft content) but serve different goals.

### Vector databases — not required

Birkly does **not** need a vector database for Agent Guide. Vectors help **search huge unstructured archives** (e.g. “find anything about refunds in 10,000 tickets”). Agent Guide is **curated truth + evidence** — a better fit for “what is officially true about our brand?”

Optional semantic search over all entries could be a **future plugin** for support-bot-style products; it is not part of core CMS.

## Related

- [Website integration](../04-integration/website-integration.md)
- [Public API](../04-integration/public-api.md)
- [Collections](collections.md)
- [Media library](../05-media/media-library.md) (if exists — check path)
