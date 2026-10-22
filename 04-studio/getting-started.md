# Studio — visual site builder

## Summary

**Studio** builds a site in the admin and publishes it at `/site/{slug}/`. The walkthrough lives on the Studio **Docs** tab inside the install. That tab updates when you update the plugin.

## Beginner

If you are not editing `project/` files by hand, follow [Build a site with Studio](./build-a-site.md) for the visual create → edit → connect content → publish path.

**Example: open the manual in this install**

1. Enable **Studio** under **Settings → Plugins**.
2. Open **Studio** in the sidebar.
3. Click **Docs**. Follow **Getting started**, then **Files and preview** and **Publish and export**. This page does not repeat those steps.

## Advanced Users

Published pages are served by the Studio plugin. If `/site/` does not resolve on your host, the Docs tab explains the rewrite and `/api/studio_view.php`. Deactivating Studio stops `/site/*`. Project files stay on disk.

## Related

- [Plugins](../06-extensibility/plugins.md)
- [Website integration](../04-integration/website-integration.md)
