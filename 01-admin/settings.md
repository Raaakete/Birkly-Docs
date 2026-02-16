# Settings

## Summary

Settings is where you configure the Birkly installation itself: project name, branding (logo, favicon), users and roles, plugins, and optionally webhooks, updates, or API options. Changes here apply to the whole CMS, not to a single collection or entry. Usually only administrators can access and change Settings.

## Beginner

**Settings** (often under a gear icon or in the sidebar) is the control panel for *how* the CMS works and looks—not for editing the content of your blog or products, but for things like the name of the project, who can log in, and what they’re allowed to do.

**What you can change (typical sections)**

- **Project name** — The name shown in the admin (e.g. in the sidebar or the browser tab). This is only for people who use the admin; it does not change your website’s title or address.  
  **Example:** You set the project name to “Acme Blog” so that when your team logs in they see “Acme Blog” at the top instead of a generic label.

- **Branding** — Upload a **logo** and/or **favicon** so the admin panel shows your company or site branding. Some setups also let you add custom CSS to change colours or fonts in the admin.

- **Users and roles** — See who has an account, invite new users (they get an email to set their password), and assign **roles** (e.g. Administrator, Editor, Viewer). Roles control what each person can do—for example, Editors can create and edit content but not change settings or add users.  
  **Example:** You invite a colleague with the “Editor” role so they can manage blog posts but not delete collections or change the project name.

- **Plugins** — Enable or disable **plugins** (add-ons that add features). Some plugins have their own options (e.g. API keys) that you set in Settings or on a separate plugin page.

- **AI Connections** — Add and manage AI providers (OpenAI, Ollama, Anthropic, etc.) for the in-admin AI assistant. You set the API key, model, role, and whether write actions require approval. See [AI overview](ai-overview.md) and [AI connections](ai-connections.md).

- **Webhooks** (if available) — Configure URLs that Birkly will call when something happens (e.g. when a new entry is published). Used for integrations with other tools.

- **Updates** (if available) — Check for new versions of Birkly or plugins and apply updates. Always back up before updating.

- **Audit log / Activity** — A link or shortcut to view a log of who did what (e.g. who edited which entry). Useful for accountability and troubleshooting.

**Who can use Settings**

Usually only users with the **Administrator** role. Editors and viewers often don’t see Settings at all, or they see it but can’t change anything. That way only trusted people can change the project name, add users, or enable plugins.

**After you change something**

Click **Save** (or save per section). Some changes (e.g. project name, logo) apply immediately when you refresh the admin. Others (e.g. server or API options) might need a restart or a cache clear—the interface or your host’s docs will say if that’s the case.

## Advanced Users

**Structure:** Settings are typically stored in a config directory (e.g. `settings/`) as JSON files: `admin.json` (project name, maybe timezone), `branding.json` (logo path, favicon), `plugins.json` (enabled plugins + config), `users` or DB for auth. Webhooks, CORS, rate limits may be in their own files or in a single config.

**Sections (implementation-dependent):**

- **General:** Project name, timezone, language (admin UI).
- **Branding:** Logo URL/path, favicon; optional custom CSS for admin.
- **Users/Roles:** User list, invite flow, role assignment. Roles map to permissions (view/edit content, manage media, manage users, manage settings, manage plugins). Stored in DB or files; auth (session, 2FA) separate.
- **Plugins:** Enable/disable by plugin id; per-plugin config (API keys, options) in plugin.json or plugin-specific storage.
- **Webhooks:** Outgoing webhook URLs + event selection (e.g. entry.created, entry.published). Payload format and retry behaviour depend on implementation.
- **Updates:** Version check (remote or local); apply core/plugin updates (replace files, run migrations). Require backup and possibly downtime.
- **API/Public:** CORS allowed origins, rate limit rules, optional API keys for submit. See [Public API](../04-integration/public-api.md).

**Access control:** Settings UI and API are protected; only users with “manage settings” (or equivalent) permission can read/write. Changing roles or permissions takes effect on next request or login depending on session handling.

## Related

- [Roles and permissions](roles-and-permissions.md)
- [Account](account.md)
- [AI overview](ai-overview.md)
- [AI connections](ai-connections.md)
- [Plugins](../06-extensibility/plugins.md)
- [Updates](../06-extensibility/updates.md)
