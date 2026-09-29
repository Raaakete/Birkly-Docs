# Known issues — Wave 1 engineering bar

## Summary

Public list of **accepted limitations** while P86 (self-host–ready engineering) is in progress. This is **not** a promise that a closed-alpha cohort is open — see product announcements separately.

**Support:** hello@birkly.io · in-admin **Feedback** (optional contact consent).

## Beginner

**Example: install Events from the Hub**

1. Open **Plugins → Hub** and install **Events**. **Studio** is on the Hub as well, when you need the site IDE.
2. Enable the plugin. **Events** appears in the sidebar.
3. Open its **Documentation** tab for the class and RSVP walkthrough. Send other blockers through in-admin **Feedback** or hello@birkly.io.

## P1 — documented limitations

| Area | Issue | Workaround |
|------|--------|------------|
| **Hub** | Events and Studio install from the Hub. Each plugin’s **Documentation** tab is the manual | Update the plugin when that manual should change |
| **Membership** | New tier grants are **User → Membership products**. Commerce **Settings → Membership mappings** lists older stored rows and does not create grants | Add the product on the User tab. Use **Import Commerce mappings** there for rows already stored |
| **Hub** | Plugin versions must be installed/upgraded via Marketplace; pin versions your team documents | Hub → Update per plugin |
| **Email** | User activation and some notifications need **Connections → SMTP** | Run test email before signup tests |
| **i18n** | Selectable admin languages are English, German, French, Spanish, and Japanese. Danish, Hindi, and Chinese ship in the repo and stay out of the picker | Use a selectable language for demos |

## P2 — deferrals

| Area | Issue |
|------|--------|
| **Locales** | da, hi, and zh are not selectable. en, de, fr, es, and ja are |
| **Commerce** | FX conversion between currencies — set prices per currency explicitly |
| **Feedback** | Self-host stores JSON under `data/feedback/` unless optional Ops relay is configured |
| **Journeys** | Full P28 beta journey catalog not required for engineering closure |

## Advanced Users

## Fixed recently (reference)

- OSS git history scrub for sensitive paths (public `Raaakete/Birkly`)
- Feedback relay default on Birkly-operated installs; consent + legal Help topic
- Onboarding admin language + Settings site language decoupling
- User plugin delete/permissions (Hub User Management 1.0.97+)

## Related

- [Self-host install](../07-operations/self-host-install.md)
- [Closed alpha guide](closed-alpha-guide.md) (product testing notes)
- [Alpha legal](alpha-legal.md)
