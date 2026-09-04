# User fieldtype profiles (member-as-entry)

**P77** aligns User Management with the Commerce fieldtype profile pattern: a **member is one collection entry** with a `user_account*` field, not a separate User List row plus optional profile.

Requires **User Management 1.0.46+** (profiles and `UserAccount` fieldtype). Full P77 stack (signup, indexer, Commerce shelf, migration) ships in **1.0.53+**.

## Summary

| Concept | What it means |
|---------|----------------|
| **Member** | One published collection entry with an account field (`user_account`, `user_account_pro`, …) |
| **Fieldtype profile** | Settings for that account type: signup requirements, social gates, privacy, Commerce payment flags |
| **Tier** | Links to one profile (`fieldtype_type_key`); tier wizard provisions `user_account_{tier_slug}` |
| **Collection context** | Signup and upgrade URLs pass `collection` + optional `tier` — the plugin never auto-picks among equal collections |

The legacy **User List** (`UserStorage`) and global **Signup Fields** tab remain for backward compatibility during migration but are **not** the source of truth for new sites.

## Beginner

**Enable the model**

1. Install **User Management 1.0.53+** from the Hub.
2. Open **User → Fieldtypes** — confirm the default `user_account` profile exists.
3. Add an account field to your member collection schema (for example `account` with type `user_account` or `user_account_club`).
4. Create tiers under **User → Tiers** — each tier links to a profile; the wizard creates `user_account_{slug}` when needed.
5. Use collection-scoped signup on your site (see [Member signup](#member-signup) below).

**Admin tabs (P77)**

| Tab | Purpose |
|-----|---------|
| **Fieldtypes** | CRUD profiles (requirements, social, privacy, Commerce flags) |
| **Members** | Index-backed list of all `user_account*` entries across collections |
| **Tiers** | Link tier → profile; wizard replaces global Signup Fields |
| **Users** | Legacy User List (dual-read during migration) |

**Account field vs reference field**

| Field type | Role |
|------------|------|
| `user_account`, `user_account_*` | **This entry is a member** — stores `member_id`, encrypted email, password hash, tier |
| `user` | **Reference picker** — UGC owner on posts, comments, etc. (unchanged from P75) |
| `user_relationship` | **Virtual graph panel** on profile entries (P76) |

Do not use the `user` reference field as the member marker.

**Member signup**

Visitors register into a **specific collection** you name in the form or API:

```http
GET /api/index.php?route=user_member_signup&action=schema&collection=club-profiles&tier=club
```

```http
POST /api/index.php?route=user_member_signup&action=register
{
  "collection": "club-profiles",
  "tier": "club",
  "fields": { "email": "member@example.com", "password": "…", "name": "Alex" }
}
```

Public `{entry for}` forms on member collections use the same profile-driven validation via the `before_entry_create` hook.

**Commerce shelf (when Commerce is installed)**

Fieldtype profiles expose two payment flags (hidden when Commerce is inactive):

| Setting | Effect |
|---------|--------|
| `payment_required_at_signup` | Checkout before the member entry is published |
| `payment_enabled` | Account area can show payment summary and checkout for subscriptions |

Commerce owns customers, payment methods, and card data. The account field shows a **read-only summary** only.

## Advanced Users

**Profile store**

- Service: `UserFieldtypeProfileStore` (mirrors `CommerceFieldtypeProfileStore`)
- Registration: `user_register_fieldtype_profiles()` on plugin load
- Base type key: `user_account`; variants: `user_account_{slug}`
- API: `user_fieldtype_profiles` (admin CRUD)

**Account field value (internal)**

| Key | Notes |
|-----|-------|
| `member_id` | Stable UUID; preserved across tier upgrades and cross-collection moves |
| `tier_id` | Current tier |
| `email` | Encrypted at rest |
| `password` | Hashed; never returned on API read |
| `legacy_user_id` | Set after P77 migration for dual-read auth |
| Custom fields | From profile requirements schema |

Export and MCP reads redact sensitive fields via `birkly_ai_read_entry`.

**Indexer**

- `UserMemberIndexer` maintains `members_index.json` keyed by `member_id`
- Hooks: `after_entry_save`, `after_entry_delete`, reindex on activate
- API: `route=members` actions `list`, `get`, `reindex`

**Tier upgrade and cross-collection migration**

- `MemberMigrationService` — in-place tier change or entry move; `member_id` unchanged
- API: `user_members` actions `plan_upgrade`, `change_tier`
- Requirement validation blocks publish until new profile fields (or payment) are satisfied

**Commerce integration**

- `MemberCommerceShelf` — customer create/link by `member_id`, signup checkout gate, payment summary
- Filters: `user_commerce_checkout_required`, `user_commerce_payment_url`
- Signup API: `user_member_signup` action `begin_checkout` when `payment_required_at_signup`
- Account API: `user_account` actions `payment_summary`, `payment_checkout` when `payment_enabled`

**Authentication (migration period)**

| Setting | Default | Purpose |
|---------|---------|---------|
| `member_entry_auth` | `false` (auto-enabled after migration script) | Dual-read login via member account field |
| `member_entry_signup_only` | `false` | Block legacy `user_registration`; force member collection signup |

`MemberAuthService` falls back when legacy `UserStorage` lookup fails. Sessions include `auth_source: member_entry` when applicable.

**Deprecated (do not use for new sites)**

| Legacy | Replacement |
|--------|-------------|
| Global **Signup Fields** tab | **Fieldtypes** profile requirements |
| `user_registration` only | `user_member_signup` + `{entry for}` on member collections |
| User List as primary identity | Member collection entry with `user_account*` field |

## Related

- [User plugin](user-plugin.md)
- [User signup and membership](user-signup-membership.md)
- [Member migration guide](user-member-migration.md)
- [UGC ownership and social graph](user-ugc-ownership.md)
- [Commerce fieldtype](commerce-fieldtype.md)
