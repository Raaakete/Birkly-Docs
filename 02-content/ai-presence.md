# AI Presence

## Summary

**AI Presence** is a thin layer on top of your existing CMS content. It lets you define brand identity, positioning, claims with evidence, media context, and communication guidance — then **publish** a canonical, machine-readable representation on your **public site domain** for AI systems and agents to discover.

This is **not** a chatbot builder and does **not** duplicate Content or Media. You reference CMS entries and media by ID; the source of truth stays in Content and Media.

**Product promise:** Publish an authoritative, structured, evidence-aware representation that is easier for AI systems to discover and use — not a guarantee that every AI will know your brand.

## Beginner

### Where to find it

Sidebar → **AI Presence** (between Media and Marketplace).

### Tabs

| Tab | Purpose |
|-----|---------|
| **Overview** | Completeness score, status cards, public URLs, recommended next steps |
| **Context** | Identity, positioning, communication guidance, connected CMS refs |
| **Claims & Evidence** | Factual claims with statuses and linked evidence |
| **Media** | Per-asset context (what it represents, intended use, restrictions) |
| **Publish** | Enable publishing, staleness warnings, context preview |

### Typical workflow

1. Complete the skippable **Get started** setup (or skip to Context).
2. Fill **Identity** and link an About page entry as **Connected content**.
3. Add **Claims** and attach at least two **Evidence** sources; mark supported claims as **Supported**.
4. Enable **Publishing** on the Publish tab and click **Publish**.
5. Verify `/.well-known/brand-context.json` on your public site URL (configured under Settings → Site delivery).

### Draft vs published

Edits save to a **draft**. Public endpoints serve the **published** snapshot only until you publish again.

## Advanced Users

### Data model

Canonical internal JSON: `ai_presence.v1` — see `schema/ai_presence.schema.json` in the Birkly repo.

Storage (runtime, not committed):

```
settings/ai_presence/
  draft.json
  published.json
  meta.json
  versions/{n}.json   # optional history, cap 50
```

### Permissions

- **View:** `read`
- **Edit / publish:** `manage_settings`

### AI suggestions

The **Suggest from CMS** action analyzes connected content via rule-based extraction (and optional AI connection). Suggestions are **never auto-saved** — use Accept or Reject for each item.

### Staleness

After publish, if a linked CMS entry or media file changes, Overview and Publish show warnings so you can review and republish.

### Related docs

- [AI Presence public API](../04-integration/ai-presence-public-api.md)
- Settings → AI connections (admin chat / MCP — complementary, not replaced)
