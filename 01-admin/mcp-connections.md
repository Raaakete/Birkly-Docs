# MCP Connections (Inbound)

Inbound MCP endpoints let **external AI tools** (Claude Desktop, Claude remote connector, Cursor, curl scripts) connect to your Birkly site via the Model Context Protocol. You create and manage them under **Settings → AI & Integrations → Inbound (MCP)**. Each endpoint has its own API key (and optionally OAuth), role, and approval settings.

Outbound admin chat with your provider API keys is separate — see [AI connections](ai-connections.md).

## Summary

Open **Settings → AI & Integrations → Inbound (MCP)** to add an MCP endpoint. **Recommended:** use the **stdio bridge** (`mcp-bridge.js`) with Claude Desktop — create an endpoint, copy the API key and Claude Desktop config snippet, set `BIRKLY_URL` and `BIRKLY_MCP_API_KEY`. **Advanced:** for Claude's **remote connector** (claude.ai), set endpoint **Auth mode** to OAuth or Both, copy the **MCP Server URL**, and complete the OAuth flow when adding the connector. Pending write actions from inbound tools share the same approval queue as outbound chat.

## Beginner

**Where to add an endpoint**

1. In the admin sidebar, click **Settings**.
2. Open the **AI & Integrations** tab (deep link: `#ai-integrations`).
3. Scroll to the **Inbound (MCP)** section.
4. Read the setup cards (stdio bridge vs remote connector).
5. Click **Add Endpoint**, fill in the form, and save.
6. Reveal and copy the **MCP API key** when shown (stdio bridge) or the **MCP Server URL** (remote connector).

**Two connection paths (pick one per client)**

| Path | Best for | Auth | Complexity |
|------|----------|------|------------|
| **Stdio bridge** (recommended) | Claude Desktop, local MCP clients | API key via `mcp-bridge.js` | Low — copy config from admin |
| **Remote connector** | Claude.ai web/app remote MCP | OAuth 2.1 (PKCE + DCR) | Medium — enable OAuth on endpoint |

**Stdio bridge (recommended)**

Use this when Claude Desktop or another client runs a **local MCP server process** on your machine.

1. **Add Endpoint** in Inbound (MCP). Set **Name**, **Role** (Viewer for read-only; Editor/Author for writes), and **Require approval** (recommended for production).
2. Leave **Auth mode** at **API key** (default).
3. Save and **copy the MCP API key** when revealed.
4. Copy the **Claude Desktop config** JSON block from the endpoint row.
5. Edit your Claude Desktop config file:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
6. Set environment variables in the config:
   - `BIRKLY_URL` — Your Birkly base URL (e.g. `https://yoursite.com` or `http://localhost:8080`)
   - `BIRKLY_MCP_API_KEY` — The endpoint key from step 3
7. Use the **absolute path** to `mcp-bridge.js` in your Birkly installation as the `args` entry.
8. Restart Claude Desktop completely. Ask: “What Birkly tools do you have?” — expect tools such as `list_collections`, `list_entries`, `create_entry`.

The bridge translates stdio JSON-RPC from the client into HTTP calls to `POST /api/mcp_server.php`. No OAuth is required for this path.

**Remote connector (OAuth)**

Use this when adding Birkly as a **remote MCP server** in Claude's connector settings (claude.ai), without running `mcp-bridge.js` locally.

**Requirements:**

- Birkly must be reachable over **HTTPS** from the public internet (or Claude's broker).
- Endpoint **Auth mode** must be **OAuth** or **Both**.

**Steps:**

1. **Settings → AI & Integrations → Inbound (MCP)** → **Add Endpoint**.
2. Set **Auth mode** to **OAuth** (remote only) or **Both** (bridge + remote).
3. Optionally set **OAuth client ID** if you pre-register a client; otherwise dynamic client registration (DCR) assigns one at connect time.
4. Copy the **MCP Server URL** (ends with `/api/mcp_server.php`).
5. In Claude (web or app), open **Settings → Connectors** (or Integrations).
6. Add a custom MCP server and paste the **MCP Server URL**.
7. Complete the OAuth flow when prompted. Tools should appear after connection.

If OAuth fails immediately (e.g. `ofid_…` errors), confirm auth mode is OAuth or Both and that your install serves `/.well-known/oauth-protected-resource`.

**Auth modes**

| Mode | API key (bridge/curl) | OAuth bearer (remote) |
|------|----------------------|------------------------|
| API key (default) | Yes | No |
| OAuth | No | Yes |
| Both | Yes | Yes |

**Approval queue**

If **Require approval** is on for an endpoint, inbound write actions (e.g. `create_entry`) appear in the shared **approval queue** at the top of the AI & Integrations tab — the same queue used by outbound admin chat.

**Legacy deep links**

Old bookmarks to `#mcp-connections` still open the **AI & Integrations** tab and scroll to the Inbound section.

## Advanced Users

**Architecture**

- Endpoints are stored under `settings/mcp_endpoints.json` (or equivalent). Each endpoint has: id, name, api_key (hashed at rest), role, require_approval, auth_mode (`api_key` | `oauth` | `both`), optional oauth_client_id.
- MCP requests hit `POST /api/mcp_server.php` with `X-MCP-API-Key` (API key path) or `Authorization: Bearer` (OAuth path).
- OAuth implements RFC 9728 protected-resource metadata, RFC 8414 authorization-server metadata, PKCE, and DCR. Well-known URLs and token endpoints are subdirectory-safe.
- `mcp-bridge.js` (CMS repo root) proxies stdio MCP to HTTP; env vars `BIRKLY_URL` / `BIRKLY_MCP_API_KEY` preferred (`HARUCMS_*` legacy aliases still accepted).

**API (typical)**

- **List:** `GET api/mcp_connections.php?action=list`
- **Create:** POST with `action=create`, name, role, require_approval, auth_mode, optional oauth_client_id. CSRF required. Returns endpoint id and one-time API key.
- **Update / delete:** POST with `action=update` or `action=delete`, id, and fields. CSRF required.
- **MCP protocol:** `POST /api/mcp_server.php` — JSON-RPC 2.0 (`tools/list`, `tools/call`, etc.)

**HTTP testing (API key path)**

```bash
export BIRKLY_URL="http://localhost:8080"
export BIRKLY_MCP_API_KEY="your_endpoint_key"

curl -sS -X POST "${BIRKLY_URL}/api/mcp_server.php" \
  -H "Content-Type: application/json" \
  -H "X-MCP-API-Key: ${BIRKLY_MCP_API_KEY}" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
```

Requires endpoint auth mode **API key** or **Both**.

**Available MCP tools (typical)**

- **list_collections**, **get_collection** — Collection metadata
- **list_entries**, **create_entry**, **update_entry** — Content (writes may require approval)
- **get_system_context** — Curated CMS context for the model

**Legacy migration**

If you used MCP keys under old **AI Connections** rows:

```bash
php scripts/migrate-mcp-endpoints.php --dry-run   # preview
php scripts/migrate-mcp-endpoints.php             # migrate
```

Legacy keys dual-resolve for 90 days. New setups use **Inbound (MCP)** only.

**Troubleshooting**

| Issue | Check |
|-------|-------|
| MCP not connecting (bridge) | Key from **Inbound (MCP)**, not outbound AI connections |
| Wrong URL | `BIRKLY_URL` = base URL only (no `/api/...` suffix) |
| Remote OAuth fails | Auth mode OAuth/Both; HTTPS reachable; well-known metadata returns JSON |
| No tools after connect | Endpoint **role**; restart client after config change |
| Permission errors | Role too restrictive; approval queue for writes |

## Related

- [AI overview](ai-overview.md)
- [AI connections](ai-connections.md) — Outbound BYOAI (admin chat)
- [AI approvals](ai-approvals.md)
- [Settings](settings.md)
