# Hosting on Dokploy (Docker)

Deploy Birkly from **`Raaakete/Birkly`** (`main`, Dockerfile, port **80**) on [Dokploy](https://dokploy.com). Birkly decides what each hostname serves — Dokploy only forwards traffic to the container.

Technical reference: [Birkly `docs/deployment/docker.md`](https://github.com/Raaakete/Birkly/blob/main/docs/deployment/docker.md).

## Summary

**CMS URL** and **public site URL** are explicit settings (admin **Settings → Hosting**), stored in `settings/hosting.json`. You do **not** need a `cms.` subdomain — any hostname works. On Dokploy, add every domain to the same app with Path **`/`** and Internal Path **`/`** (never `/project`). Mount one volume at **`/app/data`** before first admin login.

## Beginner

### Concepts

| Setting | Meaning |
|---------|---------|
| **CMS URL** | Where admin, API, and `birkly-client.js` live (e.g. `https://cms.birkly.cloud`) |
| **Public site URL** | Where visitors see your marketing site (optional; e.g. `https://birkly.cloud`) |
| **Public website mode** | **None** (CMS only) · **Hosted elsewhere** · **In Birkly** (`project/` folder) |

Birkly routes by hostname using these settings. A `cms.` prefix is **not** required — `admin.example.com` and `www.example.com` work the same way.

### Dokploy setup

| Step | Action |
|------|--------|
| 1 | Create app from GitHub → Birkly → Dockerfile, port **80**. |
| 2 | **Volume Mount** (not Bind Mount): e.g. `birkly-cms-data` → **`/app/data`**. |
| 3 | Add domains — CMS host and public host (if used) on the **same app**. |
| 4 | For **each** domain: Path **`/`**, Internal Path **`/`**, HTTPS on. |
| 5 | Deploy → **Logs** shows **Containers (1)**. |
| 6 | Open **`https://your-cms-host/admin`** → create admin **once**. |
| 7 | **Settings → Hosting** → set CMS URL and public site URL → Save. |

**Do not** set Internal Path to `/project`. That double-prefixes URLs and breaks clean public paths.

### Two domains (example)

Production layout used by Birkly:

| Host | Role | Root `/` serves |
|------|------|-----------------|
| `cms.birkly.cloud` | CMS URL | Admin dashboard |
| `birkly.cloud` | Public site URL | Marketing site from `project/` (no `/project/` in the browser) |

Both domains point to the same Dokploy app. Internal Path **`/`** on both.

In **Settings → Hosting**:

- **CMS URL:** `https://cms.birkly.cloud`
- **Public website:** In Birkly (`project/`)
- **Public site URL:** `https://birkly.cloud`

Saving auto-registers hosts in **Settings → Domains**. Use the generated integration snippet on public pages — `data-cms-url` must be the **CMS URL**, not the public host.

### First install order

Attach the volume **before** first admin login. If you created an admin without a volume, then added a new empty volume and redeployed, you must create the admin again once (the first account lived in the temporary container).

| Situation | Create admin again? |
|-----------|---------------------|
| Volume at `/app/data` from the start | No |
| No volume first, then new empty volume | Yes (once) |
| Every redeploy with volume attached | No |

## Advanced Users

### `settings/hosting.json`

```json
{
  "cms_base_url": "https://cms.birkly.cloud",
  "public_site_mode": "project",
  "public_site_url": "https://birkly.cloud",
  "same_host_landing": "admin",
  "strict_admin_host": true
}
```

| Field | Values | Notes |
|-------|--------|-------|
| `cms_base_url` | HTTPS URL | Canonical admin + API base (required after onboarding) |
| `public_site_mode` | `none` \| `external` \| `project` | `external` = site hosted outside Birkly |
| `public_site_url` | HTTPS URL or empty | Required when mode ≠ `none` |
| `same_host_landing` | `admin` \| `public` | When CMS and public share one host |
| `strict_admin_host` | boolean | Redirect `/admin` on public host to CMS URL (default `true`) |

Editable in admin or on disk under `/app/data/settings/hosting.json` (Docker). Legacy installs with empty `hosting.json` may infer CMS URL from a `cms.*` request host on first access.

### Routing

| Request | CMS host | Public host |
|---------|----------|-------------|
| `/` | Admin (or `same_host_landing`) | Public site root |
| `/admin` | Admin | Redirect to CMS `/admin` |
| `/api/*` | API | API (CORS per Domains allowlist) |

Public host with `public_site_mode: project` serves files from `project/` at clean URLs (e.g. `/about`, not `/project/about`).

### Dokploy domains checklist

- One app, all hostnames, Path **`/`**, Internal Path **`/`**, port **80**
- Volume Mount → `/app/data` (not Bind Mount to host paths — Swarm often yields **Containers (0)** / 502)
- Test: CMS root → admin · public root → site · `/api/deploy_revision.php` returns JSON

### Troubleshooting

| Symptom | Check |
|---------|-------|
| Public site shows `/project/` in URL | Internal Path must be `/`; confirm Hosting mode = `project` |
| `/admin` on public host stays on public host | Enable **Redirect `/admin` on public host** in Hosting settings |
| 502 / **Containers (0)** | Bad mount type; switch to Volume Mount |
| Wrong host serves admin | **Settings → Hosting** — CMS URL and public site URL must match Dokploy domains |
| `test.example.com` redirects to production CMS | Test app uses prod volume or prod `hosting.json` — see **Test and production** below |

## Test and production (two separate installs)

Use this when you run **two** Birkly apps (e.g. `cms.birkly.cloud` for real work and `test.birkly.cloud` for experiments).

### The one rule

**Each app gets its own volume.** Never mount the same volume name on both apps.

| | Production app | Test app |
|--|----------------|----------|
| Dokploy app name | e.g. `Birkly CMS` | e.g. `Birkly Test` |
| Domain | `cms.birkly.cloud` | `test.birkly.cloud` |
| Volume name | e.g. `birkly-cms-data` | e.g. `birkly-cms-test-data` |
| Mount path | `/app/data` | `/app/data` |

If test uses prod’s volume (or a copy of prod’s data), opening `test.birkly.cloud` redirects to `cms.birkly.cloud`. That is expected — the saved CMS URL still says production.

### Fix test redirecting to production

Pick **one** method. You only need one.

---

#### Method 1 — Environment variables in Dokploy (recommended)

Use this when you can open the Dokploy dashboard.

1. Log in to **Dokploy** (your server’s Dokploy URL).
2. Open your **Project** (the group that contains Birkly).
3. Click the **test** application — **not** the production one.  
   (If you only have one app, create a second app for test first.)
4. Open the **Environment** tab.  
   (Some Dokploy versions label this **Env** or put it under **Advanced → Environment**.)
5. Click **Add variable** (or the **+** button) three times and enter:

   | Name | Value |
   |------|--------|
   | `BIRKLY_CMS_BASE_URL` | `https://test.birkly.cloud` |
   | `BIRKLY_TRUST_REQUEST_HOST` | `true` |
   | `BIRKLY_PUBLIC_SITE_MODE` | `none` |

6. Click **Save**.
7. Click **Deploy** or **Rebuild** (not only Restart) so the container starts with the new variables.
8. Wait until **Logs** shows **Containers (1)**.
9. Open `https://test.birkly.cloud/admin` in your browser — it should stay on test, not jump to `cms.birkly.cloud`.

**Note:** These variables require Birkly build from **2026-07-25** or later (PR #302). If they have no effect after rebuild, use Method 2.

---

#### Method 2 — Paste one command in Dokploy Terminal

Use this when Method 1 is unavailable or you prefer a permanent fix on the test volume.

1. In Dokploy, open the **test** application.
2. Open **Terminal** (or **Exec** / **Console** — a shell into the running container).  
   If there is no Terminal tab, use your host’s SSH and run `docker exec -it <container> bash` (ask whoever manages the server).
3. Paste this entire block and press Enter:

```bash
php /app/scripts/repair-hosting-domain.php https://test.birkly.cloud --public-mode=none
```

4. You should see `Hosting repaired.` and `cms_base_url: https://test.birkly.cloud`.
5. Open `https://test.birkly.cloud/admin` — no redirect to production.

If the script is missing (`No such file`), rebuild the test app from latest `main` on GitHub, then run the command again.

**Manual alternative** (same result, no script):

```bash
cat > /app/data/settings/hosting.json << 'EOF'
{
  "cms_base_url": "https://test.birkly.cloud",
  "public_site_mode": "none",
  "public_site_url": "",
  "same_host_landing": "admin",
  "strict_admin_host": true
}
EOF
```

Then reload `https://test.birkly.cloud/admin`.

---

#### Method 3 — Start test with a fresh volume (when nothing else works)

Use this if test and prod were ever mixed and you do not need to keep test data.

1. In Dokploy, open the **test** application.
2. **Volumes** → note the current volume name → remove the mount (or create a **new** volume name, e.g. `birkly-cms-test-data-v2`).
3. Mount the new empty volume at **`/app/data`**.
4. **Deploy** / **Rebuild**.
5. Open `https://test.birkly.cloud/admin` → create a **new** admin account (once).
6. Complete onboarding on test — hosting will use `test.birkly.cloud` automatically.

Production is untouched as long as you only change the **test** app’s volume.

---

### How to know it worked

Open in your browser:

`https://test.birkly.cloud/api/deploy_revision.php`

Look at the `hosting` section (after latest deploy):

| Field | Good value for test |
|-------|---------------------|
| `cms_base_url` | `https://test.birkly.cloud` |
| `request_host` | `test.birkly.cloud` |
| `request_host_role` | `cms` |

If `request_host_role` is `unknown` and `cms_base_url` is still `https://cms.birkly.cloud`, the fix is not applied yet — retry Method 1 or 2.

Then you can test Marsk onboarding on test without affecting production.

### Cannot log in on test after fixing hosting

The hosting repair script does **not** delete accounts. You usually see a login form because accounts still exist on the volume, but the password may differ from production (separate install = separate passwords).

**Check what the test volume has** (Dokploy → test app → **Terminal**):

```bash
ls -la /app/data/users/
```

If you see files like `a1b2c3d4....json`, admin accounts exist. Try the password you used when you first set up **test**, or use a full reset below.

**Full reset on test only** (new admin, empty site — keeps `hosting.json`):

```bash
php /app/scripts/reset-fresh-install.php --yes
```

Then open `https://test.birkly.cloud/admin` — you should get the **onboarding wizard** to create a new admin.

**Complete wipe** (Dokploy UI, no terminal): test app → **Volumes** → remove mount → add a **new** empty volume at `/app/data` → **Deploy** → open `/admin` → create admin once.

### ⚠️ Test and production share the same data (most common mistake)

If **both** Dokploy apps mount the **same volume name** (e.g. both use `birkly-cms-data`), they are **not** two separate websites — they are **one** Birkly install with two domain names.

Anything you do on test affects production immediately:

| Action on test | Effect on production |
|----------------|----------------------|
| Delete users / fresh reset | Production logins stop working |
| Create new admin (same email) | Production password changes to the new one |
| Install Marsk starter | Production content changes |
| Repair hosting URL | Can break which domain is “home” |

**Check in Dokploy:** production app → **Volumes** → note the volume name. Test app → **Volumes**. If the name is **identical**, they share data. Test must use a **different** name (e.g. `birkly-cms-test-data`).

**Recover production login:** try `https://cms.birkly.cloud/admin` with the **same email and password you created on test**. Or reset:

```bash
BIRKLY_RESET_PASSWORD='YourNewProdPassword123!' php /app/scripts/reset-admin-password.php --email=YOUR@EMAIL.com
```

## PHP security updates

When PHP publishes a **runtime** security fix, **Rebuild** the Dokploy app from latest Birkly `main` so the Docker image picks up the new `php:*-fpm-bookworm` base. Restart alone is not enough. Confirm with `GET /api/health.php` → `"php"`. Details: [PHP runtime security](php-runtime-security.md).

## Related

- [PHP runtime security](php-runtime-security.md)
- [Deployment](deployment.md)
- [Backup and restore](backup-and-restore.md)
- [Troubleshooting](troubleshooting.md)
- [Website integration](../04-integration/website-integration.md)
