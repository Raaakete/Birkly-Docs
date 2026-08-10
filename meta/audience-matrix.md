# Audience Matrix

Which documentation topics are most relevant to which audience. Each topic has a **Summary** (for everyone), a **Beginner** toggle (plain language), and an **Advanced Users** toggle (technical). Use this when deciding what to emphasize in the CMS Help or on the website.

## Summary

The docs are structured so **everyone** sees a short **Summary** first. **Non-technical** readers (editors, site owners, marketers) can open the **Beginner** section for step-by-step, plain-language explanations and examples. **Technical** readers (developers, integrators) can open **Advanced Users** for implementation details, APIs, and conventions. Use this matrix to plan which topics to show in the CMS Help, on the marketing site, or in the developer portal.

| Topic | Non-technical (editors, site owners, marketers) | Technical (developers, integrators) |
|-------|-----------------------------------------------|-------------------------------------|
| **00 Overview** | ✓ Summary + Beginner | ✓ Summary + Advanced Users |
| What is a CMS | ✓ Primary | ✓ Optional |
| What is Birkly | ✓ Primary | ✓ Primary |
| Getting started | ✓ Primary | ✓ Primary |
| **01 Admin** | ✓ Summary + Beginner | ✓ Summary + Advanced Users |
| Dashboard, Content overview, Media, Settings, Roles, Account, Help | ✓ Primary | ✓ Reference |
| AI overview, AI connections, AI chat and actions, AI approvals | ✓ Primary | ✓ Reference |
| Connections overview, email setup, commerce email prerequisite | ✓ Primary (Settings → Connections) | ✓ Reference |
| Notification routes, HTTP credentials, webhooks, Automation mail migration | ✓ Setup steps | ✓ Primary (API / env / vault) |
| **02 Content** | ✓ Summary + Beginner | ✓ Summary + Advanced Users |
| Collections, Entries, Field types, Slugs and status | ✓ Primary | ✓ Primary |
| **03 Templating** | ✓ Summary + Beginner (concepts) | ✓ Summary + Advanced Users (syntax, engine) |
| **04 Integration** | ✓ Summary + Beginner (script tag, forms) | ✓ Summary + Advanced Users (API, CORS, SSR) |
| **05 Automation** | ✓ Summary + Beginner | ✓ Summary + Advanced Users |
| **06 Extensibility** | ✓ Summary + Beginner (enable/disable plugins) | ✓ Summary + Advanced Users (structure, hooks) |
| **07 Operations** | ✓ Summary + Beginner (backup, common issues) | ✓ Summary + Advanced Users (deploy, security) |

**Legend**

- **Summary** = Shown to everyone.
- **Beginner** = Toggle with detailed, plain-language explanation and examples.
- **Advanced Users** = Toggle with detailed, technical explanation and examples.
- **Primary** = Core for this audience. **Reference** = Look up when needed.

**Usage**

- **CMS Help:** Show Summary by default; offer “Beginner” and “Advanced Users” as toggles so each reader can open the level they need.
- **Marketing website:** Use Summary for teasers; full page = Summary + both toggles.
- **Developer portal:** Summary at top; “Advanced Users” can be open by default or linked prominently; “Beginner” still available for non-developers.

**Example: “Collections” in the CMS**

- **Summary:** “Collections are content types (e.g. Blog, Products). You define fields once, then add as many entries as you need. The handle is used in templates and the API.”
- **Beginner:** Step-by-step “Create a collection”, table of example fields for Blog and Products, where to find Entry method and what Public API means.
- **Advanced Users:** Schema concept, handle usage in templating and API, example config (JSON), best practices (stable handle, no key renames after entries exist).

## Related

- [CONTENTS_INDEX](../CONTENTS_INDEX.md)
- [Glossary](glossary.md)
- [Changelog (docs)](changelog-docs.md)
