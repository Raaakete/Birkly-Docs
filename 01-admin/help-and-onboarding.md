# Help and Onboarding

## Summary

**Help** is the in-admin documentation: a link or icon in the sidebar opens guides that explain collections, entries, field types, templating, and integration. This content can be sourced from Birkly Docs so it stays in sync with the product. **Onboarding** is the first-time setup wizard shown when the first admin logs in. It has a visual step-by-step flow with a progress bar — complete it in a few minutes or skip any step. The Dashboard **setup checklist** shows four essential items after onboarding so you always know what remains. If the instance was preconfigured, onboarding may not appear.

## Beginner

**Help**

The **Help** section (often a "?" icon or a "Help" link in the sidebar) opens documentation **inside** the admin. You don't have to leave the panel or search the web—you can read how to create a collection, what field types mean, how to connect your website, and so on.

- **What's in Help:** Topics match Birkly-Docs: Getting started, Content, AI (connections, MCP, approvals), Automation, User plugin, ContentEditor blocks, Plugins, Media, Settings, and more. Each topic has a short in-admin snapshot and a **Read full doc** link to the built HTML guide.
- **How it's organized:** You may see a short summary for each topic and a way to "Read more" or open a longer explanation. That way you can skim the basics or dive into detail when you need it.
- **Who updates it:** If your installation is set up to use Birkly Docs (the central doc set), the Help content can be updated whenever the docs are updated, so the in-admin help stays accurate.

**Example:** You're not sure how to add a "Featured image" to a blog post. You click **Help**, open the "Entries" or "Field types" topic, and follow the steps. You never leave the admin.

**Onboarding**

**Onboarding** is a short setup wizard that appears the **first time** an administrator logs in. A progress bar at the top shows which step you're on.

**Wizard steps**

1. **Welcome** — A brief intro and what to expect.
2. **Site info** — Set your **project name** (appears in the admin and page titles) and optionally upload a **logo**.
3. **Demo content** — Optionally create a starter collection and entry so the admin isn't empty when you first explore.
4. **Connect AI** *(optional, skippable)* — Opens **Settings → AI & Integrations** so you can connect a provider (OpenAI, Claude, Ollama, etc.). If you skip this now, you can return to it any time from Settings. This step is never required and is not on the Dashboard checklist.
5. **Complete** — Summary and a "Go to Dashboard" button.

- **Skipping any step:** Each step has a "Skip" or "Skip for now" button. Clicking it moves you straight to the next step without making changes.
- **After you finish (or skip all steps):** The wizard is marked complete. Future logins go directly to the Dashboard — the wizard never reappears.
- **Preconfigured installs:** If someone completed onboarding before you logged in, you'll see the Dashboard from the start.

**Dashboard setup checklist**

After onboarding, the Dashboard shows a collapsible **setup checklist** with four essential items:

| Item | Done when… |
|------|------------|
| Complete site setup | Project name and basic settings are saved. |
| Create your first collection | At least one collection exists. |
| Add your first entry | At least one entry exists in a collection. |
| Configure site settings | Site settings (URL, timezone, etc.) are configured. |

The checklist does **not** include "Upload media files" or "Set up a template" — those are optional extras, not setup blockers. Once all four items are checked, the checklist collapses.

**Example:** You install Birkly and log in for the first time. The wizard appears. You enter "Acme Blog" as the project name, click Next, skip demo content, skip Connect AI ("I'll set it up later"), and click "Go to Dashboard." The Dashboard shows the four-item checklist with two items already checked. You create a "Blog posts" collection, add a first entry — the checklist completes and collapses.

**For administrators**

You can point the Help content to Birkly Docs (or a built copy) so the in-admin Help stays current. For organization-specific instructions ("always set up the Newsletter collection first"), add them to your internal wiki or a custom admin Help page.

## Advanced Users

**Help:** Content can be static HTML/JS bundled in the admin, or loaded from a path (e.g. Birkly Docs). If from Markdown: build step or runtime conversion to HTML; navigation can mirror DOCS_ARCHITECTURE (Summary / Beginner / Advanced). Optional: search, deep links to sections.

**Onboarding:** State stored per user in `users/onboarding/{key}.json`. The wizard sets `setup_wizard_completed` when you finish or skip. **Skip** marks the wizard complete without installing demo content; **Complete** also sets `demo_content_installed`. Redirect to onboarding only happens when `setup_wizard_completed` is false — existing demo content on disk does not force the wizard. Dashboard checklist merges API state with session so completed steps are not overwritten.

The optional **Connect AI** wizard step is the *only* place in the onboarding flow that references AI. The Dashboard checklist never includes an AI item (by design — AI setup is optional and handled separately in Settings → AI & Integrations). All API calls from the wizard use `Birkly.url()` for subdirectory-safe URL resolution.

**Dashboard checklist data:** `api/admin_templates.php` → `getDashboardData()`. Checklist items: `site_setup_done`, `first_collection`, `first_entry`, `configure_settings`. Items `upload_media` and `create_template` have been removed from the checklist as non-essential.

## Related

- [Getting started](../00-overview/getting-started.md)
- [DOCS_ARCHITECTURE.md](../DOCS_ARCHITECTURE.md) (for maintainers)
- [Dashboard](dashboard.md)
- [AI connections](ai-connections.md)
- [Settings](settings.md)
