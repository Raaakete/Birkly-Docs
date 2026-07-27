# AI Presence — best practices

## Summary

Guidelines for building AI Presence that is accurate, maintainable, and useful for AI systems — without over-promising what publication guarantees.

## Strategy

### Treat AI Presence as an index, not a CMS duplicate

- **Do** write concise summaries agents can scan quickly.
- **Do** link to CMS entries, product pages, and third-party proof.
- **Don’t** paste full product specs, legal terms, or blog posts into AI Presence fields.

Single source of truth stays in **Content** and **Media**.

### Publish for discovery, not omniscience

Publication makes structured context **easier to find** via well-known JSON, API, JSON-LD, and MCP. It does not force ChatGPT, Gemini, or every crawler to ingest your brand overnight.

Measure success by: integration tests, MCP agent answers, your own preview queries — not vanity “does AI know us?” anecdotes.

### Version intentionally

Every **Publish** increments `published_version`. For material claim changes:

1. Update draft + evidence
2. Save draft
3. Publish
4. Note version in change log (internal)

Keep version history (`versions/{n}.json`, cap 50) for rollback reference.

## Content quality

### Identity

- **Short description** — One sentence, no jargon stack
- **Full description** — 2–4 sentences max in AI Presence; link to About for depth
- **Website** — Canonical HTTPS homepage

### Positioning

- **Best known for** — What you want quoted (3–5 items)
- **Not ideal for** — Reduces bad-fit leads and agent mis-recommendations
- Avoid unprovable superlatives

### Products

- Every public product needs at least one **canonical_detail** source
- Align product **name** with CMS entry title or public page H1
- Use **best_for / not_for** for audience matching

### Claims & evidence

- One claim per atomic fact
- **Supported** only after human review
- Prefer **primary sources** (your site, issuer, marketplace) over aggregators
- Refresh marketplace rating evidence periodically

### Media context

- Describe **what** the image shows and **how** agents may use it
- State restrictions (logo clear space, no AI training, etc.)

## Cross-links & evidence

| Do | Don’t |
|----|-------|
| Link Amazon **listing URL** | Paste review text |
| Store rating + count as metadata | Scrape competitor reviews |
| Use `user_verified` after checking | Mark supported without opening URL |
| Run **Check all links** before publish | Ignore broken link warnings |

## AI Assist governance

- Review every suggestion before Accept — especially Fill 100% inferred fields
- Use **rules-only** mode when AI provider not approved for brand content
- Assign `manage_settings` only to trusted brand owners
- Document who may publish (operational RACI)

## Operational cadence

| Trigger | Action |
|---------|--------|
| CMS About page updated | Check CMS sync → refresh or edit → republish |
| New product launched | Add product + sources → publish |
| Certification renewed | Update evidence URL/date → republish |
| Quarterly | Check all links + review supported claims |
| Rebrand | Full Context pass + media context + republish |

## Security & privacy

- Public export is **unauthenticated read** — never put secrets, unreleased products (set `public: false` on products), or PII in AI Presence
- Admin URL fetch uses SSRF protection — cannot probe internal network
- Draft API requires auth — don’t expose admin endpoints

## Anti-patterns

1. **Checkbox completeness** — Filling fields without sources or evidence
2. **Claim spam** — Twenty unsupported marketing lines
3. **Stale Amazon stars** — 2023 rating, still published in 2026
4. **Duplicate truth** — Same paragraph in CMS and full_description with no derived_from link
5. **Publish once, forget** — No staleness monitoring

## Completeness as quality gate

Aim for high completeness **and**:

- ≥1 grounded product
- ≥1 URL-backed evidence
- ≥1 supported claim with evidence
- Connected About entry
- Link check clean

80% completeness with strong evidence beats 100% with empty URLs.

## Integrations checklist (developers)

- [ ] Public site URL configured
- [ ] Well-known URL returns 200 after publish
- [ ] `view=summary` consumed by site chatbot
- [ ] MCP `get_brand_context` tested for internal agents
- [ ] JSON-LD validates in Google Rich Results Test (optional)

## Related docs

- [Getting started](ai-presence-getting-started.md)
- [Claims, evidence & cross-links](ai-presence-claims-evidence-and-links.md)
- [Public API](../04-integration/ai-presence-public-api.md)
- [MCP & agents](../04-integration/ai-presence-mcp-and-agents.md)
