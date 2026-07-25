# Storage backend

## Summary

Birkly stores **content metadata** (collections, entries, schemas, and related JSON) through a pluggable storage layer. **Flat file** is the default: JSON under `content/` on disk, with no database required. **MySQL/MariaDB** and **PostgreSQL** are optional backends for teams that want content JSON in a database table while keeping the same CMS APIs. Configure the driver in **Settings → Storage**, test the database connection, then migrate from flat file when you are ready. `settings/storage.json` always lives on disk and records which driver is active.

## Beginner

### When to use each backend

| Backend | Best for |
|---------|----------|
| **Flat file (default)** | New installs, local development, small sites, alpha/testing, and any setup where you want zero database configuration. Back up by copying folders. |
| **MySQL / MariaDB** | Production hosting that already provides MySQL, shared hosting with a MySQL database, or teams whose ops stack is MySQL-first. |
| **PostgreSQL** | Production hosting where PostgreSQL is the standard, or when your infrastructure team prefers Postgres for backups and tooling. |

**Stay on flat file when:**

- You are evaluating Birkly or running a single small site.
- You do not have (or do not want) a separate database server.
- Simple file-based backups (`content/`, `media/`, `settings/`) are enough for your recovery plan.

**Consider MySQL or PostgreSQL when:**

- Your host or organization expects all application data in a managed database.
- You want database-native backup/restore alongside other apps.
- You are moving to a multi-server or container setup where shared filesystem storage is awkward but a central database is not.

**What does *not* move to the database**

- Uploaded files stay in **`media/`** on disk.
- CMS configuration in **`settings/`** (users, security, branding, and `storage.json` itself) stays as JSON files on disk.
- Migration copies **JSON content files** from your flat-file content tree into the database — not images, not plugin binaries.

**SQLite** appears in the Storage dropdown as *coming soon* and cannot be selected. Use flat file or MySQL/PostgreSQL today.

### Open Settings → Storage

1. Log in as an administrator (or a user with **manage settings**).
2. Open **Settings** in the admin sidebar.
3. Select the **Storage** tab (or open `?page=settings#storage`).

### Test the database connection

Use this before saving credentials or running migration.

1. In **Storage backend**, choose **MySQL/MariaDB** or **PostgreSQL**.
2. Fill in:
   - **Host** (often `localhost` or your provider’s DB hostname)
   - **Port** — `3306` for MySQL/MariaDB, `5432` for PostgreSQL
   - **Database name** — empty database the CMS user can write to
   - **Database user** and **password**
   - **Table prefix** (default `birkly_`) — useful if the database hosts multiple apps
3. Click **Test connection**.
4. Wait for the result next to the button:
   - **✓ Connection successful** — credentials work and Birkly can create its storage table.
   - **✗ …** — read the message (wrong password, database missing, host unreachable, and so on) and fix the fields.

Testing does **not** change your live content. It only checks that Birkly can reach the database.

### Save, then migrate from flat file to SQL

Migration is **one-way** (flat file → MySQL/PostgreSQL). Back up first.

1. **Back up** `content/`, `media/`, and `settings/` (see [Backup and restore](../07-operations/backup-and-restore.md)).
2. Create an **empty** database and grant the user `CREATE`, `INSERT`, `UPDATE`, and `DELETE` on that database.
3. **Test connection** (steps above) until it succeeds.
4. Click **Save settings** at the top of the Settings page so database credentials are written to `settings/storage.json`. Migration reads the **saved** config, not unsaved form fields.
5. Click **Start migration** and confirm both prompts.
6. When migration finishes, open **Content** and verify collections and entries. Check the success message for how many JSON files were migrated.

If migration fails partway through, restore from backup before retrying. Do not switch the backend dropdown manually without a successful migration or a known-good restore.

## Advanced Users

### Configuration

| Item | Location / value |
|------|------------------|
| Config file | `settings/storage.json` |
| Drivers | `flatfile` (default), `mysql`, `postgresql` (`postgres` normalized to `postgresql`) |
| Content root (flat file) | `base_path`, default project `content/` |
| SQL table | `{prefix}storage` (default `birkly_storage`), columns `path`, `content` (JSON text), `updated_at` |
| Factory | `core/storage/StorageFactory.php` |
| Drivers | `FlatFileStorage`, `MySqlStorage`, `PostgresStorage` — all implement `StorageInterface` |

Global helper: `get_storage()` / `StorageFactory::getStorage()`. Content APIs (`api/content.php`, public API, templating data layer) use this factory; `settings/*.json` are written directly by `api/settings.php`, not through the SQL drivers.

### Test connection (API)

```
POST /api/settings.php?action=test_database
Content-Type: application/json

{
  "backend": "mysql",
  "host": "localhost",
  "port": 3306,
  "name": "birkly",
  "user": "birkly_user",
  "password": "secret",
  "prefix": "birkly_",
  "_csrf": "<token>"
}
```

- Requires **manage settings** and a valid CSRF token when CSRF enforcement is on.
- Only `mysql` and `postgresql` are accepted; other drivers return an error.
- On success: `{ "status": "ok", "message": "Connection successful" }`.
- Implementation: `StorageFactory::testDatabaseConnection()` → driver `testConnection()` (PDO connect + `SELECT 1` + schema ensure).

UI: `admin/js/settings-page.js` → `testDatabaseConnection()` → `#db-test-result`.

### Migration (`StorageMigration`)

```
POST /api/settings.php?action=migrate_storage
```

Body includes `backend` and `_csrf`. Server merges `StorageFactory::loadStorageConfig(true)` with the requested driver, re-runs connection test, then:

1. Source: `FlatFileStorage` at `base_path` (default `content/`).
2. Target: `MySqlStorage` or `PostgresStorage` from saved config.
3. `StorageMigration::migrateFlatFileToStorage()` walks the source tree, collects every `*.json` file, and `write()`s each decoded document to the SQL backend inside a transaction.

**Caveats**

| Topic | Behaviour |
|-------|-----------|
| Direction | Flat file → SQL only. No SQL → flat file or SQL → SQL migration in admin. |
| Scope | JSON under `base_path` only. Not `settings/`, not `media/`, not plugin artifact trees unless they live as JSON under `content/`. |
| Invalid JSON | Files that do not decode to an array are skipped and reported in `errors` (up to 10 paths in the response). |
| Partial failure | If any file fails, response is `ok: false` with `migrated` count; transaction rolls back on uncaught exceptions. |
| Source files | Original flat-file JSON is **not** deleted after migration. Archive or remove only after you verify the SQL backend. |
| Credentials | `migrate_storage` uses **saved** `settings/storage.json` credentials. Save Settings after editing host/user/password before migrating. |
| Driver switch | On success, `StorageFactory::saveStorageConfig()` persists the new driver; `storage_migrated` is logged to the security audit log. |
| Re-run | Running migration again against the same database overwrites paths via upsert — safe only if you intend to refresh SQL from disk. |

### Choosing MySQL vs PostgreSQL

Functionally equivalent for Birkly: both store one JSON blob per logical path in a single prefixed table. Choose based on **hosting**, **team expertise**, and **ops tooling**, not CMS feature gaps. JSON encoding and `StorageInterface` semantics are shared via `AbstractSqlStorage`.

### CI and automated tests

Birkly’s CI and PHPUnit suites **do not** connect to a production or shared database for storage tests. Storage-related tests use **mock PDO**, in-memory fixtures, or **intentionally invalid credentials** to assert error paths (`test_database` rejects non-SQL drivers, connection failures, migration dry-runs with mock targets). Do not point CI at a real MySQL/PostgreSQL instance unless you maintain a dedicated ephemeral test service yourself.

## Related

- [Settings](settings.md) — global Save, Security tab, and other Settings sections
- [Backup and restore](../07-operations/backup-and-restore.md)
- [Deployment](../07-operations/deployment.md)
- [Troubleshooting](../07-operations/troubleshooting.md)
