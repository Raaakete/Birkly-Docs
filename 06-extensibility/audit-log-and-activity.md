# Audit Log and Activity

The audit log and activity features in Birkly record who did what and when in the admin—e.g. “User X edited entry Y at 14:30”, “User Z uploaded a file”. They help with accountability, debugging, and compliance.

## Summary

**Activity** (or **Audit log**) shows a history of actions in the CMS: who logged in, who created or edited an entry, who changed settings, etc. Open it from **Settings** or the sidebar (e.g. **Activity** or **Audit log**). Use it to see recent changes, track who updated content, or investigate mistakes. Entries may show user, action type, date/time, and sometimes the affected resource (entry, collection, setting). How long logs are kept depends on your installation.

## Beginner

**Activity** and **Audit log** are your “who did what, when” history inside Birkly. They help you see recent changes, find who edited something, and fix mistakes or comply with policies.

**What you’ll see**

- **Recent activity** — Often a short list or timeline on the Dashboard or a dedicated Activity page: “John edited ‘About us’ 10 minutes ago”, “Jane uploaded hero.jpg”, “Admin changed Settings”. Good for a quick overview.
- **Audit log** — A fuller, searchable or filterable list. You can filter by user, date range, or action type (e.g. “all logins”, “all entry changes”). Useful when you need to trace a specific change or prepare a report.

**Typical actions that get logged**

- **Logins** — Who logged in (and sometimes failed login attempts).
- **Content** — Entry created, updated, or deleted; collection created or updated.
- **Media** — File uploaded or deleted.
- **Settings** — Changes to project name, branding, roles, plugins.
- **Users** — User created, invited, or role changed.

The exact list depends on your Birkly version. Some actions (e.g. just viewing a page) may not be logged.

**Where to open it**

- **Activity:** Often under the **Dashboard** or a sidebar item like **Activity** or **Recent activity**.
- **Audit log:** Often under **Settings → Audit log** or **Settings → Activity**. Some installations restrict this to administrators; see [Roles and permissions](../01-admin/roles-and-permissions.md).

**Example: finding who changed a post**

1. Open **Audit log** (or **Activity**).
2. Filter by “Entry updated” or search for the entry title or ID.
3. Check the list for the time of the change and the user who made it.

**Privacy**

Logs can contain personal data (user emails, IP addresses). Your organization should treat them according to your privacy policy and retention rules. Limit who can see the audit log (e.g. admins only).

## Advanced Users

**What gets logged**

- **User actions** — Login, logout, failed login attempts.
- **Content** — Entry created, updated, deleted; collection created/updated.
- **Media** — File uploaded, deleted.
- **Settings** — Project name, roles, plugins, etc.
- **Users** — User created, invited, role changed.

Instrumentation is version-dependent; some read-only operations may be excluded.

**Where to view**

- **Activity** — Timeline or list of “recent activity” (Dashboard or dedicated page). Quick overview.
- **Audit log** — Full, filterable log (user, date, action type, resource). For review, export, or compliance.

Access may be restricted by role (e.g. admin only); see [Roles and permissions](../01-admin/roles-and-permissions.md).

**Retention and storage**

- Logs may be stored in files (JSON, log files) or in a database. Retention (e.g. 90 days) may be configurable or fixed. For large deployments, rotate or archive logs to limit disk usage.

**Privacy and compliance**

- Logs can contain personal data (user emails, IPs). Handle per privacy policy and retention requirements. Restrict audit log access to trusted roles.

## Related

- [Roles and permissions](../01-admin/roles-and-permissions.md)
- [Dashboard](../01-admin/dashboard.md)
- [Settings](../01-admin/settings.md)
