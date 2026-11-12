# Commerce membership

## Summary

A paid membership is a User tier linked to a Commerce product. Create that link under **User → Membership products**. Commerce does not offer a mapping wizard.

## Beginner

**Example: grant a tier after a subscription starts**

1. Enable **User Management** and **Commerce**.
2. Open **User → Membership products**. Click **Add product**.
3. Fill name, collection, entry id, purchase option, tier, and signup flow (for example `pay_then_activate`). Turn the row **On** and click **Save products**. Tier grant and revoke run on subscription events.

**Commerce → Settings → Membership mappings** lists mappings stored by older installs. New tier grants are not created on that screen. **Import Commerce mappings** on the User tab copies those stored rows.

## Advanced Users

Past-due grace days and the default tier on revoke are on the same User screen. Recurring billing itself stays on the Commerce **Subscriptions** topic. A publish of docs.birkly.io does not change either manual. Update the plugin that owns the screen.

## Related

- [User management plugin](user-plugin.md)
- [Plugins](plugins.md)
