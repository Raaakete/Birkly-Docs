# Security

Security for Birkly means protecting the admin, content, and any public API from unauthorized access and common attacks. Use HTTPS, strong passwords, limited roles, and safe server configuration so the CMS stays safe in production.

## Summary

**Do this:** (1) Use **HTTPS** everywhere so login and data aren’t sent in clear text. (2) Use **strong passwords** and **2FA** for admin accounts. (3) Give users the **lowest role** they need (viewer/editor instead of admin). (4) Keep Birkly and **plugins updated**. (5) Restrict **write access** to content/media/settings to the web server only; don’t expose them as direct URLs. (6) If you have a **public API**, use **rate limiting** and optional tokens for submit endpoints; don’t expose admin credentials. (7) **Back up** regularly. See [Deployment](deployment.md) and [Backup and restore](backup-and-restore.md).

## Beginner

**Security** here means: only the right people can log in and change content, and the server and data are protected from common risks.

**Essential steps**

1. **HTTPS** — Always use HTTPS (the padlock in the browser) for your Birkly URL. That way passwords and session data are encrypted. Your host can usually set this up (e.g. free Let’s Encrypt certificate).
2. **Strong passwords** — Use long, unique passwords for admin accounts. If Birkly supports it, turn on **two-factor authentication (2FA)** so even if someone gets the password, they need a code from your phone or app.
3. **Roles** — Give each user only the access they need. If someone only edits content, make them an Editor, not an Admin. Admins can change settings, users, and plugins—keep that to a small number of people.
4. **Updates** — Install Birkly and plugin updates when they’re released; they often include security fixes. See [Updates](../06-extensibility/updates.md).
5. **Backups** — Back up content, media, and settings regularly so you can recover after a mistake or attack. See [Backup and restore](backup-and-restore.md).

**Public forms (contact form, etc.)**

- Use the **public submit** API or secure form endpoint—never put admin login or admin API keys in your website’s code. Enable **rate limiting** and **CAPTCHA** (if available) to reduce spam and abuse. The server should validate and sanitize all form input.

**Who has access**

- Only people who need to manage content or settings should have admin accounts. Don’t share one login; create separate accounts and use roles. If someone leaves the team, disable or remove their account.

**If something goes wrong**

- If you suspect a compromised password, change it and enable 2FA. If you see unexpected changes in the audit log, review who has access and consider rotating passwords. Restore from a known-good backup if data was altered.

## Advanced Users

**HTTPS**

- Use HTTPS in production. Redirect HTTP to HTTPS; valid certificate (e.g. Let’s Encrypt). Protects login, session cookies, API traffic from eavesdropping and tampering.

**Authentication and access control**

- **Passwords** — Enforce strength (length, complexity) if supported. Encourage 2FA for all admins.
- **Roles** — Least privilege: Editor or Viewer instead of Admin where possible. Only admins manage users, settings, plugins.
- **Sessions** — Invalidate on logout; expire after inactivity; secure, HTTP-only cookies.
- **Admin URL** — Optionally restrict `/admin` by IP or VPN (Nginx `allow`/`deny`, firewall). Optional: rename admin path if supported to reduce automated scanning.

**File and directory security**

- **Writable dirs** — Only web server user needs write to `content/`, `media/`, `settings/`. Restrict execute where not needed.
- **No direct access** — Do not serve `content/`, `settings/`, `.env`, or DB files as static files; route through app or deny in server config.
- **Uploads** — Validate file types and sizes; store outside doc root or serve with safe headers (no execution).
- **Plugins** — Install only from trusted sources; they run with CMS privileges.

**Public API and forms**

- **Read API** — Generally safe to expose; use CORS for allowed origins; rate limit. **Submit/forms** — Rate limiting, CAPTCHA, or tokens; no admin credentials on frontend; validate and sanitize server-side.

**Server and PHP**

- **PHP** — Disable dangerous functions if possible; supported PHP version. `display_errors` off in production.
- **Updates** — Apply security updates to OS, PHP, web server, Birkly, plugins.
- **Headers** — Consider X-Frame-Options, Content-Security-Policy via server or app.

**Backups**

- Back up content, media, settings, database regularly; store off-server; test restore. See [Backup and restore](backup-and-restore.md).

**Deploy health and secrets (P88)**

- **Public health:** `GET /api/deploy_revision.php` returns only `status`, `service`, `build_revision`, and `time` — no installation id, data paths, or hosting env maps.
- **Diagnostics:** Set `BIRKLY_DEPLOY_DIAG_SECRET` on the server. Use `?action=diagnose` (or other diagnostic actions) only with header `X-BIRKLY-DEPLOY-SECRET` matching that value. Never commit the secret, paste it in tickets, or pass it in URLs (query strings appear in logs).
- **Emergency password reset:** Use `php scripts/reset-admin-password.php --email=…` and enter the password at the prompt, or set `BIRKLY_RESET_PASSWORD` in the container env for one run. Do **not** use `--password=…` on the command line (visible in `ps`).
- **Runtime data:** Keep `data/`, `settings/`, and `users/` off git and off public HTTP. Security scanners that read live volumes may flag local JSON; that is not the same as secrets in the repository.

## Related

- [Deployment](deployment.md)
- [Backup and restore](backup-and-restore.md)
- [Roles and permissions](../01-admin/roles-and-permissions.md)
- [Account](../01-admin/account.md)
- [Public forms](../04-integration/public-forms.md)
