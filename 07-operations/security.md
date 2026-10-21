# Security

Security for Birkly means protecting the admin, content, and any public API from unauthorized access and common attacks. Use HTTPS, strong passwords, limited roles, and safe server configuration so the CMS stays safe in production.

## Summary

**Do this:** (1) Use **HTTPS** everywhere so login and data aren’t sent in clear text. (2) Use **strong passwords** and **2FA** for admin accounts. (3) Give users the **lowest role** they need (viewer/editor instead of admin). (4) Keep Birkly and **plugins updated**. (5) Keep **PHP** on a **patched version** on self-hosted servers (runtime security updates are separate from Birkly releases — see [PHP runtime security](php-runtime-security.md)). (6) Restrict **write access** to content/media/settings to the web server only; don’t expose them as direct URLs. (7) If you have a **public API**, use **rate limiting** and optional tokens for submit endpoints; don’t expose admin credentials. (8) **Back up** regularly. See [Deployment](deployment.md) and [Backup and restore](backup-and-restore.md).

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

**Dependencies and scanners**

- Birkly **core** does not ship a `vendor/` tree or `composer.lock`; `composer.json` only declares PHP version and optional autoload metadata. Tools that warn about a missing lockfile are tuned for Composer apps — that warning is **expected** for Birkly. Runtime pins are the **Docker/PHP image**, extensions, and **plugin** versions from Hub. See the CMS repo `docs/security/dependencies.md` (mirrored in product docs over time).

**Server and PHP**

- **PHP** — Run a **supported, patched** version (8.1+ minimum; 8.3.x latest patch recommended for production). Verify with `/api/health.php` → `"php"`. Disable dangerous functions if possible; `display_errors` off in production.
- **Updates** — Apply security updates to **PHP and the OS** on your schedule, plus web server, Birkly, and plugins. PHP critical advisories may require same-day patching on internet-facing hosts — see [PHP runtime security](php-runtime-security.md).
- **Headers** — Consider X-Frame-Options, Content-Security-Policy via server or app.

**Backups**

- Back up content, media, settings, database regularly; store off-server; test restore. See [Backup and restore](backup-and-restore.md).

**Deploy health and secrets (P88)**

- **Public health:** `GET /api/deploy_revision.php` returns only `status`, `service`, `build_revision`, and `time` — no installation id, data paths, or hosting env maps. Dokploy and other monitors can use this URL with **no extra configuration**.
- **Diagnostics:** While logged in to **Admin** (read settings or higher), use `/admin/deploy-check.php` or `/api/admin_deploy_diagnostics.php` with your session cookie. Mutating actions use **POST** with CSRF, like other admin APIs. No server env secrets are required.
- **First admin:** Use onboarding, or `BIRKLY_ADMIN_PASSWORD='…' php scripts/create-default-user.php`. The script does not create `admin@localhost` / `password`, and it does nothing when an admin already exists.
- **Emergency password reset:** Use `php scripts/reset-admin-password.php --email=…` and enter the password at the prompt, or set `BIRKLY_RESET_PASSWORD` for that one run. The script rejects `--password=…` and refuses to run over HTTP.
- **Runtime data:** `data/`, `settings/`, `users/`, `content/`, `core/`, `logs/`, `cache/`, and `tests/` are refused by the shipped Apache and nginx configs and stay off git. PHP can still write them. `scripts/commerce-import-sync.php` stays on HTTP and requires its cron token.

## Related

- [PHP runtime security](php-runtime-security.md)
- [Deployment](deployment.md)
- [Backup and restore](backup-and-restore.md)
- [Roles and permissions](../01-admin/roles-and-permissions.md)
- [Account](../01-admin/account.md)
- [Public forms](../04-integration/public-forms.md)
