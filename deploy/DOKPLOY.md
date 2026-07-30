# Deploy Birkly Docs on Dokploy

Host the static documentation at **docs.birkly.cloud** (or any domain). The marketing site at **birkly.cloud** loads topics from this host via `docs-loader.js` — no docs files are copied into the CMS.

## What is in this repo for deployment

| File | Purpose |
|------|---------|
| `Dockerfile` | Builds HTML from Markdown, serves with nginx |
| `deploy/nginx.conf` | Web server config + CORS for birkly.cloud |
| `.dockerignore` | Keeps the Docker build fast |

## Dokploy setup (no terminal)

1. **Dokploy** → your Project → **Create Application** → name it e.g. `Birkly Docs`
2. **Source:** GitHub → `raaakete/birkly-docs` → branch `main`
3. **Build:** Dockerfile → path `Dockerfile` → port **80**
4. **Domains:** add `docs.birkly.cloud` — Path **`/`**, Internal Path **`/`**, HTTPS on
5. **Volume:** none required
6. **Deploy** → wait for **Containers (1)** in Logs
7. **DNS:** point `docs.birkly.cloud` to your Dokploy server (same as birkly.cloud)

## Verify

| URL | Expected |
|-----|----------|
| `https://docs.birkly.cloud/` | Docs home page |
| `https://docs.birkly.cloud/manifest.json` | JSON topic list |
| `https://birkly.cloud/docs.html` | Sidebar + doc content |

## Updates

Push changes to `main` on GitHub → **Deploy** (or enable auto-deploy) in Dokploy. No CMS upload.

## CORS

`deploy/nginx.conf` allows browser requests from `https://birkly.cloud` and `https://cms.birkly.cloud`. Add more origins in the `map` block if needed.
