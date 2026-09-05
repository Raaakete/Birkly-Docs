# User signup and membership

Link **paid subscriptions** to **User Management** tiers using signup flows and membership products. Commerce handles payments and generic subscription events; User owns activation, tier grant/revoke, and club-style onboarding.

## Summary

Membership sites use Commerce **fulfillment: none** with a **recurring** purchase option. After payment, Commerce fires `commerce_subscription_started`. The **User Management** plugin listens for that event, grants the linked tier when the product matches a **membership product**, and runs the configured **signup flow** (for example `pay_then_activate` for checkout → activation email → password → club access). Tier lifecycle (cancel, past_due, grace) is also User-owned.

Requires **User Management 1.0.13+** and **Commerce 1.0.106+**. **P77 (1.0.46+):** new member sites should use [fieldtype profiles](user-fieldtype-profiles.md) and `user_member_signup` for collection-scoped registration; global **Signup Fields** are deprecated.

**P79 (1.0.60+):** Birkly Club access is **free** — visitors join with the `club_free_register` preset and receive the `club` tier without payment. **Donor recognition** is stored on **`club-profiles` entry fields** (`supporter_badge`, `supporter_cadence`), not as User plugin tiers. Commerce emits payment facts; User **`SupporterBadgeSync`** reconciles badge fields from orders, subscriptions, and `supporters` entries.

## Beginner

**Architecture**

| Layer | Owns |
|-------|------|
| **Commerce** | Catalog, checkout, subscriptions, `commerce_subscription_started` |
| **User** | Signup flows, activation email, membership products, tier grant/revoke |
| **Your site** | Forms pass `signup_flow_*` metadata into linked checkout |

Commerce no longer grants tiers from purchase mappings or `club_opt_in`. Those paths were removed in P74.

**P77 member signup (preferred for new sites)**

| API | Use |
|-----|-----|
| `user_member_signup` | Collection-scoped schema + register (`collection`, `tier`, `fields`) |
| `user_signup` | Preset multi-step flows (`pay_then_activate`, etc.) — pass `collection` / `tier` in context when using fieldtype profiles |

Signup requirements come from the **tier-linked fieldtype profile**, not the legacy Signup Fields tab. When `payment_required_at_signup` is set on the profile, registration returns `checkout_required` and defers publish until Commerce payment completes.

**Preset signup flows**

| Flow id | Use case |
|---------|----------|
| `free_register` | Open registration with optional email verification |
| `club_free_register` | **Free club join** — no payment; creates `club-profiles` entry with `supporter_badge: none` (P79) |
| `pay_then_activate` | Checkout first, then activation link (legacy paid club path) |
| `register_then_pay` | Account first, then redirect to checkout |
| `activate_only` | Resend activation for visitors who already paid |

Enable and edit flows under **User → Signup flows**. Redirect URLs and Commerce product refs can be overridden per site.

**Set up a membership product**

1. Activate **Commerce** and **User Management** (1.0.53+ recommended).
2. Create a sellable entry with **fulfillment: none** and a recurring purchase option (for example monthly).
3. Open **User → Membership products** and link the Commerce collection/entry/option to a **tier id** (for example `club`) and a **signup flow id** (for example `pay_then_activate`).
4. Optionally import legacy mappings from **Commerce → Settings → Mappings** using the migration helper in User admin.

**Free club join (`club_free_register`) — P79**

Club **access** and **donor recognition** are separate:

| Concept | Where it lives | How it is granted |
|---------|----------------|-------------------|
| **Club access** | User tier `club` | Free signup via `club_free_register` — no donation required |
| **Supporter badge** | `club-profiles` entry fields | Synced from Commerce orders/subscriptions by email match |

1. Guest opens your club page and submits the free join form (name, email, password — fields from the tier-linked profile).
2. Site calls the signup flow API with `flow_id: "club_free_register"`.
3. User plugin runs steps: `collect_fields` → optional `verify_email` → `create_club_profile` → `grant_tier` → redirect to `/club.html`.
4. New member receives **`club` tier**, a **`club-profiles` entry** with `supporter_badge: none`, and full member hub access (feed, directory, profile).

Example API sequence:

```http
POST /api/index.php?route=user_signup&action=start
{ "flow_id": "club_free_register", "email": "member@example.com", "fields": { "display_name": "Alex" } }

POST /api/index.php?route=user_signup&action=step
{ "session_id": "…", "step_id": "fields", "password": "…", "fields": { … } }
```

Enable the preset under **User → Signup flows**. Redirect URL defaults to `/club.html`.

**Paid club path (`pay_then_activate`) — optional**

Sites that still gate club access on checkout can use the paid flow:

1. Visitor selects a recurring donation/product and opts into the club on your site form.
2. Form includes hidden `signup_flow_id=pay_then_activate` and checkbox `signup_flow_opt_in=1`.
3. Linked checkout forwards `signup_flow_id`, `signup_flow_session_id`, and `signup_flow_opt_in` in checkout metadata.
4. After payment, User sends an activation email (no password at checkout).
5. Visitor completes activation, receives the linked tier, and lands on your club page.

On P79 sites, prefer **`club_free_register`** for access and let donations update badges only.

**Supporter badges on `club-profiles` (not tiers)**

Badges are **CMS entry fields** on the `club-profiles` collection — not User plugin tiers and not admin badge UI in User settings.

| Field | Type | Purpose |
|-------|------|---------|
| `supporter_badge` | `select` | `none`, `supporter`, `patron`, `champion`, `monthly_supporter`, `monthly_patron`, `monthly_champion` |
| `supporter_cadence` | `select` | `none`, `one_time`, `month` |
| `supporter_amount_eur` | `number` | Highest qualifying gift (EUR) |
| `supporter_entry_id` | `text` | Optional link to a `supporters` row (admin/debug) |
| `supporter_synced_at` | `text` | ISO timestamp of last sync |

**Email is the join key:** when a donor later signs up with the same email (or vice versa), `SupporterBadgeSync` updates the **existing** profile — it does not create a duplicate user.

**Badge rules** are configurable in `{user_data_dir}/supporter_badge_rules.json` (defaults below). When both one-time gifts and an **active monthly** subscription exist, the **monthly badge wins**. Subscription cancel **downgrades the badge only** — the member **keeps** `club` tier access.

| Cadence | Amount (EUR) | Badge value |
|---------|--------------|-------------|
| `one_time` | ≥ 5 | `supporter` |
| `one_time` | ≥ 25 | `patron` |
| `one_time` | ≥ 100 | `champion` |
| `month` | ≥ 5 | `monthly_supporter` |
| `month` | ≥ 25 | `monthly_patron` |
| `month` | ≥ 100 | `monthly_champion` |

The public **`user_account` → `list_members`** API returns `supporter_badge` and `supporter_cadence` for directory and feed rendering. The **`supporters`** wall (`supporters.featured`) stays independent — featured wall rows do not require a club account.

**Badge sync (`SupporterBadgeSync`) and reconcile**

`SupporterBadgeSync` reads Commerce facts (paid orders, active subscriptions) and optional `supporters` entries, resolves the badge via `SupporterBadgeRules`, and writes the fields on the matching `club-profiles` entry.

| Method | Scope |
|--------|-------|
| `reconcileForEmail($email)` | One member after donate, signup, or subscription change |
| `reconcileForUserId($userId)` | Same, keyed by site user id |
| `reconcileAll()` | Batch — all club-tier users |

**When sync runs automatically**

- Commerce order paid / subscription started, canceled, or paused (via `UserMembershipLifecycle` and Automation `sync_supporter_badge` action)
- Plugin upgrade — one-time grandfather reconcile for existing donors
- After `club_free_register` completes — profile starts at `supporter_badge: none`; sync runs when a matching donation appears

**Manual reconcile (admin)**

1. Open **User → Members** (or Club settings).
2. Run **Sync supporter badges** — calls `reconcile_supporter_badges` and processes all profiles.

MCP: `user_reconcile_supporter_badges` (optional `email` for a single member).

Automation plugin action: `sync_supporter_badge` with `{ "email": "member@example.com" }` when Automation is active.

**Resend activation (club page)**

Use the `activate_only` flow via the public API instead of calling `user_activation` directly:

```http
POST /api/index.php?route=user_signup&action=start
{ "flow_id": "activate_only", "email": "member@example.com" }

POST /api/index.php?route=user_signup&action=step
{ "session_id": "…", "step_id": "request", "email": "member@example.com" }
```

Entitlement is enforced server-side (`user_activation_entitled` filter and active subscription checks).

## Advanced Users

**Membership products**

Configured in User admin and stored under the User plugin data directory. Each row maps:

- Commerce `collection`, `entry_id`, `purchase_option_id`
- User `tier_id`
- `signup_flow_id` (preset to run after purchase)

`UserMembershipLifecycle` grants the tier on `commerce_subscription_started` and revokes (after grace) on cancel/past_due when the subscription matches a linked product.

**Signup flow API**

| Action | Method | Purpose |
|--------|--------|---------|
| `list_flows` | GET | List presets + overrides |
| `get_flow` | GET | Single flow config |
| `start` | POST | Begin session (`flow_id`, optional `email`, `fields`) |
| `step` | POST | Run current or named step |
| `status` | GET | Session progress |

**Checkout metadata (Commerce linked checkout)**

Commerce storefront forwards these form fields into `payload.metadata`:

| Key | Meaning |
|-----|---------|
| `signup_flow_id` | Preset id (for example `pay_then_activate`) |
| `signup_flow_session_id` | Flow session from `user_signup` start (optional) |
| `signup_flow_opt_in` | `1` when visitor opted into club/membership onboarding |

**Plugin services**

| Service | Provider |
|---------|----------|
| `user_activation_shelf` | Send activation email, complete activation |
| `signup_flow_shelf` | Start/step signup flows from other plugins |

Consumers use `get_plugin_service()` — no cross-plugin `require` of User source files.

**Automation**

Commerce fires generic subscription events only:

| Trigger | When |
|---------|------|
| `commerce_subscription_started` | Recurring `fulfillment: none` line paid (canonical) |
| `commerce_membership_started` | Deprecated alias — migrate workflows to `commerce_subscription_started` |

The deprecated **membership club activation** Automation recipe was removed in P74. Club activation is handled by User signup flows, not a Commerce recipe.

**Migration from purchase mappings**

If you previously used **Commerce → Settings → Mappings** with `grant_tier`:

1. Upgrade User and Commerce to P74 versions.
2. Open **User → Membership products** and run **Import from Commerce mappings**.
3. Remove tier grants from Commerce mappings (they are ignored after Commerce 1.0.106).

**Supporter badge sync (P79)**

| Trigger | Handler |
|---------|---------|
| `commerce_order_paid` | Automation recipe or lifecycle → `SupporterBadgeSync::reconcileForEmail` |
| `commerce_subscription_started` / `canceled` / `paused` | Badge recompute; **does not** revoke `club` tier on cancel |
| Admin **Sync supporter badges** | `reconcileAll()` |
| MCP `user_reconcile_supporter_badges` | Single email or batch |

Commerce emits payment facts only — badge threshold logic stays in User plugin (`supporter_badge_rules.json` + `SupporterBadgeRules`).

## Related

- [User plugin](user-plugin.md)
- [User fieldtype profiles](user-fieldtype-profiles.md)
- [Member migration](user-member-migration.md)
- [Commerce plugin](plugins/commerce.md)
- [Commerce subscriptions](commerce-subscriptions.md)
- [Automation triggers](../05-automation/triggers.md)
- [Storefront patterns](../03-templating/storefront-patterns.md)
