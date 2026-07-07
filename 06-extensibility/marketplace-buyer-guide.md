# Marketplace — buyer license and install

Purchase plugins, themes, and template packs from the [Birkly Marketplace](https://marketplace.birkly.com) and install them in your self-hosted Birkly CMS. This guide is for **buyers** (site owners and admins). Developers publishing offers should see [Marketplace — provider publishing guide](marketplace-provider-guide.md).

## Summary

**Buyers** browse the marketplace catalog, checkout with email (guest or optional marketplace login), and receive a **license key** by email. In the CMS admin, open **Plugins → Marketplace**, enter the license key, and install or update the extension. Licenses activate per **installation** (your CMS generates a stable `installation_id`); seat tiers limit how many installations may use one key. Marketplace accounts are separate from CMS admin accounts.

## Beginner

**Buying an extension**

1. Visit [marketplace.birkly.com/catalog](https://marketplace.birkly.com/catalog).
2. Open an offer and click **Buy** (or **Get** for free offers).
3. Enter your **email** at checkout. You may optionally create a marketplace login later to see **My purchases**.
4. Complete payment (Stripe) for paid offers, or confirm for free offers.
5. Check your email for the **license key** and receipt.

**Installing in Birkly CMS**

1. Log in to your Birkly **admin** (`/admin`).
2. Go to **Plugins** (or **Settings → Plugins**).
3. Open the **Marketplace** tab.
4. Browse or search the catalog (read-only view of marketplace listings).
5. Click **Install** on an offer you own, or use **Activate license** and paste your license key.
6. The CMS downloads the artifact, verifies the SHA-256 checksum, runs preflight checks, and extracts the plugin to `plugins/`.
7. **Enable** the plugin from the Plugins list if it is not enabled automatically.

**Free vs paid**

- **Free offers** still issue a license key for seat tracking and updates.
- **Paid offers** require a successful checkout before the license activates.

**Seat limits**

| Tier | Typical use |
|------|-------------|
| Single site | One Birkly installation |
| Multi-site (3 / 10) | Agency or staging + production |
| Unlimited | Enterprise tier (as listed on the offer) |

If activation fails with a seat error, deactivate the license on an old installation or purchase a higher tier.

## Advanced Users

**Installation identity**

Each CMS install stores a local `installation_id`. License activation sends `license_key + installation_id` to the marketplace API. The same key on a second install counts toward your seat limit.

**Settings**

Default marketplace URL: `https://marketplace.birkly.com`. Override via environment variable `BIRKLY_MARKETPLACE_URL` or `settings/marketplace.json` (`marketplace_url`) for staging or self-hosted marketplace instances.

**Updates**

Installed marketplace plugins store `marketplace_slug` and version metadata. The Marketplace tab checks the registry API for newer semver releases. When an update is available, use **Update** to download, verify checksum, and replace files (backup first — see [Updates](updates.md)).

**Offline / air-gapped installs**

Browse and install require network access to the marketplace registry. Already-installed plugins continue to work offline; update checks fail gracefully until connectivity returns.

**Manual install (fallback)**

If you cannot use the Marketplace tab, download the release zip from your purchase email or **My purchases**, verify the published SHA-256 from the offer page, and extract manually into `plugins/`. You still need a valid license for paid offers if the plugin enforces marketplace licensing.

**Security**

- Install only from the official marketplace or sources you trust.
- Review declared capabilities before enabling a plugin.
- Keep Birkly core and marketplace plugins updated.

## Related

- [Marketplace — provider publishing guide](marketplace-provider-guide.md)
- [Plugins](plugins.md)
- [Updates](updates.md)
- [Troubleshooting](../07-operations/troubleshooting.md)
- [Birkly Marketplace](https://marketplace.birkly.com)
