# Commerce membership wiring

Link sellable **membership products** to **User Management** tiers so a paid purchase automatically grants site access.

## Summary

Membership products use Commerce **fulfillment: none** with a **recurring** purchase option. After payment, **PostPurchaseRouter** fires `commerce_membership_started` and **Purchase mappings** grant the configured user tier. Use the **Mappings** tab (or membership wizard) to connect a product slug to a tier id. Requires the **User Management** plugin.

## Beginner

**Set up a membership product**

1. Activate **Commerce** and **User Management**.
2. In **Commerce → Fieldtypes**, use the **Membership** preset (fulfillment `none`, recurring intervals enabled).
3. Add the fieldtype to a collection (for example `memberships`).
4. Create an entry with a recurring purchase option (for example €9/month).

**Wire tier on purchase**

1. Open **Commerce → Mappings**.
2. Enter a mapping key:
   - **Per product:** `entry:memberships:premium` (collection slug + entry slug)
   - **Whole collection:** `collection:memberships`
3. Enter the **Grant tier ID** from User Management (for example `premium`).
4. Click **Save Mapping**.

**What happens at checkout**

1. Customer buys the membership (logged in or registers during checkout).
2. Order is paid.
3. PostPurchaseRouter processes `fulfillment: none`.
4. Purchase mapping assigns the user tier.
5. Automation trigger `commerce_membership_started` fires (welcome email, etc.).

**Membership fieldtype preset**

Commerce → Fieldtypes → **Membership** quick start sets:

- Default fulfillment: `none`
- Billing intervals: month, year
- Purchase options editor enabled

**User must exist**

Tier grant resolves `customer_user_id` on the order, or looks up by `customer_email`. For `register` fulfillment on workshops, attendee name is collected at checkout; for memberships, ensure the buyer has or creates an account.

## Advanced Users

**PurchaseMappingService**

Mappings file: `data/plugins/commerce/purchase_mappings.json`

```json
{
  "mappings": {
    "entry:memberships:community": { "grant_tier": "community" },
    "collection:memberships": { "grant_tier": "member" }
  }
}
```

Entry-specific keys take precedence over collection-wide keys.

**PostPurchaseRouter (`none`)**

```php
// After paid order line with fulfillment none + recurring
commerce_membership_started → automation
PurchaseMappingService::applyPurchaseMappings($order)
```

**API**

- `save_mapping` — `{ key, grant_tier }`
- `delete_mapping` — `{ key }`

**Automation**

| Trigger | When |
|---------|------|
| `commerce_membership_started` | Recurring line with `fulfillment: none` paid |

Pair with User Management tier permissions to gate collections and features.

**Template pattern**

```html
{for each entry in 'memberships'}
  <a href="{commerce_buy_url entry.id 'memberships'}">Join {entry.title}</a>
{/for}
```

## Related

- [Commerce plugin](plugins/commerce.md)
- [User plugin](user-plugin.md)
- [Commerce subscriptions](commerce-subscriptions.md)
- [Storefront patterns](../03-templating/storefront-patterns.md)
