# Member migration (P77)

Move existing **User List** accounts into **member collection entries** without breaking login or the P76 social graph.

Requires **User Management 1.0.53+**.

## Summary

The migration is **additive and idempotent**:

- Legacy `UserStorage` users are **not deleted**
- Member entries get `account.member_id` and `account.legacy_user_id`
- `member_legacy_map` metadata links `user_id` ↔ `member_id`
- Dual-read auth lets existing users sign in with the same email and password
- P76 `user_relationship` resolves anchors from `legacy_user_id` or the legacy map

## Before you start

1. **Backup** `content/` and `data/plugins/user_management/`.
2. Deploy User **1.0.53+** from the Hub.
3. Confirm the target collection schema includes an account field (for example `account` with type `user_account_club`).
4. Verify **User → Fieldtypes** and **Members** tabs load in admin.

## Migration script

Path: `plugins/user_management/scripts/migrate-p77-members.php`

```bash
# Preview
php plugins/user_management/scripts/migrate-p77-members.php --dry-run --collection=club-profiles

# Execute
php plugins/user_management/scripts/migrate-p77-members.php --collection=club-profiles
```

| Flag | Purpose |
|------|---------|
| `--dry-run` | Report counts without writing |
| `--collection=slug` | Target member collection (required) |

**On success:**

- Creates or updates entries with populated `account` field
- Writes `member_legacy_map` entries
- Sets `member_entry_auth` = `true` automatically

## Verify

| Check | Expected |
|-------|----------|
| Admin → **Members** | Lists migrated rows; links open collection entries |
| Legacy login | Same email/password works (`auth_source: member_entry` in session) |
| `user_relationship` panel | Loads on profile entries (anchor from `legacy_user_id` / owner) |
| New signup | Uses `user_member_signup` or `{entry for}` — not legacy `user_registration` when cutover enabled |

## Cutover (optional)

When all active users have member entries:

1. **User → Settings** → enable **Member entry signup only**
2. Legacy `user_registration` returns `member_entry_signup_only` with redirect to `user_member_signup`

Keep **Member entry authentication** enabled for dual-read login.

## Rollback

- Disable `member_entry_auth` in plugin settings to turn off member-entry login fallback
- Restore from backup if entry writes need reverting
- Migration does not remove User List rows

## birkly.io reference

Platform runbook (maintainers): `internal/planning/reviews/P77-birkly-io-migration-runbook.md` in Birkly-Marketplace.

Phase A targets `club-profiles` with existing club tiers and Commerce membership products.

## Related

- [User fieldtype profiles](user-fieldtype-profiles.md)
- [User plugin](user-plugin.md)
- [UGC ownership and social graph](user-ugc-ownership.md)
