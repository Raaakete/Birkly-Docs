# Production deploy checklist

Pre-flight and post-deploy verification for Birkly CMS, Marketplace, and client sites (Phase 12 closure).

## Summary

Use this checklist when promoting **staging → production** for the Birkly platform, marketplace, and reference client sites (for example kekaba). Automated smoke scripts cover health endpoints and admin login; human steps cover DNS, Stripe live mode, and legal copy.

## Beginner

### Before deploy

| Step | Owner | Action |
|------|-------|--------|
| 1 | Agent/CI | `php tests/run.php` green on Birkly `main` |
| 2 | Agent/CI | Marketplace test suite green |
| 3 | Human | Back up production `content/`, `settings/`, `media/`, marketplace `data/` |
| 4 | Human | Note current git commit SHA for rollback |

### Birkly CMS deploy

1. Pull latest `main` on the server (or run `./scripts/deploy-pull.sh`).
2. Ensure writable dirs: `content/`, `media/`, `settings/`, `data/`, `cache/`, `logs/`.
3. Run smoke script: `./scripts/production-smoke.sh` (or manual checks below).
4. Log in to admin; verify **Commerce**, **Plugins → Hub**, **Settings → Security**, and **Settings → Monitoring** load.
5. Hit `GET /api/health.php` — extended checks: disk writable, plugin state, marketplace reachability. Configure alert email in Monitoring before go-live (see [Monitoring and health alerts](monitoring-alerts.md)).

### Marketplace deploy

1. Pull `Birkly-Marketplace` `main`.
2. Set production env: Stripe **live** keys, `GITHUB_APP_*`, webhook secrets.
3. Register webhooks:
   - GitHub App → `POST /webhooks/github`
   - Stripe → `POST /webhooks/stripe`
4. Run marketplace smoke (registry `GET /api/v1/registry`, provider login, catalog page).
5. See [Marketplace production runbook](https://github.com/Raaakete/Birkly-Marketplace/blob/main/docs/PRODUCTION-RUNBOOK.md).

### Client site (kekaba example)

1. From Birkly repo: `./scripts/sync-client-embed.sh /path/to/kekaba`
2. In kekaba repo: `git pull origin main`
3. Verify static pages load; Commerce buy buttons resolve.
4. Do **not** commit runtime `content/`, `users/`, `settings/` from server.

### Human-only (cannot be automated)

- [ ] DNS / TLS certificates valid
- [ ] Stripe **live** mode enabled for Commerce and Marketplace Connect
- [ ] Legal pages updated (privacy, terms, marketplace provider agreement links)
- [ ] Email deliverability (SPF/DKIM) for dunning and order receipts
- [ ] Monitoring alerts configured

### Post-deploy smoke (manual)

| Check | Expected |
|-------|----------|
| Admin login | `/admin` loads |
| Commerce catalog | Products indexed |
| Hub tab | Official plugins install |
| Health endpoint | HTTP 200, checks pass |
| Checkout (test) | Test mode order or small live transaction |
| Subscriptions | List loads; upgrade UI on detail |
| Plugin denylist | Add/remove test entry in Settings → Security |

### Rollback

1. Revert server git to previous SHA.
2. Restore `settings/` and `content/` from backup if schema changed.
3. Re-run smoke script.

## Advanced Users

**Smoke script locations**

| Repo | Script |
|------|--------|
| Birkly | `scripts/production-smoke.sh` |
| kekaba | `scripts/check-production.sh` (when present) |

**Health extensions (P12-M5)**

`/api/health.php` may include:

- Writable directories probe
- Active plugin manifest hash
- Marketplace registry HTTP probe (timeout 5s)
- PHP version and memory limit

**CI publish (official plugins)**

Tag `plugin/commerce/v*` on Birkly repo triggers GitHub Actions → build zip → marketplace registry API. Third-party providers use GitHub App connect (see [Marketplace provider guide](marketplace-provider-guide.md)).

**Embed sync**

```bash
./scripts/sync-client-embed.sh ../kekaba
```

Copies `Birkly-0.1/` embed without runtime data. Client sites serve static HTML; CMS runs on subdomain or path per hosting layout.

**Secrets**

Never commit: `.env`, `config.php`, `settings/`, Stripe keys, GitHub App PEM, import API tokens.

## Related

- [Deployment](deployment.md)
- [Security](security.md)
- [Backup and restore](backup-and-restore.md)
- [Marketplace go-live](marketplace-go-live.md)
