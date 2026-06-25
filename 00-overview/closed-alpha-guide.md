# Closed alpha tester guide

Guide for **invited closed-alpha testers** of Birkly. If you do not have an invite, request access at the [Birkly website](https://birkly.com) waitlist.

## Summary

Closed alpha means Birkly is feature-complete enough for real self-hosted trials but **not** a public beta. Expect rough edges. Your job: use the CMS on your own server, report bugs and ideas via in-admin **Feedback**, and read **Help** for docs. We ship fixes from your reports before open beta.

## What is in this alpha

| Area | What to test |
|------|----------------|
| **BYOAI** | Connect your provider (OpenAI, Claude, Ollama, …), assign a role, try chat read/write and approval queue |
| **MCP** | Optional: connect Claude Desktop with a per-connection MCP key |
| **Automation** | Enable the automation plugin; create a webhook or scheduled workflow |
| **User plugin** | Registration, login, collection permissions |
| **ContentEditor** | Block components (callout, quote, CTA, table, image) — save and reload entries |
| **Feedback** | Submit bug/idea from the admin Feedback widget; confirm it appears in Feedback admin |

## Getting started

1. **Install** Birkly on a server or local PHP (see [Getting started](getting-started.md)).
2. Complete **onboarding** (project name, first admin user).
3. Open **Help** (sidebar) for contextual docs — links open full Birkly-Docs topics.
4. Enable plugins you need under **Settings → Plugins** (Automation, User Management).
5. Connect **AI** under **Settings → AI Connections** — start with Ollama locally if you have no API key.

## Reporting issues

Use **Feedback** in the admin (not only email) so we capture:

- Your message and category (bug / idea / other)
- Optional screenshot
- Page URL, CMS version, and browser info

We use this data only to improve the alpha (see website Privacy Policy for retention). Include steps to reproduce for bugs.

## What not to expect yet

- Production SLA or 24/7 support
- Polished dark mode / full responsive admin rework
- Plugin marketplace
- Managed hosting from us — you self-host

## Useful doc links

- [AI connections](ai-connections.md) · [MCP connections](mcp-connections.md)
- [Automation overview](../05-automation/automation-overview.md)
- [User plugin](../06-extensibility/user-plugin.md)
- [ContentEditor blocks](../02-content/content-editor.md)

## Related

- [Getting started](../00-overview/getting-started.md)
- [Help and onboarding](help-and-onboarding.md)
- [Troubleshooting](../07-operations/troubleshooting.md)
