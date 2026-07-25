# Hosting on Dokploy (Docker)

For site owners using [Dokploy](https://dokploy.com) on a VPS — no command line required for normal setup.

Repository: **`Raaakete/Birkly`**, branch **`main`**, build type **Dockerfile**, port **80**.

Full technical reference: [Birkly `docs/deployment/docker.md`](https://github.com/Raaakete/Birkly/blob/main/docs/deployment/docker.md).

## First-time setup order (read this first)

To avoid creating your admin account twice, follow this order:

| Step | What to do |
|------|------------|
| 1 | Create the Dokploy app (GitHub → Birkly → Dockerfile). |
| 2 | Add **one Volume Mount** (not Bind Mount): name e.g. `birkly-cms-data` → container path **`/app/data`**. |
| 3 | **Deploy** and wait until **Deployments** shows **Done**. |
| 4 | **Logs** must show **Containers (1)** — not **Containers (0)**. |
| 5 | Open **`https://your-cms-domain/admin`** and create your admin account **once**. |

**Do not use Bind Mount** to a host path like `/opt/birkly-data` on Dokploy — Docker Swarm often refuses to start the container (502 Bad Gateway, **Containers (0)**), even when deploy shows Done.

## Why you might create the admin account again

This is **normal** in one situation:

You ran the CMS **without a volume** (or with a broken bind mount), created an admin account, then added a **new empty Volume Mount** at `/app/data` and redeployed.

- The first account lived **inside the temporary container** (not on the volume).
- The new volume is **empty**, so Birkly correctly shows **first-time setup** again.
- After you create the account on the volume, it **persists** across future redeploys.

You should **not** need to create the admin again on every deploy. If that happens, the volume is missing or not mounted at `/app/data`.

| Situation | Create admin again? |
|-----------|---------------------|
| First install **with** volume at `/app/data`, then redeploy | **No** — same login |
| First install **without** volume, then add empty volume + redeploy | **Yes** — expected once |
| Volume mounted correctly, every redeploy | **No** |
| Changed volume name / new empty volume | **Yes** — new empty disk |

## Where your data lives

With Volume Mount at **`/app/data`**:

- Admin users → `users/` (via symlink from `/app/users`)
- Settings, content, media, plugins → under the same volume
- Public site files → `content/project/` (URL path `/project/`)

Back up the Dokploy volume (or use Dokploy volume backups) before major changes.

## URLs

| URL | Use |
|-----|-----|
| `https://cms.yourdomain.com/admin` | Admin login and setup — **start here** |
| `https://cms.yourdomain.com/api/health.php` | Health check (JSON) |
| `https://yourdomain.com` | Public marketing site (`/project/` when configured) |

Root URL on the CMS host may redirect to `/admin` or `/project/` depending on hostname.

## If something goes wrong

| Symptom | What to check |
|---------|----------------|
| **502 Bad Gateway** | **Logs** → **Containers (0)**? Remove bad mount, Deploy, use Volume Mount. |
| **Containers (0)** after Done | Dokploy **Swarm** screen → error about mounts. |
| Deploy Done but old code | **Rebuild** with clean cache; check `/api/deploy_revision.php`. |
| Logs: `No such container` | No running container — not a logging bug. |

## Related

- [Deployment overview](deployment.md)
- [Backup and restore](backup-and-restore.md)
- [Troubleshooting](troubleshooting.md)
