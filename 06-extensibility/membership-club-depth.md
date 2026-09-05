# Membership club depth (P80)

Extend the Birkly Club member hub with onboarding, @mentions, notification digests, block/mute safety, moderation reports, wishes, deal analytics, and Automation lifecycle hooks.

## Summary

**P80** builds on [User signup and membership](user-signup-membership.md) (P79 free club + supporter badges). Members join with `club_free_register`, complete a profile onboarding flow, and use the club hub (`club.html` + `club-app.js`). Site owners get admin APIs for wishes, reports, and deal counters; Automation can react to club lifecycle events via the **`membership-club-depth`** recipe pack.

**Requires:** User Management **≥ 1.0.69**, Automation **≥ 1.1.22** (Hub). Commerce is optional (paid activation path + badge sync).

## Beginner

**What P80 adds for members**

| Area | What members see |
|------|------------------|
| **Onboarding** | Welcome modal on first login; completeness score; deep link to pinned **Introduce yourself** post |
| **Profiles** | Public profile URLs (`?member=slug`), OG meta tags, interests and links |
| **Mentions** | `@slug` links in posts and comments; mention notifications (in-app + optional email) |
| **Digests** | Daily/weekly email batch of unread notifications (opt-in in notification settings) |
| **Safety** | Block/mute other members; muted authors skipped in notifications |
| **Wishes** | Submit feature wishes; status badges (`pending` → `planned` → `shipped`) |
| **Deals** | Member perks with copy/visit tracking |

**What site owners configure**

1. **Hub upgrade** — Install User **1.0.69+** and Automation **1.1.22+** from the Birkly Hub.
2. **Collections** — Plugin upgrade ensures schemas for `club-profiles`, `club-posts`, `club-wishes`, `club-deals`, `club-reports` (fields for onboarding, mentions, moderation, analytics).
3. **Club hub** — Deploy `project/club.html`, `js/club-app.js`, and club CSS from your reference site or birkly.cloud `project/`.
4. **Automation (optional)** — Import recipe pack **`membership-club-depth`** under **Automation → Recipes**. Enable workflows after SMTP is configured under **Connections** or Automation setup.
5. **Moderation** — Review `club-reports` in **Collections**; use admin actions to hide posts or suspend users.

**Onboarding flow**

1. Member signs up with `club_free_register` (see [User signup and membership](user-signup-membership.md)).
2. On first visit to `/club.html`, the welcome modal prompts for avatar, bio, links, and interests.
3. `user_account?action=complete_onboarding` marks `onboarding_completed` and fires `club_member_onboarded`.
4. UI links to the pinned **Introduce yourself** post (`slug: introduce-yourself`) for first comments.

**Notification preferences**

Members control prefs via `club_notifications` API (also exposed in club profile settings UI):

| Pref | Effect |
|------|--------|
| `notify_mentions` | In-app mention alerts |
| `email_mentions` | Email on @mention |
| `digest_enabled` | Batch unread into digest email |
| `digest_frequency` | `daily` or `weekly` |

Import Automation recipe **`club-depth-send-notification-digests`** for a daily scheduled digest sender (calls User action `send_club_notification_digests`).

**Moderation (v1)**

- Members tap **Report** on a post → creates a `club-reports` entry.
- Block/mute graph hides blocked authors from the feed and skips muted actors in notifications.
- Admins review open reports in Collections; optional Automation recipe emails ops on `club_member_reported`.

**Wishes and deals**

- **Wishes:** Members submit ideas; admins promote to `roadmap-features` drafts via `club_wishes?action=promote`.
- **Deals:** `club_deals?action=track` increments `copy_count` / `visit_count` (session + CSRF); counters visible in admin.

## Advanced Users

**Plugin versions (P80-M7)**

| Plugin | Min version | P80 highlights |
|--------|-------------|----------------|
| User Management | 1.0.69 | Onboarding, mentions, digests, block/mute, reports, wishes, deals, automation hook bridge |
| Automation | 1.1.22 | `membership-club-depth` pack v1.0.2 (5 recipes) |
| Commerce | 1.0.106+ | Optional `club_opt_in` checkout metadata; badge sync unchanged from P79 |

**Key collections and fields**

| Collection | P80 fields / behavior |
|------------|----------------------|
| `club-profiles` | `interests`, `onboarding_completed`, `profile_completeness`, `notification_prefs` (JSON) |
| `club-posts` | `mentioned_user_ids` (server-written JSON), `moderation_hidden` |
| `club-wishes` | `status` enum, `decline_reason`, `roadmap_link` |
| `club-deals` | `copy_count`, `visit_count` |
| `club-reports` | `report_status`, `target_collection`, `target_entry_id`, `reporter_user_id`, `reason` |

**User APIs (selected)**

| Route | Actions |
|-------|---------|
| `user_account` | `onboarding_status`, `complete_onboarding`, `public_profile` |
| `user_graph` | `block`, `unblock`, `mute`, `unmute`, `list_blocks`, `list_mutes` |
| `club_notifications` | `list`, `unread_count`, `mark_read`, `get_preferences`, `save_preferences` |
| `club_reports` | `submit` (member), `list` / `hide_post` (admin) |
| `club_wishes` | `promote` (admin → roadmap draft) |
| `club_deals` | `track` (`copy` \| `visit`) |

**Automation hooks (User → Automation bridge)**

When Automation is active, User Management enqueues these triggers (merged context includes `email`, `name`, `site_name`, `site_url` when available):

| Hook | Payload keys |
|------|----------------|
| `club_profile_created` | `user_id`, `profile_slug`, `entry_id` |
| `club_member_onboarded` | `user_id`, `completeness`, `slug`, `profile_slug`, `email` |
| `club_post_created` | `entry_id`, `title`, `slug`, `user_id`, `collection` |
| `club_mention_created` | `entry_id`, `mentioned_user_ids`, `collection`; comments add `sub_entry_id`, `sub_collection` |
| `supporter_badge_granted` | `user_id`, `email`, `supporter_badge`, `supporter_cadence`, `supporter_amount_eur` |
| `club_member_reported` | `report_id`, `target_collection`, `target_entry_id`, `reporter_id`, `reason` |
| `user_tier_changed` | `user_id`, `old_tier`, `tier_id` |

**Recipe pack `membership-club-depth` (Automation 1.1.22)**

| Recipe id | Trigger | Purpose |
|-----------|---------|---------|
| `club-depth-send-activation-on-opt-in` | `commerce_subscription_started` | Activation email when checkout includes club opt-in |
| `club-depth-welcome-on-tier-granted` | `user_tier_changed` | Optional welcome when tier becomes `club` |
| `club-depth-welcome-on-member-onboarded` | `club_member_onboarded` | Welcome after onboarding completes |
| `club-depth-admin-notify-on-report` | `club_member_reported` | Email ops inbox on new report |
| `club-depth-send-notification-digests` | `scheduled` (daily) | Calls `send_club_notification_digests` |

Import via **Automation → Recipes → membership-club-depth**. Recipes ship **disabled** — set admin email / SMTP, then enable per workflow.

**Paid subscriber activation (optional)**

For recurring supporters who opt into club at checkout:

1. Commerce passes `club_opt_in` / `signup_flow_opt_in` metadata on linked checkout.
2. `commerce_subscription_started` fires; Automation recipe can call User `send_activation_email`.
3. Entitlement checker `hasActiveSubscriptionForEmail` gates activation when configured.

Free club (`club_free_register`) does not require this path.

**Project site files**

| File | Role |
|------|------|
| `club.html` | Hub shell, onboarding modal, feed, profile modal |
| `js/club-app.js` | API client, mention rendering, digest prefs, wishes/deals, `?member=` router |
| `css/club-social-v3.css` | Onboarding, badges, wish status pills, moderation affordances |
| `sponsors.html` | Optional `club_opt_in` checkbox on recurring checkout |

Cache-bust `club-app.js` after deploy (`?v=` query) when iterating on large bundles.

**MCP / admin**

- `user_reconcile_supporter_badges` — badge sync (P79, unchanged)
- `automation_import_recipe_pack` with pack id `membership-club-depth`
- Collections seed: pinned post **Introduce yourself** (`author: __birkly__`, slug `introduce-yourself`)

## Related

- [User signup and membership](user-signup-membership.md) — P79 free club, badges, signup flows
- [User plugin](user-plugin.md)
- [UGC ownership and social graph](user-ugc-ownership.md)
- [Automation triggers](../05-automation/triggers.md)
- [Automation conditions and actions](../05-automation/conditions-and-actions.md)
- [Commerce subscriptions](commerce-subscriptions.md)
