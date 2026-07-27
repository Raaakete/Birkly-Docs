# AI Presence — getting started

## Summary

This tutorial walks you from an empty AI Presence draft to a **published** brand context on your public site domain. Plan for one focused session (~30 minutes) if you already have CMS content (About page, products); longer if you’re building from scratch.

**Prerequisites:**

- Admin access with `manage_settings`
- At least one CMS collection with content (e.g. About, Products)
- **Settings → Site delivery** configured with your public site URL (for well-known verification)

## Step 1 — Open AI Presence and skip or complete setup

1. Sidebar → **AI Presence**.
2. If you see **Get started**, either:
   - Follow the wizard (prefills from project settings and first collection), or
   - **Skip** and go straight to the **Context** tab.

The Overview tab shows **completeness** and recommended next steps — use it as your checklist.

## Step 2 — Identity and connected content (Context tab)

### Identity

Fill at minimum:

| Field | Example |
|-------|---------|
| Official name | Acme Co |
| Short description | One sentence: what you are and who you serve |
| Website | `https://example.com` |

Optional but valuable: full description, what we do, industry, locations, social profiles.

Use **Generate** on any field if you have an AI connection and linked CMS content.

### Connected content

Link CMS entries that **author** your brand story:

1. Context tab → **Connected content** → add reference.
2. Choose **entry** (not just collection) when possible — e.g. your About page entry.
3. Set **role** meaningfully: `about`, `brand_description`, `reference`.

Connected entries feed AI Assist, CMS sync on Overview, and cross-link suggestions.

**Save draft** (sticky bar).

## Step 3 — One product or service (Products tab)

1. **Add product or service**.
2. Name, type (product / service / bundle), short description.
3. **Source links** (bottom of modal):
   - **Canonical detail** → CMS entry *or* public product URL on your site
   - Optional: **Marketplace** → Amazon/listing URL; **Review** → G2, Trustpilot, etc.

Completeness gives partial credit for having products and **full product credit when at least one product has a grounded source**.

**Save draft**.

## Step 4 — Claims and evidence (Claims tab)

Claims are **statements you’re willing to stand behind**. Evidence is **proof**.

### Add a claim

1. **Add claim** → write a factual statement, e.g. “Used by 500+ teams in Europe”.
2. Status: start with `pending_review`.

### Attach evidence

Select the claim, then:

- **Add evidence** (external URL) — press release, case study, certification page
- **Add CMS evidence** — link a connected CMS entry as proof

For marketplace/review claims (“4.8 stars on Amazon”):

- Evidence type: **Marketplace listing** or **Review platform**
- URL: the listing page (not scraped review text)
- Optional: rating, review count

**Best practice:** Mark a claim **Supported** only when you have solid evidence (typically ≥2 sources for high-stakes claims).

**Save draft**.

## Step 5 — Cross-links and link health (Overview tab)

1. **Suggest cross-links** (AI Assist or Overview) — review suggestions; accept product→CMS links, evidence URLs, derived-from mappings.
2. **Check all links** — validates external URLs, updates link status on draft.

Fix any broken links before publishing.

## Step 6 — Enable publishing and publish (Publish tab)

1. Enable **Publishing**.
2. Optional: **Include JSON-LD**, **Public views enabled**.
3. Confirm **public path** (default: `/.well-known/brand-context.json`).
4. Click **Publish** (sticky bar).

Note the version number and **public URLs** on Overview/Publish.

## Step 7 — Verify on your public domain

On your **public site** (not necessarily the admin host):

```bash
curl -s "https://YOUR-PUBLIC-SITE/.well-known/brand-context.json" | head
curl -s "https://YOUR-PUBLIC-SITE/api/public/ai_presence.php?action=brand&view=summary"
```

Expect JSON with `schema_version: ai_presence.v1`, `published_version`, `identity`, and your products/claims.

If you get **404**:

- Publishing disabled, or never published
- Wrong domain — check Settings → Site delivery
- Hosting mode — for `project` mode, file is also written under `project/.well-known/`

## Step 8 — Preview how AI might answer (Publish tab)

Use **Ask about your published brand context** with a test question:

- “What is [brand] known for?”
- “What products does [brand] offer?”

Without an AI connection, preview uses keyword matching on published fields. With a connection, preview can use full published JSON retrieval.

## What’s next?

| Goal | Read |
|------|------|
| Deeper tab workflows | [Workflows](ai-presence-workflows.md) |
| Evidence & Amazon/review strategy | [Claims, evidence & cross-links](ai-presence-claims-evidence-and-links.md) |
| Fill profile faster with AI | [AI Assist](ai-presence-ai-assist.md) |
| Governance & quality | [Best practices](ai-presence-best-practices.md) |
| Build an integration | [Public API](../04-integration/ai-presence-public-api.md) |
| Connect Claude Desktop / MCP | [MCP & agents](../04-integration/ai-presence-mcp-and-agents.md) |
