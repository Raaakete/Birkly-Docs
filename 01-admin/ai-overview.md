# AI Overview

Birkly includes a built-in AI assistant that can help you create and edit content, answer questions about your collections, and perform actions in the CMS—all from a chat interface in the admin panel. You connect one or more AI providers (e.g. OpenAI, Ollama, Anthropic), and optionally require human approval before the AI’s write actions are executed.

## Summary

The **AI system** lets you chat with an AI from any admin page via a floating button. The AI has access to your Birkly context (collections, schemas, docs) and can read data, create or edit entries, manage media, and more—depending on the **role** you give each connection. You set up **AI connections** in **Settings → AI Connections** (provider, API key, model, role, sharing). You can require **approval** for write actions so they appear in a queue for you to approve or reject. Supported providers include OpenAI, Anthropic, Google (Gemini), OpenRouter, Ollama (local), custom endpoints, and MCP (Model Context Protocol).

## Beginner

**What is the Birkly AI?**

The AI is an assistant that lives inside your admin panel. You open it by clicking the **floating AI button** (usually in the bottom-right corner). You type questions or requests in natural language; the AI can look up your content, create or edit entries, and run other actions—all according to the permissions you gave it when you set up the connection.

**Where do I see it?**

- **Floating button** — On any admin page, a button (often yellow or with an AI icon) in the corner. Click it to open the chat window.
- **Settings → AI Connections** — Where you add and manage connections (which service, which model, who can use it, whether actions need approval).
- **Approval queue** — If you turned on “Require approval for AI actions,” pending actions show in a queue (in Settings → AI Connections or in the chat UI) so you can approve or reject them before they run.

**What can the AI do?**

- **Read** — List collections, list or read entries, read media, users, settings, pages, roles, plugins. The AI uses this to answer questions like “How many blog posts are there?” or “What fields does the Products collection have?”
- **Write** (if the connection’s role allows) — Create or update entries, create or update collections, upload or manage media, update settings, create or update pages, manage users/roles/plugins. You can require that these write actions go to an **approval queue** first, so nothing changes until you approve.

**Do I need to pay for an API?**

It depends on the provider. **Ollama** runs on your own machine and is free. **OpenAI, Anthropic, Google, OpenRouter** use your API keys and their pricing. You only need one connection to start; many users begin with Ollama for local, free use.

**Next steps**

- [AI connections](ai-connections.md) — How to add and configure a provider (e.g. Ollama or OpenAI).
- [AI chat and actions](ai-chat-and-actions.md) — How to use the chat and what actions the AI can run.
- [AI approvals](ai-approvals.md) — How the approval queue works and how to approve or reject actions.

## Advanced Users

**Architecture**

- **Connections** — Stored as special “AI” users in user storage. Each connection has: provider, API key (encrypted), model, role (maps to permissions), sharing (private / all / specific users), and optional “require approval” for write actions.
- **Chat** — Admin sends messages to `api/ai_chat.php`. Backend builds a system prompt from `generateSystemContext()` (collections, schemas, docs) and `buildSystemPrompt()` (permissions, action list). Conversation history is stored under `data/ai_conversations/`. The backend calls the provider (OpenAI-compatible, Anthropic, Ollama, etc.), parses the response for JSON action blocks, and either executes (if no approval) or creates an approval request.
- **Approvals** — Pending actions are stored in `data/ai_approvals/`. Admin UI calls `api/ai_approvals.php` to list, approve, or reject. On approve, `executeAiAction()` runs the action (create/update/delete entry, collection, media, settings, etc.) without switching the HTTP session to the AI user.

**Providers**

| Provider   | Type       | API key | Notes |
|-----------|------------|--------|-------|
| OpenAI    | openai     | Required | gpt-4, gpt-3.5-turbo, etc. |
| Anthropic | anthropic  | Required | Claude models |
| Google    | google     | Required | Gemini models |
| OpenRouter| openrouter| Required | Multi-model, OpenAI-compatible endpoint |
| Ollama    | ollama     | Not used | Local; default `http://localhost:11434/api/chat` |
| Custom    | custom     | Optional | User-supplied URL; OpenAI-compatible format |
| MCP       | mcp        | Not used | Model Context Protocol; no in-admin chat |

**Permissions**

- Each connection has a **role** (e.g. viewer, author, editor, admin). Role is resolved via `getPermissionsForRole()` to a flat list (read, write, manage_content, manage_media, manage_settings, manage_users, manage_plugins, etc.). The system prompt tells the model which actions it may perform; the backend enforces the same before executing or creating an approval.

**Security**

- API keys stored encrypted (AES-256-CBC) using a key in settings. MCP and Ollama do not store API keys. Access to a connection is restricted to owner, or all users, or a specific list of user IDs depending on `shared_type` and `allowed_users`.

## Related

- [AI connections](ai-connections.md)
- [AI chat and actions](ai-chat-and-actions.md)
- [AI approvals](ai-approvals.md)
- [Settings](settings.md)
- [Roles and permissions](roles-and-permissions.md)
