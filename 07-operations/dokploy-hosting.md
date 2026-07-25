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

## Related

- [Deployment](deployment.md)
- [Backup and restore](backup-and-restore.md)
- [Troubleshooting](troubleshooting.md)
- [Website integration](../04-integration/website-integration.md)
