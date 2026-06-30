# Troubleshooting

This page lists common issues when using or deploying Birkly and suggests steps to fix them. Use it after checking the relevant feature doc (e.g. [Website integration](../04-integration/website-integration.md), [Deployment](deployment.md)) and your server/PHP error logs.

## Summary

**Can’t log in** — Check email/password; reset password if your setup allows it; ensure the user exists and is not disabled. **Content not showing on the site** — Confirm the client script URL and `data-cms-url`; check that entries are **Published**; ensure CORS allows your site’s domain; look at the browser console and network tab for failed requests. **Upload or save fails** — Check folder permissions (content, media, settings writable by the web server); check PHP upload size and execution limits. **500 or white screen** — Enable temporary error display or check server/PHP error logs; often a permission issue, missing PHP extension, or broken plugin. **Template placeholders not replaced** — Ensure the client script loads and the template syntax matches the docs; confirm the collection handle and that the API returns data. See below for more.

## Beginner

**I can’t log in**

- **Wrong password** — Use “Forgot password” if available; otherwise an admin must reset your password or re-invite you.
- **Account locked** — After too many wrong attempts, the account may be temporarily locked. Wait a few minutes or ask an admin to clear the lock (if the feature exists).
- **2FA code not working** — Check that your phone or app time is correct (TOTP codes depend on time). Use a backup code if you have one. If you lost access, an admin may need to reset 2FA for your account.
- **Session keeps expiring** — Log in again. If it happens often, your host or developer may need to check session and cookie settings.

**Content doesn’t show on my website**

- **Script not loading** — In the browser, open Developer Tools (F12) → Network. Reload the page and check if `birkly-client.js` loads (no 404). Fix the script `src` and make sure `data-cms-url` points to your Birkly URL (no trailing slash unless your setup expects it).
- **Entries are draft** — The public API usually only returns **published** entries. In the admin, open the entry and set Status to **Published**, then save.
- **Wrong collection name** — In your template you must use the exact collection **handle** (e.g. `'blog'` not `'Blog'`). Find it in Content → click the collection → check the handle in settings.
- **CORS** — If your website is on a different domain than the CMS, the browser may block the request. The Birkly server must allow your site’s domain (CORS). Your host or developer can configure this.

**I can’t save an entry or upload a file**

- **Permissions** — The server needs permission to write to `content/`, `media/`, and `settings/`. On Linux the web server user (e.g. `www-data`) must own those folders or have write access. Your host or developer can fix this (e.g. `chown`, `chmod`).
- **File too large** — PHP has limits on upload size. Your host may need to increase `upload_max_filesize` and `post_max_size` in PHP settings.
- **Disk full** — The server may have run out of space. Check with your host.
- **Validation** — A required field might be empty, or a field format (e.g. email) might be wrong. Check the error message on the form.

**500 error or blank white page**

- **Server error** — Something crashed on the server. In production you usually don’t see the error on the page. Your host or developer should check the **PHP error log** or **server error log** to see the real message. Common causes: missing PHP extension, wrong file permissions, or a broken plugin.
- **Plugin** — Try disabling plugins one by one (Settings → Plugins) and reload. If the site works after disabling one, that plugin may be incompatible or buggy; update it or contact the plugin author.
- **Memory** — If the error says “memory limit”, the host may need to increase PHP’s `memory_limit`.

### User Management plugin won't enable

- **Symptom** — **Settings → Plugins** shows “Plugin dependencies not met” (or similar) when enabling **User Management**, even though no other plugins are required.
- **Cause** — Older Birkly builds checked plugin dependencies against an empty `$haru_plugins` registry instead of `$birkly_plugins`, so valid plugins were reported as missing.
- **Fix** — Update to a Birkly build with the P5.2 plugin-registry fix (`core/plugins/dependencies.php` uses `$birkly_plugins`). After updating, enable the plugin again; the settings UI should show specific `errors[]` messages if a real dependency is missing.

**Template tags don’t turn into content**

- **Braces** — Use single braces with spaces: `{ title }` not `{{ title }}`. Check the [Templating](../03-templating/templating-overview.md) docs for the exact syntax.
- **Collection handle** — Must match exactly (often lowercase, e.g. `'blog'`). Check in the admin.
- **Script and API** — The client script must load and run. Open the browser console (F12 → Console) for JavaScript errors. In Network, check the request to the CMS API; if it returns an error, fix the URL or server (see error logs).
- **Cache** — Try a hard refresh (Ctrl+F5 or Cmd+Shift+R) or clear any CDN/cache so you see the latest page and script.

**Automation or webhook doesn’t run**

- **Scheduled** — The server must have something that runs the scheduler (e.g. a cron job). Ask your host or developer if the cron is set up and running.
- **Webhook** — Call the exact URL shown in the workflow; use POST and the body format your workflow expects. Check if a firewall or proxy is blocking the request. In the admin, check Automation or Activity logs for “run” or “error” messages.
- **Conditions** — If the workflow has conditions (e.g. “payload must have email”), make sure the request you send satisfies them.

**Getting more help**

- Note your **Birkly version**, **PHP version**, and **web server** (e.g. Apache/Nginx).
- Note **what you did**, **what you expected**, and **what actually happened**.
- If you have an error message or a log line, include it (remove passwords or secrets). Use this when asking in community forums or opening a support request.

## Advanced Users

**Login and authentication**

- Wrong password → forgot password or admin reset. Account locked → wait or admin clear. 2FA not accepted → check device time, backup code, or admin reset 2FA. Session expired → re-login; check session config and cookie domain/path.

**Content not showing (frontend)**

- Script 404 or wrong `data-cms-url` → fix src and attribute. CORS → allow origin on server/proxy. Entries draft → publish. Wrong handle → exact handle in template. API 4xx/5xx → check Network tab and server/error logs.

**Save or upload failures**

- Permissions → content/, media/, settings/ writable by web server user; chown/chmod. Upload size → php.ini `upload_max_filesize`, `post_max_size`. Disk full. Plugin/validation → disable plugins or fix required/format.

**500 or blank page**

- PHP errors → temporary `display_errors = On` in dev or use error_log in production; fix missing extension, syntax, file. Permissions → ownership and perms on PHP and writable dirs. Plugin → disable one by one. **User Management activation** → update core if generic “dependencies not met” (registry bug: `$haru_plugins` vs `$birkly_plugins` before P5.2). Memory → increase `memory_limit`.

**Template syntax**

- Single braces, correct spacing; handle case-sensitive. Client must run after DOM ready; no prior JS errors. Clear cache/CDN.

**Automation / webhooks**

- Scheduled → cron or runner configured and running. Webhook → exact URL, POST, body format; no firewall/proxy block. Conditions → payload meets conditions. Logs → automation/audit logs for run and error.

**Getting help**

- Error logs (server, PHP, Birkly). Version info (Birkly, PHP, server). Reproduce steps. Use when reporting.

## Related

- [Deployment](deployment.md)
- [Security](security.md)
- [Website integration](../04-integration/website-integration.md)
- [Client library](../04-integration/client-library.md)
