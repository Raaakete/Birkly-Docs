# Agent Guide — getting started

## Summary

This tutorial walks you from an empty Agent Guide draft to a **published** guide on your public site domain. Plan for one focused session (~30 minutes) if you already have CMS content (About page, products); longer if you’re building from scratch.

**Prerequisites:**

- Admin access with `manage_settings`
- At least one CMS collection with content (e.g. About, Products)
- **Settings → Site delivery** configured with your public site URL (for well-known verification)

## Step 1 — Open Agent Guide

1. Sidebar → **Agent Guide** (or `/admin/?page=agent-guide`).
2. If you see **Get started**, either:
   - Follow the wizard (prefills from project settings and first collection), or
   - **Skip** and go straight to the **Sources** tab.

The Overview tab shows **completeness** and the recommended workflow — use it as your checklist.

## Step 2 — Sources of truth (Sources tab) — start here

Before writing summaries, declare where agents should read the truth.

1. **Sources** tab → **Add source of truth**.
2. Add at least one **narrative** source:

| Type | Example | Role |
|------|---------|------|
| `cms_entry` | Your About page entry | `narrative` |
| `cms_collection` | All blog posts collection | `reference` |
| `website` | `https://example.com` | `narrative` |
| `document` | PDF spec in Media library | `reference` |

**Source types:** `cms_entry`, `cms_collection`, `website`, `document`, `media_asset`, `marketplace`, `review_platform`, `other`

**Source roles:** `narrative` (who you are), `proof` (evidence), `reference` (background), `archive` (historical)

3. Optional: run **Suggest sources** in AI Assist — review and accept suggestions.
4. **Save draft**.

Completeness awards full credit when you have at least one **narrative** source.

## Step 3 — Identity and context (Context tab)

Fill at minimum:

| Field | Example |
|-------|---------|
| Official name | Acme Co |
| Short description | One sentence: what you are and who you serve |
| Website | `https://example.com` |

Optional but valuable: full description, what we do, industry, locations, social profiles.

Use **Generate** on any field if you have an AI connection — AI Assist reads your **sources of truth** first.

If your short description comes from a CMS About entry, accept a **derived_from** suggestion so published JSON includes the resolved source URL.

**Save draft**.

## Step 4 — One product or service (Products tab)

1. **Add product or service**.
2. Name, type (product / service / bundle), short description.
3. **Source links** (bottom of modal):
   - **Canonical detail** → CMS entry *or* public product URL on your site
   - Optional: **Marketplace** → listing URL; **Review** → G2, Trustpilot, etc.

Completeness gives partial credit for having products and **full product credit when at least one product has a grounded source**.

**Save draft**.

## Step 5 — Claims and evidence (Claims tab)

Claims are **statements you’re willing to stand behind**. Evidence is **proof**.

### Add a claim

1. **Add claim** → write a factual statement, e.g. “Used by 500+ teams in Europe”.
2. Status: start with `pending_review`.

### Attach evidence

Select the claim, then:

- **Add evidence** (external URL) — press release, case study, certification page
- **Add CMS evidence** — link a CMS entry as proof

For marketplace/review claims (“4.8 stars on Amazon”):

- Evidence type: **Marketplace listing** or **Review platform**
- URL: the listing page (not scraped review text)
- Optional: rating, review count

**Best practice:** Mark a claim **Supported** only when you have solid evidence (typically ≥2 sources for high-stakes claims).

**Save draft**.

## Step 6 — Link health (Overview tab)

1. **Suggest cross-links** (AI Assist or Overview) — review suggestions; accept product→CMS links, evidence URLs, derived-from mappings.
2. **Check all links** — validates external URLs, updates link status on draft.

Fix any broken links before publishing.

## Step 7 — Enable publishing and publish (Publish tab)

1. Enable **Publishing**.
2. Optional: **Include JSON-LD**, **Public views enabled**.
3. Confirm **public path** (default: `/.well-known/agent-guide.json`).
4. Click **Publish** (sticky bar).

Note the version number and **public URLs** on Overview/Publish. Legacy well-known path `/.well-known/brand-context.json` is also listed when applicable.

## Step 8 — Verify on your public domain

On your **public site** (not necessarily the admin host):

```bash
curl -s "https://YOUR-PUBLIC-SITE/.well-known/agent-guide.json" | head
curl -s "https://YOUR-PUBLIC-SITE/api/public/ai_presence.php?action=brand&view=summary"
```

Expect JSON with `schema_version: agent_guide.v1`, `published_version`, `sources_of_truth`, `identity`, and your products/claims.

If you get **404**:

- Publishing disabled, or never published
- Wrong domain — check Settings → Site delivery
- Hosting mode — for `project` mode, file is also written under `project/.well-known/`

## Step 9 — Preview how AI might answer (Publish tab)

Use **Ask about your published guide** with a test question:

- “What is [name] known for?”
- “What products or services are offered?”

Without an AI connection, preview uses keyword matching on published fields. With a connection, preview can use full published JSON retrieval.

## What’s next?

| Goal | Read |
|------|------|
| Deeper tab workflows | [Workflows](agent-guide-workflows.md) |
| Evidence & marketplace strategy | [Claims, evidence & cross-links](agent-guide-claims-evidence-and-links.md) |
| Fill profile faster with AI | [AI Assist](agent-guide-ai-assist.md) |
| Governance & quality | [Best practices](agent-guide-best-practices.md) |
| Build an integration | [Public API](../04-integration/agent-guide-public-api.md) |
| Connect Claude Desktop / MCP | [MCP & agents](../04-integration/agent-guide-mcp-and-agents.md) |
