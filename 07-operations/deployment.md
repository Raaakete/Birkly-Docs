# Deployment

Deployment is how you put Birkly on a server so it’s reachable on the internet (or on an internal network). You need a web server (e.g. Apache or Nginx), PHP, and optionally a database; then you upload or clone the Birkly files, point the server at the app, and configure environment and permissions.

## Summary

**Deploying Birkly** means: (1) Have a server with **PHP** (version required by Birkly) and a **web server** (Apache or Nginx). (2) Upload or clone the Birkly files so the **document root** (or a subdirectory) points to the folder that contains `index.php`. (3) Ensure **content**, **media**, and **settings** (and any other writable dirs) are writable by the web server. (4) Open the site in the browser and complete setup (first user, project name). Use **HTTPS** in production and restrict admin access (e.g. firewall or IP) if possible. See [Security](security.md) and [Backup and restore](backup-and-restore.md).

## Beginner

**Deployment** means putting Birkly on a server so you and your team can open it in a browser and so your website can load content from it. You (or your host) set up the server once; after that, you use the admin and your site as usual.

**What you need**

- A **server** that can run PHP and a web server (Apache or Nginx). Many shared hosts and cloud providers support this.
- The **Birkly files** — Either upload them (FTP/SFTP) or clone from Git. The server’s “document root” (the folder that serves the website) should point to the Birkly folder that contains `index.php` and the `admin/` folder.
- **Writable folders** — The web server must be allowed to write to `content/`, `media/`, and `settings/` (and sometimes `data/`, `database/`). Your host or developer sets permissions so the server user can create and change files there.

**Typical steps (overview)**

1. **Server** — PHP and web server installed; document root or virtual host pointing to the Birkly folder.
2. **Upload/clone** — Put Birkly files in place.
3. **Permissions** — Make `content/`, `media/`, `settings/` writable by the web server user.
4. **Open in browser** — Go to `https://your-domain.com` (or the path where Birkly is). Complete first-time setup: create the first admin user, set project name.
5. **HTTPS** — In production, use HTTPS (SSL certificate) so login and data are encrypted. Many hosts offer free Let’s Encrypt certificates.

**Example: shared hosting**

- Upload the Birkly zip (or extract it) into a folder (e.g. `public_html/cms/`).
- In the host’s control panel, set the domain or subdomain to point to that folder.
- Set folder permissions for `content/`, `media/`, `settings/` to be writable (often 755 or 775; the host’s docs will say).
- Visit `https://your-domain.com/cms/` and follow the setup wizard.

**After deployment**

- Create the first user, set project name and branding.
- Test: log in, create a collection, add an entry, and load a public page that uses the Birkly client.
- Set up [Backup and restore](backup-and-restore.md) and review [Security](security.md).

## Advanced Users

**Server requirements**

- **PHP** — Version required by Birkly (e.g. PHP 7.4 or 8.x). Extensions: typically `json`, `mbstring`, `fileinfo`, `curl`; optionally PDO for database.
- **Web server** — Apache (with `mod_rewrite`) or Nginx. Birkly uses a front controller (`index.php`); route all requests to it.
- **Optional:** Database (SQLite or MySQL) for users/sessions or plugins.
- **Disk** — Space for content, media, logs.
- **Memory** — PHP `memory_limit` sufficient for uploads and plugins (e.g. 128M+).

**Directory layout and permissions**

- **Writable by web server:** `content/`, `media/`, `settings/`, `data/` (if present), sometimes `database/`, `plugins/`. On Linux: `chown` to web server user; `chmod` e.g. 755/775 for dirs, 644 for files. Do not expose `.env`, `content/`, or `settings/` as static URLs.

**Web server config**

- **Apache:** Enable `mod_rewrite`; use provided `.htaccess` or equivalent so requests go through `index.php`.
- **Nginx:** `try_files` or `location /` forwarding to `index.php` with request URI. See `nginx.conf.example` in repo.
- **HTTPS** — Redirect HTTP to HTTPS; use valid certificate (e.g. Let’s Encrypt) in production.

**Environment and config**

- **Base URL** — Set in settings or env so links and client script point to the correct domain.
- **Secrets** — DB credentials, API keys from env or secure config, not from repo.
- **Debug** — Disable in production; enable only for temporary troubleshooting.

**Post-deploy**

- First admin user (script or onboarding). Set project name and branding. Test login, collection, entry, public page. Set up [Backup and restore](backup-and-restore.md) and [Security](security.md).

## Related

- [Security](security.md)
- [Backup and restore](backup-and-restore.md)
- [Troubleshooting](troubleshooting.md)
