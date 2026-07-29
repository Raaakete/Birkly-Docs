# Admin UX guide (Phase 44)

How the Birkly admin is organized after the Phase 44 UX improvements: grouped settings, clearer saving, guided hosting setup, a simpler Project tab, and in-app feedback.

**See also:** [Settings](../01-admin/settings.md) · [Help and onboarding](../01-admin/help-and-onboarding.md) · [Admin responsive refinement](admin-responsive-refinement.md)

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

Pick an area, then choose a tab underneath (for example **Site → Hosting**). On a narrow screen, tabs may scroll or appear in a **More** menu — same sections, easier to reach.

### Saving your work

Not every tab uses the same save button:

| Tab type | How to save |
|----------|-------------|
| **General, Security, Storage, Monitoring** | Edit fields, then click the sticky save button at the top (for example **Save general settings**). An **Unsaved changes** badge appears when you have edited fields. |
| **Hosting** | Use **Save hosting** inside the hosting wizard. The global save bar is hidden on this tab. |
| **Project** | Upload files from the simple view, or save individual files in the advanced editor. |
| **Domains, Webhooks, Redirects, API** | Each action saves immediately (add domain, delete webhook, etc.). |

If you leave General (or Security / Storage / Monitoring) with unsaved edits, the browser may warn you before you navigate away.

### Hosting wizard

**Settings → Site → Hosting** walks you through three steps:

1. **CMS URL** — Where you open the admin (for example `https://cms.example.com`). Use **Use current host** if this install is already on the right domain. If you run Docker or Dokploy, check **Self-hosted / Docker** to see the deployment checklist.
2. **Public site** — Choose whether visitors have no public site, a site hosted elsewhere, or files in Birkly’s **project** folder.
3. **Preview** — Read-only summary of where you manage content vs where visitors browse, plus the `birkly-client.js` snippet for external sites.

The same wizard appears during **onboarding** after you create the first admin account.

### Project tab: simple and advanced

**Settings → Site → Project** opens in **simple** mode:

- Upload files with **Upload files**
- See a flat list of files in the project workspace
- **Visit public site** when a public URL is configured

Need the full IDE-style experience? Enable **Advanced file editor** to browse folders, edit source, and view activity. Simple mode stays the default so non-developers are not dropped into a code tree.

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

Settings deep links use query parameters:

```
/admin?page=settings&area=site&tab=hosting
/admin?page=settings&area=integrations&tab=ai-integrations
```

Legacy links such as `?page=settings&tab=hosting` are rewritten to include `area=site`.

### Save bar implementation

- Sticky bar: `main-actions-bar--sticky` (hidden via `.is-hidden` on independent-save tabs)
- Dirty tracking: `settings-page.js` — `GLOBAL_SAVE_TABS` vs `INDEPENDENT_SAVE_TABS`
- Per-tab labels: “Save general settings”, “Save security settings”, etc.

### Hosting API

The wizard reads and writes `api/hosting.php` (same as Phase 43). CMS URL, public URL mode, same-host routing, and client snippet are unchanged — only the presentation layer changed in P44.

### Project advanced panel

`#project-advanced-panel` is `hidden` until `#project-advanced-editor-toggle` is checked. State is managed in `admin/js/project-settings.js` (`advancedMode`).

### Design tokens

Mint primary, spacing, typography, and button classes are documented for developers in the Birkly repo: `docs/admin-design-system.md`.

### Verification

Phase 44 acceptance checks live in `docs/reviews/P44-verification-matrix.md` (V-UX-01 through V-UX-33).
