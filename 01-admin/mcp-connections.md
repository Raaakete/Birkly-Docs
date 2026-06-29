# Connect your AI app

Let **Claude**, **ChatGPT**, or **Cursor** work with your Birkly content. You create a connection in the admin, copy one **Connector URL**, paste it in your AI app, and sign in when prompted. No files to edit.

Built-in admin chat (API key) is separate — see [Built-in assistant](ai-connections.md).

## Summary

Open **Settings → AI** → **Connect your AI app**. Click **Add connection**, copy the **Connector URL**, paste it in your AI app's connector settings, and complete sign-in (OAuth). Pending write actions appear in the **Approvals** tab of the floating chat button.

## Quick start

1. **Settings → AI** tab.
2. Under **Connect your AI app**, click **Add connection**.
3. Name the connection and choose a role (Viewer, Editor, or Admin).
4. Copy the **Connector URL** from the connection card.
5. In your AI app:
   - **Claude:** Settings → Connectors → Add connector → paste URL
   - **ChatGPT:** Settings → Connectors → paste URL
   - **Cursor:** Settings → MCP / Connectors → paste URL
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
| Connector won't connect | Site is public HTTPS; URL copied exactly |
| OAuth fails | Create a new connection; retry sign-in in your app |
| No tools after connect | Connection role; restart your AI app |
| Writes blocked | Approval queue in chat **Approvals** tab |

## Related

- [AI overview](ai-overview.md)
- [Built-in assistant](ai-connections.md)
- [AI approvals](ai-approvals.md)
- [Settings](settings.md)
