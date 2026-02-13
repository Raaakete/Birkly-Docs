# Backup and Restore

Backing up Birkly means copying the content, media, settings, and (if used) the database so you can restore the CMS after a failure, mistake, or attack. Restore is the process of putting that copy back so the site works again.

## Summary

**Backup:** Copy the **entire Birkly folder** (or at least `content/`, `media/`, `settings/`, and the database file or DB dump if you use a database) to a safe place (another server, cloud storage, local machine). Do this regularly (e.g. daily) and before **any** update or big change. **Restore:** Stop the app if needed, replace those folders/files with your backup copy, fix permissions so the web server can write where required, then test login and content. For file-based content, “backup” is literally copying the folders; for a DB, also export the database and restore it when recovering.

## Beginner

**Backup** = a copy of your content and settings so that if something goes wrong (server failure, accidental delete, bad update), you can put that copy back and keep working.

**What to back up**

- **content/** — All your collections and entries (the actual content). Essential.
- **media/** — All uploaded images and files. Essential.
- **settings/** — Project name, users, roles, plugin configuration. Essential.
- **database/** — If Birkly uses a database (e.g. SQLite `birkly.db`), copy that file or export the database. Essential if you use it.
- **data/** — If present (e.g. plugin data, logs). Good to include.
- **plugins/** — Your custom or modified plugins, so you can restore the same setup.

You can skip the core application code (api/, core/, etc.) if you can re-download the same Birkly version; backing it up too can help you match the exact version when restoring.

**How to back up**

- **Manual:** Use your host’s file manager, FTP, or SFTP to download the Birkly folder (or the important subfolders above) to your computer or to another server or cloud bucket.
- **Scheduled:** Your host or developer can set up a **cron job** or backup tool that copies these folders (e.g. with rsync or a zip) to a backup location every day or every week.
- **Before updates:** Always make a backup right before you run a Birkly or plugin update. If the update fails, you can restore and try again.

**How often**

- At least before every update. For active sites, a daily or weekly backup is recommended. Keep several backup points (e.g. last 7 daily, last 4 weekly) so you can go back to a specific date if needed.

**Restore (putting the copy back)**

1. **Stop** the site or put it in maintenance mode if possible.
2. **Replace** the live `content/`, `media/`, `settings/` (and database if you use one) with the versions from your backup. Don’t overwrite with an older backup by mistake—check the date of the backup.
3. **Permissions** — Ensure the web server can write to `content/`, `media/`, `settings/` (your host or developer can fix this with chown/chmod).
4. **Clear caches** if your setup uses file or opcode cache.
5. **Test** — Log in, open a few entries, load a public page.
6. **Re-enable** the site.

**Example: restoring after a bad update**

1. Restore `content/`, `media/`, `settings/`, and database from the backup you made before the update.
2. If you replaced core code during the update, either restore the old core from backup or re-download the previous Birkly version and replace the core files again.
3. Fix permissions and test. Then you can try the update again later or wait for a fix.

## Advanced Users

**What to back up**

| Path | Priority | Notes |
|------|----------|--------|
| content/ | Essential | Collections and entries. |
| media/ | Essential | Uploaded files. |
| settings/ | Essential | Project, users, roles, plugin config. |
| data/ | Recommended | Plugin data, logs. |
| database/ | Essential if used | SQLite file or DB dump. |
| plugins/ | Recommended | Custom/modified plugins. |
| .env / config | Secure backup | Encrypted, restricted access. |

Core code can be re-downloaded; backing it up helps with exact version match on restore.

**How to back up**

- **Manual:** FTP, SFTP, rsync, zip to another machine or cloud bucket.
- **Script:** Cron with rsync or zip of key dirs; store with retention (e.g. 7 daily, 4 weekly).
- **Database:** MySQL/PostgreSQL: `mysqldump` / `pg_dump`; SQLite: copy `.db` file (ensure no write in progress or use SQLite backup API).

**Restore steps**

1. Stop site or maintenance mode.
2. Replace content/, media/, settings/, data/, plugins/ (as backed up).
3. Restore database (import dump or replace DB file).
4. Fix permissions (chown/chmod for web server user).
5. Clear caches.
6. Test login, entries, public page.
7. Re-enable site.

**Before updates**

- Always backup immediately before core or plugin update. Restore and retry or wait for fix if update fails.

## Related

- [Deployment](deployment.md)
- [Security](security.md)
- [Updates](../06-extensibility/updates.md)
- [Troubleshooting](troubleshooting.md)
