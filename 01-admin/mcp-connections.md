# Connect your AI app

Let **Claude**, **ChatGPT**, or **Cursor** work with your Birkly content. You create an **AI agent** in the admin, copy one **Connector URL** (ends with `/mcp`), paste it in your AI app, and sign in when prompted. **Leave Client ID and Client Secret empty** in your app — OAuth happens automatically.

Built-in admin chat (API key) is separate — see [Built-in assistant](ai-connections.md).

## Summary

Open **Settings → AI** → **Connect your AI app**. Click **Add agent**, copy the **Connector URL**, paste it in your AI app's connector settings, and complete sign-in (OAuth). Pending write actions appear in the **Approvals** tab of the floating chat button.

## Quick start

1. **Settings → AI** tab.
2. Under **Connect your AI app**, click **Add agent**.
3. Name the agent, optionally add a description, and choose a role (Viewer, Editor, or Admin).
4. Copy the **Connector URL** from the agent card (HTTPS, ends with `/mcp`).
5. In your AI app:
   - **Claude:** Settings → Connectors → Add connector → paste URL only (leave OAuth fields empty)
   - **ChatGPT:** Settings → Connectors → paste URL only
   - **Cursor:** Settings → MCP / Connectors → paste URL only
6. Sign in when your app asks.

## Requirements

- Your Birkly site must use a **public HTTPS** address for external AI apps. Local or HTTP-only installs show a warning in Settings and will not work with remote connectors.

## Roles and approvals

| Role | Access |
|------|--------|
| Viewer | Read collections and entries |
| Editor | Read and suggest changes (often needs approval) |
| Admin | Full access — use carefully |

Enable **Ask me before AI changes or publishes content** (recommended). Pending actions appear in the floating chat **Approvals** tab.

## Developer / debug

For local Claude Desktop development only, `mcp-bridge.js` is available under the collapsed **Developer / debug** section on the AI settings tab. Normal users do not need this file.

## Troubleshooting

| Issue | Check |
|-------|-------|
| Connector won't connect | Site is public HTTPS; URL copied exactly; ends with `/mcp` |
| OAuth fails | Create a new agent; retry sign-in; leave Client ID/Secret empty |
| No tools after connect | Agent role; restart your AI app |
| Writes blocked | Approval queue in chat **Approvals** tab |

## Related

- [AI overview](ai-overview.md)
- [Built-in assistant](ai-connections.md)
- [AI approvals](ai-approvals.md)
- [Settings](settings.md)
