# AI Connections

AI connections are **outbound** links between Birkly and an AI provider (OpenAI, Anthropic, Ollama, etc.). You add and manage them under **Settings → AI Connections**. Each connection has a provider, model, role, and optional approval requirement; you can share a connection with other users or keep it private.

**Inbound MCP** (Claude Desktop, external clients) is configured separately under **[MCP connections](mcp-connections.md)** — not on this tab.

## Summary

Go to **Settings → AI Connections** to add a connection (**BYOAI** — you bring your own provider and **API keys**). Choose a **provider** (OpenAI, Anthropic, Google, OpenRouter, Ollama, or Custom), enter the **API key** from the provider's developer console (not needed for Ollama), pick a **model**, set a **role** (what the AI is allowed to do), and choose who can use the connection and whether write actions **require approval**. **New connections default to requiring approval** for write actions. API keys are stored encrypted.

**Important:** A **ChatGPT Plus**, **Claude Pro**, or similar **consumer subscription is not an API key**. Birkly's outbound chat calls the provider API and needs a developer API key (or local Ollama). If you only use Claude Desktop without storing provider keys on Birkly, set up [MCP connections](mcp-connections.md) instead.

Ollama is the easiest way to start: install it locally, leave API key blank, and use the default URL.

## Beginner

**Where to add a connection**

1. In the admin sidebar, click **Settings**.
2. Open the **AI Connections** tab (outbound providers only).
3. Click **Add Connection** (or use the connection wizard).
4. Fill in the form and save.

**Form fields (typical)**

- **AI Provider** — OpenAI, Anthropic (Claude API), Google (Gemini), OpenRouter, Ollama (Local), or Custom HTTP.
- **Connection name** — A label for you (e.g. "My OpenAI" or "Local Ollama").
- **API key** — Your key from the provider developer dashboard. **Leave empty for Ollama.** Not the same as a ChatGPT or Claude app subscription.
- **API URL** — Usually only for **Ollama** or **Custom**. For Ollama the default is `http://localhost:11434/api/chat`.
- **Model** — Which model to use (e.g. gpt-4, llama3, claude-3-sonnet).
- **Role** — What the AI can do: Viewer (read only), Author, Editor, or Admin.
- **Who can use this connection** — Only me (private), All users, or Specific users.
- **Require approval for AI actions** — If checked, write actions go to the approval queue before they run.

**Example: Ollama (local, no API key)**

1. Install Ollama on your computer (see [Ollama quick start](https://ollama.ai)).
2. In a terminal run: `ollama pull llama3` (or another model).
3. In Birkly: Settings → AI Connections → Add Connection.
4. Provider: **Ollama (Local)**. Name: e.g. "My Local LLM". API key: **leave empty**. API URL: `http://localhost:11434/api/chat`. Model: e.g. **llama3**. Role: e.g. **Editor**.
5. Save. Select the connection in the **chat header picker** and use the floating AI button.

**Example: OpenAI**

1. Get an API key from [platform.openai.com](https://platform.openai.com) (API section — not ChatGPT Plus billing).
2. Add Connection → Provider: **OpenAI**. Enter the API key. Choose a model. Set role and approval.
3. Save.

**Editing and deleting**

- Use **Edit** to change name, model, role, sharing, or approval. Enter a new API key to rotate.
- Use **Delete** to remove a connection. Chat history is kept, but the connection disappears from the picker.

**Sharing**

- **Only me** — Only you see and can use this connection.
- **All users** — Any logged-in user can select it in the chat header.
- **Specific users** — Only selected users can use it.

## Advanced Users

**Storage and API**

- Connections are stored as JSON files in `users/` with `type: 'ai'`: provider, encrypted API key (except Ollama), model, role, shared_type, allowed_users, require_approval.
- **List:** `GET api/ai_connections.php?action=list`
- **Create:** POST `action=create` with provider, api_key, name, model, role, etc. CSRF required.
- **Update / Delete / Get / Providers:** same endpoint with `action=update|delete|get|providers`.

**Supported providers (outbound)**

- **openai** — OpenAI API; API key required.
- **anthropic** — Anthropic API; API key required.
- **google** — Gemini API.
- **openrouter** — OpenAI-compatible proxy.
- **ollama** — Local; default `http://localhost:11434/api/chat`; no API key.
- **custom** — User-supplied URL; optional API key.

MCP inbound endpoints are **not** created here — use `api/mcp_endpoints.php` and [MCP connections](mcp-connections.md).

**Encryption**

- API keys encrypted with AES-256-CBC; key material in `settings/security.json`.

**Validation**

- One connection per provider per user (per created_by) for standard providers. Multiple outbound connections of the same provider are not the default pattern.
- Custom provider requires api_url. Non-Ollama providers require a non-empty API key on create.

## Related

- [AI overview](ai-overview.md)
- [AI chat and actions](ai-chat-and-actions.md)
- [AI approvals](ai-approvals.md)
- [MCP connections](mcp-connections.md) — inbound external clients
- [Settings](settings.md)
