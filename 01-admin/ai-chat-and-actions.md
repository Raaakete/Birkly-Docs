# AI Chat and Actions

The AI chat is the main way you interact with the Birkly AI: you open it with the floating button, choose a connection, and send messages. The AI can read your content and run actions (create entry, update entry, etc.) according to the connection’s role. If the connection has “require approval” enabled, write actions are queued for you to approve before they run.

## Summary

Open the **AI chat** via the **floating button** (bottom-right of the admin). Select an **AI connection**; then type your request. The AI receives context about your collections and permissions and can **read** (list entries, read entry, list collections, etc.) and **write** (create/update/delete entries, collections, media, settings, etc.) when the connection’s role allows it. Write actions either run immediately or go to the **approval queue** if “Require approval for AI actions” is on. Conversations are saved so you can continue later. Use clear, concrete requests (e.g. “Create a new blog entry in the blog collection with title Hello World and content …”) for best results.

## Beginner

**Opening the chat**

- Click the **floating AI button** (often bottom-right on every admin page). A chat panel or window opens.
- If you have more than one connection, **select which one to use** (e.g. “My Local LLM” or “OpenAI”) before or at the start of the conversation.

**What to type**

- **Questions** — “How many entries are in the blog collection?” “What fields does the Products collection have?” The AI will use read actions to answer.
- **Requests** — “Create a new blog post with title ‘Welcome’ and content ‘Hello world.’” “Add an entry to the Team collection with name Alice and role Developer.” The AI will try to run the right write action (create_entry, etc.) if the connection’s role allows it.
- **Follow-ups** — “Create another one” or “Same collection, title Test” — the AI can use the last context (e.g. collection) to repeat or vary the action.

**What happens after you send**

- The AI may **reply with text only** (e.g. answering a question).
- Or it may **run one or more actions**. If “Require approval” is **off**, those actions run right away and the AI confirms (e.g. “Created blog entry with slug welcome”). If “Require approval” is **on**, the AI says something like “I’ve queued this for your approval” and the action appears in the **approval queue** (Settings → AI Connections, or in the chat UI). You then approve or reject it; only after you approve does the action run.

**Conversation history**

- Your conversation is saved. You can close the chat and open it again later; the same conversation can be continued (e.g. “New chat” starts a fresh one). History is used so the AI can understand “another one” or “same collection.”

**Tips**

- Name the **collection** (by slug or name) when you ask to create or edit entries.
- For **create entry**, include the field values you care about (title, content, etc.); the AI maps them to your schema.
- If the AI says it doesn’t have permission, check the connection’s **role** in Settings → AI Connections (e.g. try Editor instead of Viewer).
- If nothing happens on a write request, check whether **approval** is required and look at the approval queue.

## Advanced Users

**Chat API**

- **Send message:** POST `api/ai_chat.php` with `action=chat`, `ai_connection_id`, `message`, optional `conversation_id`. CSRF required. Backend loads the AI user, checks access (owner or shared), builds system context and prompt, loads conversation history (optional), calls the provider, parses response for JSON action blocks.
- **Actions in response** — The model can return a JSON block with an `actions` array. Each action has `type` (e.g. create_entry, update_entry, list_entries) and `data` (and optional `description`). Read actions are executed immediately (subject to permission checks). Write actions are either executed immediately or passed to the approval API to create a pending approval, depending on `require_approval` on the connection.
- **Conversation storage** — Under `data/ai_conversations/`; one file per conversation (e.g. `conv_<id>.json`) with messages array. Last N messages (e.g. 10) are sent as context to the provider to limit token usage.

**Action types (typical)**

- **Read (no approval):** read_entry, list_entries, list_collections, read_collection, list_media, read_media, list_users, read_user, read_settings, list_pages, read_page, list_activity, list_roles, read_role, list_plugins.
- **Write (may require approval):** create_collection, update_collection, delete_collection; create_entry, update_entry, delete_entry; upload_media, delete_media, update_media; create_media_folder, delete_media_folder, move_media; update_settings; create_page, update_page, delete_page; update_user, delete_user; create_role, update_role, delete_role; activate_plugin, deactivate_plugin. There is no create_user action; user creation is done in the admin.

**Permissions**

- Resolved from the connection’s **role** via `getPermissionsForRole()`. The system prompt is built so the model only suggests actions the role allows. The backend also checks permissions before executing or creating an approval; if the AI suggests an action the role doesn’t allow, it is rejected.

**Short follow-ups**

- Very short messages (e.g. “another one”, “more”) can be detected; the backend may reuse the last collection from conversation history and run the same action again without calling the provider, to save latency and tokens.

## Related

- [AI overview](ai-overview.md)
- [AI connections](ai-connections.md)
- [AI approvals](ai-approvals.md)
- [Entries](entries.md)
- [Collections](../02-content/collections.md)
