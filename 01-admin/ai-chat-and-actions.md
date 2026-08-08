# AI Chat and Actions

The AI chat is the main way you interact with **outbound** Birkly AI: open it with the floating button, **pick a connection in the chat header**, and send messages. The AI can read your content and run actions (create entry, update entry, etc.) according to the connection's role. If the connection has "require approval" enabled, write actions are queued for you to approve before they run.

For **external** assistants (Claude Desktop), use [MCP connections](mcp-connections.md) — not this chat UI.

## Deep documentation (P5.4)

The AI receives a **context pack** on every request. For deeper topics, it can use:

- **In chat / MCP tool:** `read_birkly_docs` with topic `templating`, `admin`, `plugins`, `ai`, or `mcp`
- **MCP resources:** `birkly://docs/templating`, `birkly://docs/admin`, `birkly://docs/plugins`, `birkly://docs/ai`

See also the [templating overview](../03-templating/templating-overview.md) and [conditionals](../03-templating/conditionals.md) sections in this docs site.

## Summary

Open the **AI chat** via the **floating button** (bottom-right of the admin). Use the **connection picker in the chat header** to select which outbound provider to use (e.g. "My Local LLM" or "OpenAI"); then type your request. The AI receives context about your collections and permissions and can **read** and **write** when the connection's role allows it. Write actions either run immediately or go to the **approval queue** if "Require approval for AI actions" is on. Conversations are saved so you can continue later.

## Beginner

**Opening the chat**

- Click the **floating AI button** (bottom-right on admin pages). A chat panel opens.
- At the **top of the chat panel**, use the **connection picker** (dropdown or selector) to choose which AI connection to use. Only connections you are allowed to see appear (your own, shared, or team connections).
- If you have one connection, it may be pre-selected; change it anytime before sending a message.

**What to type**

- **Questions** — "How many entries are in the blog collection?" "What fields does the Products collection have?"
- **Requests** — "Create a new blog post with title 'Welcome'." The AI runs write actions if the role allows.
- **Follow-ups** — "Create another one" — the AI can reuse recent context.

**What happens after you send**

- The AI may reply with text only, or run **actions**.
- If **Require approval** is **off**, actions run immediately and the AI confirms.
- If **Require approval** is **on**, writes are queued; open the **approval queue** (linked from chat or **Settings → AI**).

**Connection picker tips**

- The picker shows **outbound** connections only (OpenAI, Anthropic, Ollama, etc.).
- Switching connections mid-conversation starts using the new provider and role for subsequent messages; prefer **New chat** when changing providers for a clean context.
- If the picker is empty, add a connection under **Settings → AI → Built-in assistant**.

**Conversation history**

- Conversations are saved per session. Use **New chat** for a fresh thread.

**Tips**

- Name the **collection** when creating or editing entries.
- Permission errors → check the connection **role** in **Settings → AI → Built-in assistant**.
- Stale connection after delete → picker should no longer list it; refresh if needed.

## Advanced Users

**Chat API**

- **Send message:** POST `api/ai_chat.php` with `action=chat`, `ai_connection_id`, `message`, optional `conversation_id`. CSRF required.
- Backend loads the AI user, checks access (owner or shared), builds system context, calls the provider, parses structured action blocks.
- **Read actions** execute immediately (permission-checked). **Write actions** execute or enqueue per `require_approval`.

**Connection picker (UI)**

- Implemented in the floating chat component (`admin/js/ai-chat-button.js`): loads allowed connections from `api/ai_connections.php?action=list` and binds `ai_connection_id` on each message.
- MCP inbound endpoints do not appear in this picker — they are for external clients only.

**Conversation storage**

- `data/ai_conversations/` — one file per conversation; last N messages sent as provider context.

**Action types (typical)**

- **Read:** read_entry, list_entries, list_collections, read_collection, list_media, etc.
- **Write (may require approval):** create_entry, update_entry, delete_entry, update_settings, etc.

**Permissions**

- Resolved from the connection's **role** via `getPermissionsForRole()` and enforced in `core/ai_permissions.php` at execution time.

## Related

- [AI overview](ai-overview.md)
- [AI connections](ai-connections.md)
- [MCP connections](mcp-connections.md)
- [AI approvals](ai-approvals.md)
- [Entries](../02-content/entries.md)
