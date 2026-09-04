# User-generated content and ownership (P75)

Canonical model for posts, comments, likes, and profiles: one **owner** field per schema, one **social graph** collection, and platform-enforced session ownership on public APIs.

Requires **User Management 1.0.38+** and **Birkly core** with `entry_ownership.php` / public-read hooks.

## Summary

UGC collections declare a single `type: "user"` field with `ownership: true`. Public create paths (`public_submit`, `public_sub_entry`) set owner from the logged-in session — clients cannot spoof it. Social edges (follow, friend, block, connection) live only in the `user-relationships` collection via `UserGraphService` and the `user_graph` API. Reactions (likes, votes) are **sub-entries** with their own `owner` field, not plugin metadata.

## Beginner

**Three primitives**

| Primitive | Where | Purpose |
|-----------|--------|---------|
| **Owner field** | Entry / sub-entry schema | Links content to an account (`owner`, `type: user`, `ownership: true`) |
| **Profile entry** | Configurable profile collection | Public card for an account (avatar, bio) — not the graph store |
| **User relationships** | `user-relationships` collection | Directed edges: follow, friend, block, connection |

**Schema example (post collection)**

```json
{
  "name": "owner",
  "type": "user",
  "label": "Author",
  "ownership": true,
  "required": true,
  "public_visible": false
}
```

In the collection editor, enable **Entry owner** on a User field. Owner fields should stay hidden on public forms (`public_visible: false`).

**Public create behavior**

| Surface | Owner |
|---------|--------|
| Logged-in visitor submits post/comment/like | Set from session automatically |
| Anonymous submit to owner-required collection | Rejected (401) |
| Client sends `owner` in POST body | Ignored — platform overwrites |

Optional `author_name` text may remain as a display snapshot; do not use text `author_user_id` / `user_id` for permissions.

**Social graph API**

Use `user_graph` (not legacy `club_social` or `user_relations`):

| Action | Method | Notes |
|--------|--------|-------|
| `follow` / `unfollow` | POST | Directed active follow edge |
| `connect` / `accept` / `reject` / `disconnect` | POST | Friend requests |
| `block` / `unblock` | POST | Blocks follow/connect |
| `state` | GET | `following`, `followers`, pending, blocked |

CSRF + session required for mutating actions.

**Likes and votes**

Toggle via `public_sub_entry.php` with `operation: toggle` on a `likes` sub-collection. Each like is a sub-entry with `owner` = session user. Roadmap votes use the same pattern.

## Advanced Users

**Template functions**

| Function | Purpose |
|----------|---------|
| `{user_current}` | Current account |
| `{user_profile entry.owner}` | Profile for entry owner |
| `{user_is_following from to}` | Boolean follow check |
| `{user_is_friend a b}` | Mutual friend / connection |
| `{user_is_blocked a b}` | Block edge |
| `{user_graph_follows user_id}` | User IDs this account follows |
| `{user_graph_followers user_id}` | Follower user IDs |
| `{user_can_view entry}` | `EntryPermissions` visibility |

**Entry visibility**

`EntryPermissions` enforces `public`, `private`, `relationship`, and `tier` on list **and** get when the User plugin registers `birkly_public_entries_filter` / `birkly_public_entry_filter` hooks (declared in `plugin.json`).

**Migration**

On plugin upgrade, `scripts/migrate-p75-ugc.php` (idempotent):

- Copies legacy `author_user_id` / `user_id` → `owner`
- Migrates `club_social_reactions` metadata → `likes` sub-entries
- Migrates `club_social_follows` metadata → `user-relationships` edges
- Clears legacy metadata keys when done

Re-run safely after data fixes: upgrade to latest User plugin or run the script from CLI on the CMS host.

**Validation**

Birkly core rejects collection schemas with more than one `ownership: true` field or ownership on non-`user` types (admin save + MCP `update_collection`).

## Related

- [User plugin](user-plugin.md)
- [User signup and membership](user-signup-membership.md)
- [Public forms](../04-integration/public-forms.md)
- Historical design: [UNIVERSAL_DESIGN.md](https://github.com/Birkly-Other-Things/Birkly-Plugin-User/blob/main/docs/archive/implementation-history/UNIVERSAL_DESIGN.md)
