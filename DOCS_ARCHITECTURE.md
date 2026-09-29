# Birkly Docs — Documentation Architecture

This document defines how Birkly documentation is structured, written, and consumed. **Birkly Docs** is the single source of truth for all Birkly documentation, whether it appears in the CMS admin (Help), the marketing website, developer portals, or other channels.

---

## 1. Purpose and principles

### 1.1 Single source of truth

- **All** Birkly documentation lives in this folder (Birkly Docs).
- Any other place that shows docs (CMS Help, website, PDFs, etc.) should **pull** from here, not duplicate content.
- Edits happen once; consumers update by re-importing, rebuilding, or including the same source.

### 1.2 One summary, two deep-dives (toggles)

Every topic is written so that:

| Part | Who it's for | How it's shown |
|------|--------------|-----------------|
| **Summary** | Everyone | Always visible. Short overview of the topic. |
| **Beginner** | Non-technical users (business owners, designers, marketers, content editors) | Toggle: opens a detailed explanation in plain, easy-to-understand language. Step-by-step, no jargon (or jargon explained). |
| **Advanced Users** | Technical users (developers, integrators, power users) | Toggle: opens a detailed explanation in efficient, technical language. Denser, assumes familiarity with concepts; often shorter than the Beginner version. |

So: **one summary for all**, then **two optional toggles** — one for beginners, one for advanced users. Readers choose the depth and language that fits them.

---

## 2. Content pattern (Summary + Beginner + Advanced Users)

### 2.1 Summary

- **Length:** A short paragraph (or a few bullets) that summarizes the topic for *any* reader.
- **Tone:** Neutral, clear. No need to avoid technical terms entirely, but don’t rely on them.
- **Content:** What the feature or concept is, why it matters, and the main takeaway (e.g. “Collections let you define content types; you then add entries to them.”).
- **Visibility:** Always shown. No toggle.

**Example (Collections):**

> **Summary:** Collections are content types in Birkly (e.g. “Blog posts”, “Products”). You define a collection once with a set of fields (title, text, image, date, etc.), then add as many entries as you need. The collection’s handle (e.g. `blog`) is used in the admin, in templates, and in the API.

### 2.2 Beginner (toggle)

- **Length:** As long as needed. Can be longer than the Advanced section.
- **Tone:** Plain language, friendly. Explain terms when you first use them (e.g. “slug (the short URL-friendly part of the title)”).
- **Content:**
  - What the feature is and why you’d use it
  - Step-by-step instructions (e.g. “Go to Content → click the collection → click New entry”)
  - Examples in everyday language
  - No assumed technical background; avoid or explain acronyms and jargon
- **Audience:** Business owners, designers, marketers, content editors — anyone who wants to get things done without learning technical details.

**Example (Collections — Beginner):**

> **Beginner:**  
> A collection is like a form template. Imagine you want to manage blog posts: you create a collection called “Blog posts” and add fields such as “Title”, “Content”, “Publication date”, and “Featured image”. From then on, every new post is just filling out that form in the admin. You don’t need to touch code.  
> To create a collection: open **Content** in the sidebar, click **Create collection**, give it a name (e.g. “Blog posts”), then add fields one by one. Each field has a type (text, long text, date, image, etc.). When you’re done, save. You can then add as many entries (posts) as you want.  
> …

### 2.3 Advanced Users (toggle)

- **Length:** Detailed but efficient. Often shorter than the Beginner section because it uses technical terms and skips basic explanations.
- **Tone:** Precise, technical. Assume familiarity with CMS concepts, APIs, or the admin.
- **Content:**
  - Definition and how it fits in the system (collections, schema, handle, entry method)
  - Configuration options, settings, and behaviour
  - Code or config examples where useful
  - Links to API, templating, or related docs
- **Audience:** Developers, integrators, technical staff who need the “how it really works” and “how to configure/integrate” view.

**Example (Collections — Advanced Users):**

> **Advanced Users:**  
> A collection is the schema for one content type: it defines the **fields** (name, type, required, options) and **entry method** (admin-only vs public API). Each collection has a unique **handle** (e.g. `blog`, `products`) used in templates (`{from 'blog' get entries}`) and the Public API (`/api/public/collections/blog/entries`).  
> Create and edit under **Content**. Settings tab: entry method (admin only / public API), and, for public API, rate limit, auto-publish, CAPTCHA. Field keys become entry JSON and template variables.  
> See [Field types](02-content/field-types.md), [Public API](04-integration/public-api.md).  
> …

### 2.4 Related (optional)

- A short list of links to other docs. Can appear after the toggles.

---

## 3. Document and folder structure

### 3.1 Folder layout

The folder layout is unchanged: numbered sections (`00-overview`, `01-admin`, …), one topic per file, cross-links between docs. See the full tree in the previous version of this file or in **CONTENTS_INDEX.md**.

### 3.2 Standard sections inside each topic file

Each topic file should follow this structure:

```markdown
# Topic title (e.g. Collections)

## Summary

… Short overview for all users. Always visible. …

## Beginner

… Detailed explanation in plain language for non-technical users. Shown in a toggle. …

## Advanced Users

… Detailed explanation in technical language for developers and power users. Shown in a toggle. …

## Related

- [Link to related doc]
```

- **Summary** is required and always shown.
- **Beginner** and **Advanced Users** are required for feature/concept topics. They are rendered as toggles (e.g. `<details>` / `<summary>` in HTML) so the reader can open the one they need.
- **Related** is optional but recommended.

---

## 4. Consuming Birkly Docs (how other places get their content)

### 4.1 CMS admin (Help)

- Show **Summary** by default.
- Offer two toggles or links: **Beginner** and **Advanced Users**, each expanding or linking to the corresponding section.
- Implementation: same as before (build from Markdown or include from this folder); only the section names and UI (toggles) change.

### 4.2 Marketing / product website

- Use **Summary** for teasers, cards, or “What is X?”.
- Full doc page: Summary + two toggles (Beginner / Advanced Users) so visitors can pick their level.

### 4.3 Developer portal

- **Summary** at the top.
- **Advanced Users** can be open by default or prominently linked; **Beginner** still available for non-technical stakeholders.

### 4.4 Static HTML docs site

- Each page: Summary (always visible), then two collapsible sections: “Beginner” and “Advanced Users”, implemented with `<details>` and `<summary>` (no JavaScript required).

---

## 5. Naming and linking conventions

- **Internal links:** Use relative paths, e.g. `[Field types](02-content/field-types.md)`.
- In **Beginner** sections, avoid jargon or explain it in one phrase. In **Advanced Users**, use standard terms (handle, slug, API, webhook, etc.) and link to the glossary or related docs where helpful.

---

## 6. Glossary and consistency

- **meta/glossary.md** lists terms with one-line definitions. Use them consistently.
- **Summary:** understandable by everyone. **Beginner:** no unexplained jargon. **Advanced Users:** technical language is fine.

---

## 7. Maintenance

- When changing Birkly behaviour, update the corresponding doc and keep **Summary**, **Beginner**, and **Advanced Users** in sync.
- Use **meta/changelog-docs.md** for doc-only changes.

---

## 8. What does NOT belong in Birkly-Docs

| Content type | Where it lives | Bridge |
|--------------|----------------|--------|
| User-facing product docs | **Birkly-Docs** (this repo) | `manifest.json`, `help-manifest.json` |
| Agent operational playbooks | `Birkly/docs/ai/playbooks/` | `ai_topic` in help-manifest |
| Internal planning / phase plans | `Birkly-Marketplace/internal/planning/` | Not synced to Help |
| Plugin-specific deep docs | Plugin repos + `docs_shelf` at runtime | Plugin Help merge |

The CMS does not host product articles. Help fetches `{docs_base_url}/content/{docs_path}` from `https://docs.birkly.com` when a topic opens. Publish this repo; do not copy article bodies into the CMS.

---

## 9. Summary (architecture)

| Item | Rule |
|------|------|
| **Source of truth** | Birkly Docs folder only |
| **Structure** | Every topic: **Summary** (always visible) + **Beginner** (toggle) + **Advanced Users** (toggle) |
| **Summary** | Short overview for all users |
| **Beginner** | Detailed, plain language, for non-technical users |
| **Advanced Users** | Detailed, technical language, for developers and power users |
| **Format** | Markdown; standard sections: Summary, Beginner, Advanced Users, Related |
| **Consumers** | CMS Help, website, developer portal, static HTML — all pull from here |

This keeps documentation in one place and serves both non-technical and technical readers with one summary and two optional deep-dives.
