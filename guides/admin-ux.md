# Admin UX guide (Phase 44)

How the Birkly admin is organized after the Phase 44 UX improvements: grouped settings, clearer saving, guided hosting setup, and in-app feedback.

> **Since P59:** Settings is a flat row of tabs (**General, Site delivery, Project, Team & access, Security, AI, Integrations, System**) rather than the four grouped "areas" described below, and **Project** is now its own tab (Overview, Files, Rendering, Git, Activity) — not a simple/advanced mode nested under Site. See [Settings](../01-admin/settings.md) and [Project Git sync](../01-admin/project-git-sync.md) for the current layout; the areas/URL-scheme and Project simple/advanced sections below are kept for history only.

**See also:** [Settings](../01-admin/settings.md) · [Project Git sync](../01-admin/project-git-sync.md) · [Help and onboarding](../01-admin/help-and-onboarding.md) · [Admin responsive refinement](admin-responsive-refinement.md)

---

## Summary

Settings are grouped into **four areas** instead of one long row of tabs. Only some tabs use the sticky **Save** bar at the top — others save on their own so you are never misled into thinking everything was saved at once. **Hosting** uses a short **wizard** (also shown during first-time setup). The **Project** tab defaults to a simple upload-and-list view; the full file editor is optional. Success and error messages should appear as **toasts** in the admin, not browser pop-ups.

---

## Beginner

### Settings areas

Open **Settings** from the sidebar. Across the top you will see four areas:

| Area | What you configure |
|------|-------------------|
| **Site** | General info, hosting URLs, domains, project files, redirects |
| **Team & security** | Users, roles, security rules, activity log |
| **Integrations** | API keys, webhooks, AI and MCP connections |
| **Infrastructure** | Storage backend, health monitoring |

> **Since P59:** project files (and the new Git push/pull sync) are under a dedicated **Project** tab, not folded into "Site". Domains, the hosting wizard, and redirects stayed on **Site delivery**. See [Settings](../01-admin/settings.md).

Pick an area, then choose a tab underneath (for example **Site → Hosting**). On a narrow screen, tabs may scroll or appear in a **More** menu — same sections, easier to reach.

### Saving your work

Not every tab uses the same save button:

| Tab type | How to save |
|----------|-------------|
| **General, Security, Storage, Monitoring** | Edit fields, then click the sticky save button at the top (for example **Save general settings**). An **Unsaved changes** badge appears when you have edited fields. |
| **Hosting** | Use **Save hosting** inside the hosting wizard. The global save bar is hidden on this tab. |
| **Project** | No simple/advanced split anymore — Files, Rendering, and Git each save or act immediately (upload, save a file, connect/push/pull). |
| **Domains, Webhooks, Redirects, API** | Each action saves immediately (add domain, delete webhook, etc.). |

If you leave General (or Security / Storage / Monitoring) with unsaved edits, the browser may warn you before you navigate away.

### Hosting wizard

**Settings → Site → Hosting** walks you through three steps:

1. **CMS URL** — Where you open the admin (for example `https://cms.example.com`). Use **Use current host** if this install is already on the right domain. If you run Docker or Dokploy, check **Self-hosted / Docker** to see the deployment checklist.
2. **Public site** — Choose whether visitors have no public site, a site hosted elsewhere, or files in Birkly’s **project** folder.
3. **Preview** — Read-only summary of where you manage content vs where visitors browse, plus the `birkly-client.js` snippet for external sites.

The same wizard appears during **onboarding** after you create the first admin account.

### Project tab (current: P59)

**Settings → Project** is its own top-level tab (not nested under Site), with five sections and no simple/advanced gate:

- **Overview** — path, status, public URL, **Visit public site**
- **Files** — browse folders, upload, edit source, download ZIP, delete — always the full view, no "Advanced file editor" toggle to enable first
- **Rendering** — server-side rendering (hosting type, render mode, cache TTL, invalidate)
- **Git** — connect a GitHub/GitLab/generic remote and push/pull `project/`; see [Project Git sync](../01-admin/project-git-sync.md)
- **Activity** — file, settings, and git events

<details><summary>Historical: pre-P59 simple/advanced Project tab</summary>

Before P59, **Settings → Site → Project** opened in a **simple** mode (upload files, flat file list, Visit public site) with an **Advanced file editor** toggle needed to browse folders, edit source, or view activity. This gate was removed in P59 — the current Files section always shows the full browser/editor.

</details>

### Feedback toasts

When something succeeds or fails, Birkly shows a short message in the admin interface (a **toast**) instead of a blocking browser alert. Toasts:

- Appear near the top or in the sticky action bar
- Disappear after a few seconds
- Are announced to screen readers (`aria-live="polite"`)

Examples: “Hosting settings saved”, validation errors on a form, or copy-to-clipboard confirmation on AI connection setup.

Destructive actions (delete user, skip onboarding) use a **confirm** dialog styled like other admin modals — not the browser’s native `confirm()` box.

---

## Advanced users

### URL scheme

**Since P59**, Settings tabs are flat — there is no `area=` grouping parameter. Deep links use:

```
/admin?page=settings&tab=site-delivery#hosting
/admin?page=settings&tab=project#project-git
/admin?page=settings&tab=ai#ai-integrations
```

Valid tabs: `general`, `site-delivery`, `project`, `team-access`, `security`, `ai`, `integrations`, `system` (`admin/js/settings-page.js` → `VALID_TABS`). Legacy hashes like `#hosting`, `#domains`, `#project-git`, `#mcp-connections` are mapped to the right tab via `TAB_ALIASES` in the same file. Older `?area=site&tab=hosting` links from before P59 are no longer generated; only `tab=` matters now.

### Save bar implementation

- Sticky bar: `main-actions-bar--sticky` (hidden via `.is-hidden` on independent-save tabs)
- Dirty tracking: `settings-page.js` — `GLOBAL_SAVE_TABS` vs `INDEPENDENT_SAVE_TABS`
- Per-tab labels: “Save general settings”, “Save security settings”, etc.

### Hosting API

The wizard reads and writes `api/hosting.php` (same as Phase 43). CMS URL, public URL mode, same-host routing, and client snippet are unchanged — only the presentation layer changed in P44.

### Project tab implementation (current: P59)

The Project tab (`#project` tab pane) has one section per concern, each with its own `settings-pane-section` id: `#project-overview`, `#project-files`, `#project-rendering`, `#project-git`, `#project-activity`. There is no advanced-mode toggle anymore — `admin/js/project-settings.js` drives Overview/Files/Rendering/Activity, and `admin/js/project-git.js` drives the Git section (renders connect form, status, push/pull, and the conflict panel from `api/project_git.php` state). The old `#project-advanced-panel` / `#project-advanced-editor-toggle` gate from Phase 44 no longer exists.

### Design tokens

Mint primary, spacing, typography, and button classes are documented for developers in the Birkly repo: `docs/admin-design-system.md`.

### Verification

Phase 44 acceptance checks live in `docs/reviews/P44-verification-matrix.md` (V-UX-01 through V-UX-33).
