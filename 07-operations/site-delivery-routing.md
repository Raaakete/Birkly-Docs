# Site delivery & routing

Configure **where admin lives**, **where visitors see your site**, and **how extra hostnames route** — all from **Settings → Site delivery** in the admin panel.

Technical storage: `settings/hosting.json` (schema v2). Birkly routes HTTP by hostname using this file; your reverse proxy (Dokploy, nginx, Apache) only forwards traffic to PHP.

## Concepts

| Setting | Meaning |
|---------|---------|
| **CMS URL** | Admin, API, `birkly-client.js` base (e.g. `https://cms.example.com`) |
| **Public site URL** | Where visitors see the marketing site (optional) |
| **Public website mode** | None · Hosted elsewhere · In Birkly (`project/`) |
| **Primary vs alias** | One canonical URL per surface; extra hostnames are aliases |
| **Delivery role (Domains tab)** | How each registered hostname routes: CMS alias · Public alias · API only |

**Domains tab** serves two purposes:

1. **CORS / Public API** allowlist for `birkly-client.js` and public APIs  
2. **Delivery role** — syncs alias hostnames with `hosting.json` (P66)

Register every hostname you use in production, then assign the correct delivery role.

## Delivery health dashboard

At the top of **Site delivery** and **Project → Overview**, the **Delivery status** strip runs live probes:

| Status | Meaning |
|--------|---------|
| Green | Configuration and runtime checks pass |
| Yellow | Usable but needs attention (missing alias suggestion, etc.) |
| Red | Broken routing or unreachable public URL |

Actions:

- **Refresh** — re-run probes  
- **Repair delivery** — preview/apply non-destructive fixes (schema migration, domain sync)

Use **Fix** links on individual checks to jump to Hosting, Domains, or Redirects.

## Setup wizard

**Settings → Site delivery → Hosting URLs** hosts the setup wizard:

1. **Detect** — reads current request, project folder, env overrides  
2. **Propose** — suggests CMS/public URLs and www↔apex aliases (nothing saved until you confirm)  
3. **Apply suggestion** — writes `hosting.json` and re-probes  

When `BIRKLY_CMS_BASE_URL` (or related env vars) are set, URL fields are **read-only** but probes still run.

## Multi-domain example

| Host | Delivery role | Serves |
|------|---------------|--------|
| `cms.example.com` | CMS (primary) | Admin + API |
| `staging-cms.example.com` | CMS alias | Same as CMS |
| `www.example.com` | Public (primary) | `project/` site |
| `example.com` | Public alias | 301 → `www` (default) |
| `legacy.example.com` | API only | CORS only — no routing |

Both CMS and public hostnames must point to the **same app** on Dokploy (Path `/`, Internal Path `/`). See [Hosting on Dokploy](dokploy-hosting.md).

## Redirects

**Settings → Site delivery → Redirects** rules are enforced in the PHP router (v1). Export snippets for nginx/Apache are documentation only until you configure the edge separately.

## Migration & repair

Upgrading from older installs:

- v1 configs load unchanged in memory  
- Schema v2 persists on **Save**, **Apply suggestion**, or **Repair delivery**  
- `.bak` backup created before writes; rollback restores prior file  

After upgrade, a non-blocking notice appears if probes fail — the site keeps prior behavior until you repair.

## Subdirectory installs

When Birkly is not at the web root, URL builders include the install base path. Verify probes show correct `install_base_path` and that asset links on the public site do not double-prefix `/project/`.

## AI / MCP

Agents can call:

- `get_site_delivery_status`  
- `run_site_delivery_probe`  

Playbook topic: `site-delivery` (via `read_birkly_docs`).

## Related

- [Hosting on Dokploy](dokploy-hosting.md) — Docker, volumes, Internal Path `/`  
- [Deployment](deployment.md) — production checklist  
- [Troubleshooting](troubleshooting.md) — general ops issues  

**Note:** Server-side rendering (SSR) settings live under **Settings → Project**, not Site delivery. SSR follows `public_site_mode` from `hosting.json`.
