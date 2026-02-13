# Updates

Keeping Birkly and its plugins up to date gives you bug fixes, security patches, and new features. The update process depends on how you installed Birkly (manual download, Git, package manager) and whether an in-admin updater is available.

## Summary

**Updates** for Birkly core and plugins: Check **Settings → Updates** (or **Updates** in the sidebar) if your version has an in-admin updater. It may show available core and plugin updates and let you apply them with one click (after backup). If you installed via **Git**, pull the latest from the repo and run any migration or script the project documents. If you installed by **downloading files**, replace the core files with the new release (keep your `content/`, `media/`, `settings/` intact) and run any upgrade steps. Always **back up** content and database (if used) before updating. See [Backup and restore](../07-operations/backup-and-restore.md).

## Beginner

**Updating** means installing a newer version of Birkly (or a plugin) so you get bug fixes, security fixes, and new features. You should do it regularly, but always **back up first** so you can restore if something goes wrong.

**Before you update**

1. **Back up** — Copy your Birkly folder (or at least `content/`, `media/`, `settings/`, and the database if you use one) to a safe place. See [Backup and restore](../07-operations/backup-and-restore.md).
2. **Read the release notes** — The new version might have breaking changes, new required settings, or special upgrade steps. Check the project’s changelog or release notes.
3. **Check compatibility** — Make sure your PHP version and any plugins are compatible with the new Birkly version.

**If your admin has an “Updates” page**

1. Go to **Settings → Updates** (or **Updates** in the sidebar).
2. The page may show your current Birkly version and whether a **core update** or **plugin updates** are available.
3. Click **Update** for core or a plugin. The system may download and apply the update and run any migrations. Don’t close the browser or interrupt the process.
4. If the update fails, restore from your backup and try again later or ask your host/developer for help.

**If you don’t have an in-admin updater**

- **Installed by downloading files:** Download the new release (zip) from the project. Replace the **core** files (e.g. `api/`, `core/`, `fieldtypes/`, `index.php`) with the new ones. **Do not** overwrite your `content/`, `media/`, or `settings/` folders with the zip’s empty or sample folders—keep your data. If the release notes mention an upgrade script (e.g. `php scripts/upgrade.php`), run it. Then clear any caches and test the site.
- **Installed via Git:** Your developer or host may run `git pull` and then a migration or upgrade script. You might only need to refresh the admin and test.

**Plugin updates**

- If the Updates page shows plugin updates, use the in-admin button for each plugin. Otherwise, the plugin author may tell you to replace the plugin folder with the new version (back up the old one first). Some plugins have their own migration or config changes—check the plugin’s readme.

**After updating**

- Log in, open a few entries, and load a public page to make sure everything works. If something is broken, restore from backup and report the issue (include Birkly version, PHP version, and error messages) to the project or your host.

## Advanced Users

**Before updating**

- **Backup** — Full backup of `content/`, `media/`, `settings/`, `data/`, database (if used), and optionally `plugins/`. See [Backup and restore](../07-operations/backup-and-restore.md).
- **Changelog** — Check for breaking changes, new config, migrations.
- **Compatibility** — PHP version, extensions, plugin compatibility with new core.

**In-admin updater**

- **Settings → Updates** may show current version, available core update, plugin updates. Apply via UI; system may download, replace files, run migrations. Do not interrupt. On failure, restore from backup and update manually or investigate.

**Manual update (core)**

1. **Download** new release (zip or `git pull`).
2. **Replace** core files (`api/`, `core/`, `fieldtypes/`, `index.php`, etc.). Do **not** overwrite `content/`, `media/`, `settings/` with defaults; preserve `plugins/` unless docs say otherwise.
3. **Run** upgrade script or migrations from release notes (e.g. `php scripts/upgrade.php`, DB migrations).
4. **Clear** caches (file cache, opcode, reverse proxy).
5. **Test** — Login, content, templates, public API.

**Plugin updates**

- Use in-admin update if available. Otherwise replace plugin folder with new version (back up first); clear cache; check plugin readme for migrations or config changes.

**After updating**

- Verify login, content list, entry edit, one public page. On failure, restore from backup and report with version info and error details.

## Related

- [Backup and restore](../07-operations/backup-and-restore.md)
- [Deployment](../07-operations/deployment.md)
- [Plugins](plugins.md)
