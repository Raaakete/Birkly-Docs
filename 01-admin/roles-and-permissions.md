# Roles and Permissions

## Summary

Roles in Birkly define what each user can do: for example **Viewer** (see content only), **Editor** (create and edit content and media), or **Admin** (full access including settings, users, and plugins). Permissions are the specific abilities (e.g. “edit entries,” “manage users”) attached to each role. When you invite or create a user, you assign one role; use the least powerful role that fits the person’s job. Only administrators should change roles or invite users.

## Beginner

**Roles** are like job types. Each user has exactly one role, and that role decides what they can see and do in the admin.

**Typical roles**

- **Viewer** — Can log in and **see** content and media (collections, entries, uploads). They **cannot** create, edit, or delete anything. Use this for stakeholders, clients, or reviewers who only need to look at what’s there.  
  **Example:** A client is a Viewer so they can check the latest blog posts and product text without being able to change anything.

- **Editor** — Can **create and edit** entries and collections, and **upload and manage** media. They can change content, add new entries, and organize the Media Library. Usually they **cannot** change the project name, add or remove users, change roles, or enable/disable plugins. Use this for content managers and writers.  
  **Example:** Your colleague is an Editor so they can publish blog posts and update product descriptions, but they can’t invite new users or change settings.

- **Admin (Administrator)** — Can do **everything**: all content and media, plus **Settings** (project name, branding, users, roles, plugins, webhooks, updates, audit log). Use this only for people who need to manage the CMS itself.  
  **Example:** You are the site owner, so you have the Admin role; your intern only needs to edit the blog, so they get Editor.

**Permissions** are the individual “rights” (e.g. “view entries,” “edit entries,” “delete entries,” “manage users”). Each role is a bundle of permissions. The admin may show a grid: one row per role, one column per permission, with a tick if that role has that permission. You normally don’t need to tick boxes one by one—you pick a role and the permissions come with it. Some setups let you create custom roles and choose exactly which permissions they have.

**Assigning a role**

- When you **invite** a new user (e.g. from Settings → Users → Invite), you enter their email and choose a role (Viewer, Editor, or Admin). They receive an email to set their password and then can log in with that role.
- For **existing users**, an administrator can change their role in Settings → Users (or similar). The change usually applies the next time they use the CMS (or immediately, depending on how the system works).

**Good practice**

Give people the **least powerful role** they need. If someone only needs to review content, make them a Viewer. If they need to edit content but not touch settings or users, make them an Editor. Reserve Admin for a small number of trusted people.

**Who can change roles**

Only users who have permission to manage users (typically Administrators). Editors and Viewers cannot change roles or invite users.

## Advanced Users

**Model:** Users have one role; roles have a set of permissions. Stored in DB or config (e.g. `users` table + `roles` / `permissions` config). Auth middleware checks permission for each admin action (e.g. `edit_entries`, `manage_users`); Public API is usually unauthenticated read (and optionally submit with separate auth/rate limit).

**Default roles (typical):**

| Role    | Typical permissions |
|---------|----------------------|
| Viewer  | view_entries, view_collections, view_media |
| Editor  | view + create/edit/delete entries, manage collections, manage media |
| Admin   | all of the above + manage_users, manage_settings, manage_plugins, view_audit_log |

**Custom roles:** Some installs allow defining roles with a custom permission set (e.g. “Author” with edit_entries only for specific collections). Plugins can register extra permissions (e.g. `use_plugin_analytics`); these appear in the role matrix.

**Enforcement:** Admin UI hides or disables actions the user can’t do; API returns 403 if the user lacks the required permission. Role change applies on next request or after re-login depending on whether permissions are read from DB on each request or cached in session.

**Example permission check (pseudocode):** Before saving an entry, backend checks `user.has('edit_entries')` (and optionally collection-specific rules). Public `GET /api/public/collections/...` does not use admin roles; it’s read-only and often unauthenticated.

## Related

- [Settings](settings.md)
- [Account](account.md)
- [Audit log and activity](../06-extensibility/audit-log-and-activity.md)
