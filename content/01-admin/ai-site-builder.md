# AI site builder

Use **Cursor**, **Claude**, or **ChatGPT** connected via MCP to build and edit your public site under `project/` — HTML, CSS, and JavaScript — alongside CMS content tools in a single prompt.

## When to use this

- You installed a starter pack (e.g. **Marsk**) and want AI to add pages, tweak templates, or wire homepage sections to new blog posts.
- You prefer editing static templates in `project/` rather than only CMS entries.
- You want one connected AI session that can both **create content** (`create_entry`) and **update templates** (`write_project_file`).

Studio (visual builder) is separate — this guide covers the canonical public site folder `project/` only.

## Prerequisites

1. **MCP connected** — see [MCP connections](mcp-connections.md).
2. **Admin role** (or a service agent with Admin) — project file writes require `manage_project_site`, which is enabled for Admin by default.
3. **Starter site optional** — fresh installs have an empty `project/`; Marsk and other starters populate it during onboarding.

## Quick setup: Site builder service agent

1. Open **Settings → AI** → **Connect your AI app**.
2. Click **Add agent** → choose **Service agent**.
3. Click the **Site builder** preset (sets Admin role and a helpful name).
4. Choose who may use the agent, then create it and copy the **Connector URL**.
5. Paste the URL in Cursor (or Claude / ChatGPT) and sign in.

**Personal connector:** sign in with your own Birkly account — you need the **Admin** role on that account to edit `project/` files.

## Available tools

| Tool | What it does |
|------|----------------|
| `get_project_info` | Paths, collections list, templating cheat sheet — **call this first** |
| `list_project_files` | List files/folders under `project/` (optional `path`) |
| `read_project_file` | Read one file by relative path |
| `write_project_file` | Create or overwrite a file |
| `create_project_file` | Create only if the path does not exist |
| `delete_project_file` | Delete a file (Admin by default) |

Content tools (`list_collections`, `create_entry`, `update_entry`, …) work in the same session.

## Sandbox rules

AI can only touch files under `project/`:

- **Allowed extensions:** `html`, `css`, `js`, `json`, `md`, `svg`, `webp`, `txt`
- **Blocked:** `..` path traversal, PHP files, dotfiles (e.g. `.htaccess`)

## Approvals

| Channel | Write behavior |
|---------|----------------|
| **MCP** (Cursor, Claude, ChatGPT) | Your AI app asks you to approve each tool call |
| **Built-in admin chat** | Birkly **Approvals** tab when **Require approval** is on |

## Example prompt (smoke test)

After Marsk onboarding, try:

> Add a new blog post titled "Morning light" with a short body, then update `index.html` to feature that post in the journal section.

The AI should:

1. `get_project_info` — learn collection slugs and template syntax
2. `read_project_file` on `index.html` — see current homepage markup
3. `create_entry` in the blog collection
4. `write_project_file` on `index.html` — link or loop the new post

## MCP resource

Clients that support MCP resources can read `birkly://project` for the same info as `get_project_info` (JSON).

## Related

- [MCP connections](mcp-connections.md) — connector setup
- [AI overview](ai-overview.md) — outbound vs inbound channels
- [Built-in assistant](ai-connections.md) — in-admin chat with approval queue
