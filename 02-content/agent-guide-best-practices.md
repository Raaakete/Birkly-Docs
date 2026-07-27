# Agent Guide — best practices

## Summary

Guidelines for building Agent Guide that is accurate, maintainable, and useful for AI systems — without over-promising what publication guarantees. Applies to personal sites, teams, and enterprise deployments alike.

## Strategy

### Sources before summaries

1. **Declare sources of truth first** — at least one narrative source (CMS About, primary website, key document).
2. **Then** write Context and Products summaries that reflect those sources.
3. **Link** with `derived_from` and product source links so agents can drill down.

Skipping the registry invites duplicate truth and weak grounding.

### Treat Agent Guide as an index, not a CMS duplicate

- **Do** write concise summaries agents can scan quickly.
- **Do** link to CMS entries, product pages, and third-party proof.
- **Don’t** paste full product specs, legal terms, or blog posts into Agent Guide fields.

Single source of truth stays in **Content**, **Media**, and your declared **sources of truth**.

### Publish for discovery, not omniscience

Publication makes structured context **easier to find** via well-known JSON, API, JSON-LD, and MCP. It does not force every assistant or crawler to ingest your guide overnight.

Measure success by: integration tests, MCP agent answers, your own preview queries — not vanity “does AI know us?” anecdotes.

### Version intentionally

Every **Publish** increments `published_version`. For material claim changes:

1. Update draft + evidence
2. Save draft
3. Publish
4. Note version in change log (internal)

Keep version history (`versions/{n}.json`, cap 50) for rollback reference.

## Content quality

### Sources of truth

- Include at least one **`narrative`** source before publishing
- Use **`proof`** role for certification pages and audit reports
- Use **`reference`** for docs and FAQs agents should skim
- Set **priority** when multiple narrative sources exist (primary About > blog)

### Identity

- **Short description** — One sentence, no jargon stack
- **Full description** — 2–4 sentences max; link to narrative sources for depth
- **Website** — Canonical HTTPS homepage (also valid as a registry entry)

### Positioning

- **Best known for** — What you want quoted (3–5 items)
- **Not ideal for** — Reduces bad-fit recommendations
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
| Link marketplace **listing URL** | Paste review text |
| Store rating + count as metadata | Scrape competitor reviews |
| Use `user_verified` after checking | Mark supported without opening URL |
| Run **Check all links** before publish | Ignore broken link warnings |
| Register key docs in **sources of truth** | Hide proof only in free-text fields |

## AI Assist governance

- Review every suggestion before Accept — especially Fill 100% inferred fields
- Use **rules-only** mode when AI provider not approved for published content
- Assign `manage_settings` only to trusted editors
- Document who may publish (operational RACI)

## Operational cadence

| Trigger | Action |
|---------|--------|
| CMS About page updated | Check CMS sync → refresh or edit → republish |
| New product launched | Add product + sources → publish |
| Certification renewed | Update evidence URL/date → republish |
| Quarterly | Check all links + review supported claims + verify registry |
| Rebrand / rename | Full Sources + Context pass + media context + republish |

## Security & privacy

- Public export is **unauthenticated read** — never put secrets, unreleased products (set `public: false` on products), or PII in Agent Guide
- Admin URL fetch uses SSRF protection — cannot probe internal network
- Draft API requires auth — don’t expose admin endpoints

## Anti-patterns

1. **Summaries without sources** — High completeness but empty `sources_of_truth`
2. **Checkbox completeness** — Filling fields without evidence or URLs
3. **Claim spam** — Twenty unsupported marketing lines
4. **Stale marketplace stars** — Old rating, still published years later
5. **Duplicate truth** — Same paragraph in CMS and full_description with no derived_from link
6. **Publish once, forget** — No staleness monitoring

## Completeness as quality gate

Aim for high completeness **and**:

- ≥1 narrative source of truth
- ≥1 grounded product
- ≥1 URL-backed evidence
- ≥1 supported claim with evidence
- Link check clean

80% completeness with strong sources beats 100% with empty URLs.

## Integrations checklist (developers)

- [ ] Public site URL configured
- [ ] Well-known URL returns 200 after publish (`/.well-known/agent-guide.json`)
- [ ] `view=summary` consumed by site chatbot
- [ ] MCP `get_agent_guide_context` tested for internal agents
- [ ] JSON-LD validates in Google Rich Results Test (optional)

## Related docs

- [Getting started](agent-guide-getting-started.md)
- [Claims, evidence & cross-links](agent-guide-claims-evidence-and-links.md)
- [Public API](../04-integration/agent-guide-public-api.md)
- [MCP & agents](../04-integration/agent-guide-mcp-and-agents.md)
