# AI on localhost

## Summary

Running Birkly on `http://localhost` works for day-to-day admin and the **built-in assistant**, but **cloud connector UIs** usually reject `http://localhost` URLs. For **Claude Desktop** on the same machine, use **`mcp-remote`** (stdio) with a **service agent** URL from **Settings → AI**. Alternatives: a short-lived **HTTPS tunnel**, or the legacy **mcp-bridge** under Developer / debug.

> **Warning:** Do **not** expose your admin panel to the open internet as a “quick fix.” Prefer `mcp-remote` + OAuth service agents for local desktop tools, or a short-lived tunnel only for the MCP endpoint.

## Beginner

### What works on localhost

| Path | Works? | Notes |
|------|--------|-------|
| Admin + **built-in assistant** on localhost | **Yes** | Outbound BYOAI (API keys) works from your machine. **Ollama** on `http://localhost:11434` is fine. |
| Remote **connectors** (Claude / ChatGPT / similar) → `http://localhost/mcp` | **Usually no** | Those apps need a **public HTTPS** Connector URL ending in `/mcp`. |
| **Claude Desktop** via **`mcp-remote`** + service agent URL | **Yes** | Recommended — stdio on your Mac/PC proxies to `http://localhost:PORT/mcp/agents/…` with OAuth. |
| **Tunnel** (`cloudflared` / ngrok) → HTTPS → `/mcp` | **Yes** | When the connector UI requires a public HTTPS URL. |
| **mcp-bridge** (legacy API-key stdio) | **Yes** | Developer / debug only — see Settings → AI. |

Where to configure connectors: **Settings → AI** (Settings → AI is the home for connectors). See [Connect your AI app](../01-admin/mcp-connections.md).

### Option A — mcp-remote + service agent (recommended for Claude Desktop)

Use when your AI app runs on the **same machine** as Birkly and supports **stdio** MCP servers.

1. **Settings → AI → Service agents → Add agent** — choose a preset (for example **Site builder** with Admin) and copy the connector URL (`http://localhost:8080/mcp/agents/ai_agent_…`).
2. In Claude Desktop config (`claude_desktop_config.json`), add:

```json
{
  "mcpServers": {
    "birkly-local": {
      "command": "/absolute/path/to/npx",
      "args": ["-y", "mcp-remote", "http://localhost:8080/mcp/agents/ai_agent_YOUR_ID"]
    }
  }
}
```

Use `which npx` for the absolute path — the desktop app may not inherit your shell `PATH`.

3. Quit Claude completely (not just close the window). On first connect, complete Birkly **OAuth** in the browser.
4. After installing or upgrading plugins, **restart Claude** so `tools/list` refreshes.

### Option B — Tunnel to public HTTPS

Use when the connector **must** be a public HTTPS URL (most browser or cloud Claude/ChatGPT connector UIs).

1. Run Birkly locally (for example `http://localhost:8080`).
2. Start a tunnel that terminates **HTTPS** and forwards to your local CMS port:

**cloudflared (example):**

```bash
cloudflared tunnel --url http://localhost:8080
```

**ngrok (example):**

```bash
ngrok http 8080
```

3. Copy the HTTPS origin the tunnel prints (for example `https://abc123.trycloudflare.com`).
4. In **Settings → AI**, use a Connector URL of the form:

```text
https://YOUR-TUNNEL-HOST/mcp
```

5. Paste that URL into Claude, ChatGPT, or Cursor. Leave Client ID / Client Secret empty. Sign in when prompted.

Keep the tunnel process running while you work. Treat the temporary URL like a secret — anyone who reaches `/mcp` still goes through Birkly auth, but you should not leave unused tunnels running.

### Option C — mcp-bridge (Developer / debug)

Legacy stdio bridge to `api/mcp_server.php` using `BIRKLY_MCP_API_KEY`. OAuth **service agents** are preferred. Instructions: **Settings → AI → Developer / debug**.

### Security reminders

- Prefer **mcp-remote + service agent** for purely local desktop workflows — no public URL.
- Tunnels are for development; shut them down when finished.
- Never set Birkly to “open admin with no auth” to make AI connect.
- Production sites should already be on public HTTPS — use the normal Connector URL from **Settings → AI**; no tunnel needed.

## Advanced Users

**Why remote connectors fail on localhost:** Cloud AI apps open OAuth and then call your MCP HTTP endpoint from their servers. Those servers cannot reach your laptop’s `127.0.0.1`. A tunnel provides a reachable HTTPS hostname; mcp-bridge avoids HTTP entirely by using stdio on the local machine.

**Ollama:** Built-in assistant provider `ollama` defaults to `http://localhost:11434/api/chat`. That path does not require a public URL because the request is **outbound from PHP** on the same host.

**Connector URL shape:** Always HTTPS in production and for tunneled local use; path ends with `/mcp`. See [Connect your AI app](../01-admin/mcp-connections.md#requirements).

**Related surfaces:** Website tools ([WebMCP](webmcp-tools.md)) are a different layer — browser agents on your **public site**, not the CMS MCP connector. Localhost WebMCP still needs a secure context (HTTPS or localhost).

## Further reading

- [Connect your AI app](../01-admin/mcp-connections.md) — personal connector, service agents, OAuth
- [Built-in assistant](../01-admin/ai-connections.md) — outbound API keys / Ollama
- [Agent Guide](../02-content/agent-guide.md) — Guide · Tools · Publish (connectors under **Settings → AI**)
- [Website tools (WebMCP)](webmcp-tools.md)
- [Developer mode](../01-admin/developer-mode.md) — system info and MCP smoke helpers
