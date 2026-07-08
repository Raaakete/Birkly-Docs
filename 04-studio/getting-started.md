# Studio — visual site builder

**Summary:** Build and publish template-first sites inside Birkly with a visual canvas, style kits, and SSR.

## Beginner

1. Activate **Studio** under Settings → Plugins.
2. Open **Studio** in the admin sidebar.
3. Click **New project** and pick a style kit (Minimal, Bootstrap, or Tailwind Lite).
4. Add sections and elements from the palette. Use **Collection loop** to bind blog or product lists.
5. Click **Publish** — your site is live at `/site/your-project-slug/`.
6. Optional: **Export ZIP** for a static copy; the in-CMS project remains the source of truth.

## Advanced

### Storage

Projects live at `content/studio-projects/{id}/`:

- `*.studio.json` — editor canvas (not served publicly)
- `*.html` — compiled publish artifact with Birkly template tags
- `styles/kit.css` + `styles/custom.css`

### Preview vs SSR

| Mode | Engine | URL |
|------|--------|-----|
| Admin preview | `birkly-client.js` + P21 page_bundle | iframe in editor |
| Published | PHP SSR (`StudioRenderer`) | `/site/{slug}/` |

### Deactivation

Deactivating Studio returns **503** on `/site/*`. Files are not deleted.

### Docs in repo

See `plugins/studio/README.md` in the Birkly core repository.
