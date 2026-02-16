# AI Connections

AI connections are the configured links between Birkly and an AI provider (OpenAI, Anthropic, Ollama, etc.). You add and manage them under **Settings → AI Connections**. Each connection has a provider, model, role, and optional approval requirement; you can share a connection with other users or keep it private.

## Summary

Go to **Settings → AI Connections** to add a connection. Choose a **provider** (OpenAI, Anthropic, Google, OpenRouter, Ollama, Custom, or MCP), enter the **API key** (not needed for Ollama or MCP), pick a **model**, set a **role** (what the AI is allowed to do), and choose who can use the connection and whether write actions **require approval**. API keys are stored encrypted. Ollama is the easiest way to start: install it locally, leave API key blank, and use the default URL.

## Beginner

**Where to add a connection**

1. In the admin sidebar, click **Settings**.
2. At the top of the Settings page, open the **AI Connections** tab.
3. Click **Add Connection** (or “+ Add Connection”).
4. Fill in the form and save.

**Form fields (typical)**

- **AI Provider** — The service: OpenAI, Anthropic (Claude), Google (Gemini), OpenRouter, Ollama (Local), Custom, or MCP.
- **Connection name** — A label for you (e.g. “My OpenAI” or “Local Ollama”).
- **API key** — Your key from the provider. **Leave empty for Ollama and MCP**; they don’t use keys.
- **API URL** — Usually only for **Ollama** or **Custom**. For Ollama the default is `http://localhost:11434/api/chat`. Change it only if Ollama runs on another machine or port.
- **Model** — Which model to use (e.g. gpt-4, llama3, claude-3-sonnet). The list depends on the provider; some allow a custom model name.
- **Role** — What the AI can do: Viewer (read only), Author, Editor, or Admin. This controls create/edit/delete for content, media, and optionally users/settings/plugins.
- **Who can use this connection** — Only me (private), All users, or Specific users (then choose which users).
- **Require approval for AI actions** — If checked, write actions (create entry, update entry, etc.) are not executed immediately; they go to an approval queue for you to approve or reject.

**Example: Ollama (local, no API key)**

1. Install Ollama on your computer (see [Ollama quick start](https://ollama.ai)).
2. In a terminal run: `ollama pull llama3` (or another model).
3. In Birkly: Settings → AI Connections → Add Connection.
4. Provider: **Ollama (Local)**. Name: e.g. “My Local LLM”. API key: **leave empty**. API URL: `http://localhost:11434/api/chat` (default). Model: e.g. **llama3**. Role: e.g. **Editor**. Set “Who can use” and “Require approval” as you like.
5. Save. The connection appears in the list; you can use it from the AI chat button.

**Example: OpenAI**

1. Get an API key from [platform.openai.com](https://platform.openai.com).
2. Add Connection → Provider: **OpenAI**. Enter the API key. Choose a model (e.g. gpt-4, gpt-3.5-turbo). Set role and approval as above.
3. Save.

**Editing and deleting**

- In the AI Connections list, use **Edit** to change name, model, role, sharing, or approval. You can update the API key by entering a new one and saving.
- Use **Delete** to remove a connection. This does not delete past conversations, but the connection will no longer be available for chat.

**Sharing**

- **Only me** — Only you see and can use this connection.
- **All users** — Any logged-in user can select it in the chat.
- **Specific users** — Only the users you select can use it. Useful when only some editors should have access to a paid API.

## Advanced Users

**Storage and API**

- Connections are stored as JSON files in the users storage (e.g. `users/`), with `type: 'ai'`. Each has a unique id (e.g. `ai_xxxxxxxx`), provider, encrypted API key (except Ollama/MCP), api_url, model, role, shared_type, allowed_users, require_approval.
- **List:** `GET api/ai_connections.php?action=list` — Returns connections the current user is allowed to see (owner, or shared_type all, or in allowed_users). API key is never returned.
- **Create:** POST `api/ai_connections.php` with `action=create`, provider, api_key, name, model, role, api_url (if needed), shared_type, allowed_users, require_approval. CSRF required.
- **Update:** POST with `action=update`, id, updates (name, role, model, status, shared_type, allowed_users, require_approval, api_key if changing).
- **Delete:** POST with `action=delete`, id. **Get:** `GET api/ai_connections.php?action=get&id=...`. **Providers list:** `GET api/ai_connections.php?action=providers`.

**Supported providers (from ai_helpers.php)**

- **openai** — `api.openai.com`, OpenAI models.
- **anthropic** — Anthropic API, Claude models.
- **google** — Gemini API.
- **openrouter** — OpenRouter; OpenAI-compatible; custom_models true.
- **ollama** — Local; default `http://localhost:11434/api/chat`; no API key; custom_models true.
- **custom** — User-supplied URL; requires_url true; optional API key.
- **mcp** — Model Context Protocol; no chat in admin; generates MCP API key and URL for external MCP clients.

**Encryption**

- API keys are encrypted with AES-256-CBC using a key stored in settings (e.g. `settings/security.json`). Decryption happens only when making outbound requests to the provider.

**Validation**

- One connection per provider per user (per created_by) except MCP, where multiple MCP connections are allowed. Custom provider requires api_url. Non-Ollama/MCP providers require a non-empty API key on create.

## Related

- [AI overview](ai-overview.md)
- [AI chat and actions](ai-chat-and-actions.md)
- [AI approvals](ai-approvals.md)
- [Settings](settings.md)
