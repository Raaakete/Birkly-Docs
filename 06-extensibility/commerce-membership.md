# Commerce membership wiring

> **Moved (P74):** Membership tiers, activation, and club onboarding are owned by the **User Management** plugin. See **[User signup and membership](user-signup-membership.md)** for the current setup guide.

## What changed

| Before (P73) | After (P74) |
|--------------|-------------|
| Commerce purchase mappings granted tiers | User **Membership products** link Commerce refs → tier |
| `club_opt_in` checkout metadata | `signup_flow_id` + `signup_flow_opt_in` |
| `commerce_membership_started` + Automation club recipe | `commerce_subscription_started` + User signup flows |
| Commerce `CommerceClubActivation` | Removed — User `SignupFlowEngine` |

Commerce still sells recurring products and fires subscription events. It does **not** assign User tiers or send club activation emails.

## Quick pointer

- **Admin:** User → Membership products, Signup flows, Email templates
- **Site forms:** hidden `signup_flow_id`, optional `signup_flow_opt_in` checkbox
- **API:** `user_signup` (`start`, `step`, `status`)

Full documentation: [User signup and membership](user-signup-membership.md).

## Related

- [User signup and membership](user-signup-membership.md)
- [Commerce subscriptions](commerce-subscriptions.md)
- [Commerce plugin](plugins/commerce.md)
