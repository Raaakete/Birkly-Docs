# MCP connections

MCP (Model Context Protocol) lets **external** AI clients — such as **Claude Desktop** — call Birkly tools with the same permission model as in-admin AI chat. In Phase 4, inbound MCP is **first-class**: endpoint profiles live in **Settings → MCP Connections**, separate from outbound BYOAI.

## Summary

Create **MCP endpoints** under **Settings → MCP Connections**. Each endpoint has its own API key, role, and optional approval for writes. Configure your MCP client (Claude Desktop via `mcp-bridge.js`, experimental Cursor, or direct HTTP) to call `POST /api/mcp_server.php` with that key. This path does **not** require a provider API key on your Birkly server. For chat **inside** the admin panel, use [AI connections](ai-connections.md) (outbound BYOAI) instead.

## Beginner

**When to use MCP (inbound)**

- You want **Claude Desktop** or another MCP-capable app to work with your Birkly content.
- You need **bidirectional** access: the external assistant reads and optionally updates CMS data.
- You prefer the assistant to run **outside** the browser while still respecting Birkly roles.
- You are **not** technical enough to manage provider API keys — MCP only needs one Birkly-issued key.

**When not to use MCP**

- You only want chat inside the Birkly admin → add an **OpenAI**, **Anthropic**, or **Ollama** connection under [AI connections](ai-connections.md).
- Your tool does not support MCP → use the Public API or automation webhooks.

**Setup steps**

1. In Birkly admin: **Settings → MCP Connections** (dedicated tab).
2. Click **Add MCP endpoint** (empty state is normal on fresh installs — keys are not auto-created).
3. Name the endpoint (e.g. "Claude Desktop — Editor").
4. Choose a **role** (Viewer, Author, Editor, Admin) — this limits what MCP can do.
5. Set **Require approval for AI actions** if writes should go to the approval queue first (recommended).
6. Save. Copy the **MCP Server URL** (`…/api/mcp_server.php`) and **API key** shown once.
7. In your MCP client, configure the bridge or HTTP client (see platform `mcp-bridge.js` and `docs/mcp-setup-guide.md`).

**Upgrading from Phase 3**

If you previously created a provider type **MCP** under AI Connections, run the platform migration script once:

```bash
php scripts/migrate-mcp-endpoints.php
```

Legacy keys continue to work for 90 days while you move clients to the new endpoints.

**Security tips**

- Treat the MCP API key like a password — one key per endpoint; revoke by deleting or rotating the endpoint.
- Use the **lowest role** that fits the task (e.g. Viewer for read-only research).
- Keep **approval enabled** for production instances until you trust automated writes.

## Advanced Users

**Storage**

- Endpoint profiles: `settings/mcp_endpoints.json` (managed by `core/mcp_endpoints.php`).
- Admin API: `api/mcp_endpoints.php` — create, list, rotate, revoke (auth + CSRF).
- Not stored on outbound AI connection rows (`users/*.json`).

**HTTP endpoint**

- `POST /api/mcp_server.php` with header `X-MCP-API-Key: {key}` or query `api_key={key}`.
- JSON-RPC style body: `method`, `params`, `id`.
- Tools mirror admin AI actions allowed for the endpoint role (`core/ai_permissions.php`).
- Rate limits, failed-auth lockout, and audit log (`data/mcp_audit/`) apply — no secrets in audit entries.

**Bridge for Claude Desktop**

The platform ships `mcp-bridge.js` at the CMS root for stdio clients. Environment:

- `BIRKLY_URL` — your instance base URL (preferred)
- `BIRKLY_MCP_API_KEY` — endpoint key from MCP Connections
- Legacy: `HARUCMS_URL` / `HARUCMS_API_KEY` still accepted

**Client compatibility**

| Client | Status |
|--------|--------|
| Claude Desktop + `mcp-bridge.js` | Verified |
| Cursor | Experimental |
| OpenAI MCP | Emerging |
| curl / HTTP | Verified |

See platform `docs/reviews/p4-mcp-client-matrix.md`.

**Approval flow**

When `require_approval` is true, MCP write tools create rows in `data/ai_approvals/` instead of executing immediately — same queue as admin chat writes.

## Related

- [AI connections](ai-connections.md) — outbound BYOAI only
- [AI approvals](ai-approvals.md)
- [AI overview](ai-overview.md)
- [AI chat and actions](ai-chat-and-actions.md)
