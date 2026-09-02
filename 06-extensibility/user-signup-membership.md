# User signup and membership

Link **paid subscriptions** to **User Management** tiers using signup flows and membership products. Commerce handles payments and generic subscription events; User owns activation, tier grant/revoke, and club-style onboarding.

## Summary

Membership sites use Commerce **fulfillment: none** with a **recurring** purchase option. After payment, Commerce fires `commerce_subscription_started`. The **User Management** plugin listens for that event, grants the linked tier when the product matches a **membership product**, and runs the configured **signup flow** (for example `pay_then_activate` for checkout → activation email → password → club access). Tier lifecycle (cancel, past_due, grace) is also User-owned.

Requires **User Management 1.0.13+** and **Commerce 1.0.106+**.

## Beginner

**Architecture**

| Layer | Owns |
|-------|------|
| **Commerce** | Catalog, checkout, subscriptions, `commerce_subscription_started` |
| **User** | Signup flows, activation email, membership products, tier grant/revoke |
| **Your site** | Forms pass `signup_flow_*` metadata into linked checkout |

Commerce no longer grants tiers from purchase mappings or `club_opt_in`. Those paths were removed in P74.

**Set up a membership product**

1. Activate **Commerce** and **User Management**.
2. Create a sellable entry with **fulfillment: none** and a recurring purchase option (for example monthly).
3. Open **User → Membership products** and link the Commerce collection/entry/option to a **tier id** (for example `club`) and a **signup flow id** (for example `pay_then_activate`).
4. Optionally import legacy mappings from **Commerce → Settings → Mappings** using the migration helper in User admin.

**Preset signup flows**

| Flow id | Use case |
|---------|----------|
| `free_register` | Open registration with optional email verification |
| `pay_then_activate` | Checkout first, then activation link (Birkly Club pattern) |
| `register_then_pay` | Account first, then redirect to checkout |
| `activate_only` | Resend activation for visitors who already paid |

Enable and edit flows under **User → Signup flows**. Redirect URLs and Commerce product refs can be overridden per site.

**Birkly Club pattern (`pay_then_activate`)**

1. Visitor selects a recurring donation/product and opts into the club on your site form.
2. Form includes hidden `signup_flow_id=pay_then_activate` and checkbox `signup_flow_opt_in=1`.
3. Linked checkout forwards `signup_flow_id`, `signup_flow_session_id`, and `signup_flow_opt_in` in checkout metadata.
4. After payment, User sends an activation email (no password at checkout).
5. Visitor completes activation, receives the linked tier, and lands on your club page.

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

## Related

- [User plugin](user-plugin.md)
- [Commerce plugin](plugins/commerce.md)
- [Commerce subscriptions](commerce-subscriptions.md)
- [Automation triggers](../05-automation/triggers.md)
- [Storefront patterns](../03-templating/storefront-patterns.md)
