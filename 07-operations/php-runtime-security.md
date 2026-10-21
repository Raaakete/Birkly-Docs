# PHP runtime security (self-host)

Critical fixes in **PHP itself** (the language runtime) affect every self-hosted Birkly install. They are **not** fixed by updating Birkly CMS files or Hub plugins alone — you must upgrade **PHP on the host** (or rebuild your Docker image) and restart PHP-FPM or the container.

## Summary

**Minimum PHP to run Birkly:** **8.1+** (official plugins may require 8.1). **Recommended for production:** **PHP 8.3** on the **latest security patch** for that branch (for example **8.3.36+** after the October 2026 PHP2Shell advisories). **Verify:** `GET /api/health.php` → JSON field `"php"`. **Local trials:** `php -v`, or `runtime/php/php.exe -v` on Windows when using the bundled PHP from `install-php.ps1`. See [Self-host install](self-host-install.md), [Deployment](deployment.md), and [Hosting on Dokploy](dokploy-hosting.md).

## Beginner

**Birkly vs PHP**

- **Birkly CMS** is your content, admin, and plugins.
- **PHP** is the program your server runs to execute Birkly. When PHP publishes a security update, **you** (or your host) must install it on the machine or container that serves Birkly.

Updating Birkly from GitHub, a release zip, or **Plugins → Hub** does **not** replace upgrading PHP.

**What to do when PHP announces a critical fix**

1. **Check your version** — Open `https://your-birkly-host/api/health.php` and read `"php"`. On localhost, run `php -v` in a terminal (Windows zip: use the PHP under `runtime/php/` if you installed via `install-php.ps1`).
2. **Upgrade PHP** using the method that matches your setup:
   - **Docker / Dokploy** — Rebuild the image from current Birkly `main` (Dockerfile pins a patched PHP base image) and redeploy. Use **Rebuild** with cache cleared if the version does not change.
   - **Shared hosting** — In the control panel, select the newest **PHP 8.3.x** (or your branch’s patched version). Ask support if the panel does not offer it yet.
   - **Windows zip** — Re-run `install-php.ps1` from the latest release, then restart `start-server.ps1`.
   - **Mac / Linux** — Upgrade system or Homebrew PHP, then restart `./start-server.sh` or your web server.
3. **Confirm** — Health endpoint or `php -v` shows the patched version. Restart once more if workers were still on the old binary.

**Internet-facing vs localhost only**

- Sites reachable on the public internet should be patched **promptly** when PHP issues critical advisories.
- Local-only installs are lower risk but should still be updated before you expose the site or copy the setup to a server.

## Advanced Users

**Compatibility vs security**

| Concern | Guidance |
|---------|----------|
| **Minimum supported** | PHP **8.1+** for current official plugins (`requires_php` in plugin manifests). |
| **Recommended production** | PHP **8.3.x** latest patch; Docker images use `php:8.3.36-fpm-bookworm` or newer as maintained in the Birkly `Dockerfile`. |
| **Other branches** | If you run 8.2, 8.4, or 8.5, apply that branch’s **current security release** from [php.net](https://www.php.net/downloads.php). |
| **PHP 8.0 and older** | Not supported for new installs; upgrade to 8.1+ (prefer 8.3). |

**PHP2Shell (October 2026 example)**

CVE-2026-109618 and CVE-2026-109619 are **PHP core** RCE issues affecting typical web SAPIs (PHP-FPM, php-cgi, etc.). Patched releases included **8.3.36**, **8.2.35**, **8.4.27**, and **8.5.12**. There is no complete mitigation in Birkly application code — patch the runtime.

**Verification endpoints**

| Check | URL / command |
|-------|----------------|
| CMS (public, no auth) | `GET /api/health.php` — includes `"php": "8.3.36"` |
| Deploy revision only | `GET /api/deploy_revision.php` — does **not** include PHP version |
| CLI | `php -v` on the same binary FPM uses |

**Docker / Dokploy**

After merging Dockerfile changes on GitHub, trigger a full image **Rebuild** (not only container restart). Confirm `FROM php:8.3.36-fpm-bookworm` (or newer) appears in the deployment build log.

**Composer metadata**

Birkly’s root `composer.json` may still declare `"php": ">=7.4"` for packaging metadata only. **Do not** treat that as the production requirement — follow this page and [Self-host install](self-host-install.md).

**Official references**

- [PHP downloads and release notes](https://www.php.net/downloads.php)
- [NCSC-NL php2shell operational notes](https://github.com/NCSC-NL/php2shell/blob/main/README.md) (example of a coordinated PHP advisory)

## Related

- [Self-host install](self-host-install.md)
- [Deployment](deployment.md)
- [Hosting on Dokploy](dokploy-hosting.md)
- [Security](security.md)
- [Monitoring and health alerts](monitoring-alerts.md)
- [Troubleshooting](troubleshooting.md)
