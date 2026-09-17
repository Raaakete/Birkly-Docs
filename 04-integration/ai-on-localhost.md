# AI on localhost

## Summary

When Birkly runs on a **local URL** (for example `http://localhost:8080`), some AI connection paths behave differently than on a **public HTTPS** site. The built-in admin assistant still works. **External MCP connectors** (AI apps that connect *into* Birkly) usually cannot use a plain `http://localhost/...` URL in cloud-based setup UIs.

> **Warning:** Do **not** expose your admin panel to the open internet as a “quick fix.” Prefer **mcp-remote** on the same machine, or a **short-lived HTTPS tunnel** scoped to MCP.

## Built-in assistant (admin chat)

The assistant uses **outbound** API calls from your Birkly server to your provider. That works on local installs the same as on production — configure it under **Settings → AI → Built-in assistant**.

## External AI apps (MCP connectors)

These apps connect **to** Birkly (personal connector or service agent URLs from **Settings → AI**).

### Public HTTPS site

Copy the Connector URL from Settings → AI (`https://…/mcp` or `…/mcp/agents/…`). Paste it in your AI app and sign in with OAuth.

### Local HTTP site — desktop MCP app (stdio)

Many **desktop** MCP clients speak **stdio**, not HTTP. They cannot paste `http://localhost/...` directly.

**mcp-remote** is a small open-source helper (install via `npx`) that runs on your computer, bridges stdio ↔ HTTP, and forwards to your Birkly MCP URL.

1. **Settings → AI → Service agents → Add agent** — copy the **Connector URL** (`http://localhost:PORT/mcp/agents/…`).
2. Install [Node.js](https://nodejs.org/) if needed (`npx` comes with it).
3. In your desktop MCP app’s config, add a server that runs: `npx -y mcp-remote YOUR_CONNECTOR_URL`. Some apps need the absolute path to `npx` (`which npx`).
4. Restart the app. On first connect, complete **OAuth** in the browser.

Example (Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "birkly": {
      "command": "/absolute/path/to/npx",
      "args": ["-y", "mcp-remote", "http://localhost:8080/mcp/agents/ai_agent_YOUR_ID"]
    }
  }
}
```

### Local HTTP site — connector UI requires HTTPS

Use a **short-lived tunnel** (`cloudflared` / ngrok) to your Birkly port, then paste `https://YOUR-TUNNEL-HOST/mcp` (or your service-agent path) in the connector UI.

**cloudflared (example):**

```bash
cloudflared tunnel --url http://localhost:8080
```

### mcp-bridge (Developer / debug)

Under **Settings → AI → Developer / debug**, `mcp-bridge.js` is an optional stdio bridge that uses an **MCP API key** instead of OAuth service agents.

## Advanced

**Why cloud connectors fail on localhost:** Their servers call your MCP endpoint over the network; they cannot reach `127.0.0.1` on your laptop. Use **mcp-remote** on the same machine or an HTTPS tunnel.

**Related:** [Connect your AI app](../01-admin/mcp-connections.md) · [Built-in assistant](../01-admin/ai-connections.md)
