# MCP connections

MCP (Model Context Protocol) lets external AI clients — such as **Claude Desktop** — call Birkly tools with the same permission model as in-admin AI chat. Each MCP connection has its **own API key** scoped to that connection's role.

## Summary

Create an MCP connection under **Settings → AI Connections** (provider: **MCP**). Birkly shows a server URL and API key. Configure your MCP client to call that URL with the key. The client can list collections, read entries, and perform allowed write actions — subject to the connection's role and approval settings. For chat inside the admin panel, use OpenAI, Anthropic, Ollama, or another chat provider instead of MCP.

## Beginner

**When to use MCP**

- You want **Claude Desktop** (or another MCP-capable app) to work with your Birkly content.
- You need **bidirectional** access: the external assistant reads and optionally updates CMS data.
- You prefer the assistant to run **outside** the browser while still respecting Birkly roles.

**When not to use MCP**

- You only want chat inside the Birkly admin → add an **OpenAI**, **Anthropic**, or **Ollama** connection instead.
- Your tool does not support MCP → use the Public API or automation webhooks.

**Setup steps**

1. In Birkly admin: **Settings → AI Connections → Add Connection**.
2. Provider: **MCP (Model Context Protocol)**.
3. Name the connection (e.g. "Claude Desktop — Editor").
4. Choose a **role** (Viewer, Author, Editor, Admin) — this limits what MCP can do.
5. Set **Require approval for AI actions** if writes should go to the approval queue first (recommended).
6. Save. Copy the **MCP Server URL** and **API key** shown once.
7. In your MCP client, add Birkly as a server using that URL and key (see platform `mcp-bridge.js` for stdio clients).

**Security tips**

- Treat the MCP API key like a password — one key per connection; revoke by deleting the connection.
- Use the **lowest role** that fits the task (e.g. Viewer for read-only research).
- Keep **approval enabled** for production instances until you trust automated writes.

## Advanced Users

**HTTP endpoint**

- `POST /api/mcp_server.php` with header `X-MCP-API-Key: {key}` or query `api_key={key}`.
- JSON-RPC style body: `method`, `params`, `id`.
- Tools mirror admin AI actions allowed for the connection role (`core/ai_permissions.php`).

**Per-connection keys (Phase 3)**

Each MCP row in AI Connections stores a unique `mcp_api_key`. Keys are not shared across connections or with chat providers.

**Bridge for Claude Desktop**

The platform ships `mcp-bridge.js` at the CMS root for environments that expect stdio MCP. Point `HARUCMS_URL` and `HARUCMS_API_KEY` at your instance.

**Approval flow**

When `require_approval` is true, MCP write tools create rows in `data/ai_approvals/` instead of executing immediately — same queue as admin chat writes.

## Related

- [AI connections](ai-connections.md)
- [AI approvals](ai-approvals.md)
- [AI overview](ai-overview.md)
