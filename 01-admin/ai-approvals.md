# AI Approvals

When an AI connection has **“Require approval for AI actions”** enabled, write actions (create entry, update entry, delete entry, etc.) are not executed immediately. Instead they are added to an **approval queue**. An admin (or any user with access to the queue) can **approve** or **reject** each request. Only approved actions are executed; rejected ones are discarded and optionally logged.

## Summary

**Approval queue** — Pending AI write actions appear in a list (under Settings → AI Connections, or in the AI chat UI). Each item shows what action the AI requested (e.g. “Create entry in blog”) and the data (collection, title, content, etc.). You can **Approve** to run the action now, or **Reject** (optionally with a reason). Approved actions are executed by the backend (create/update/delete entry, collection, media, etc.); rejected ones are marked rejected and not run. This keeps the AI from changing content without human oversight when you want it.

## Beginner

**When do I see the approval queue?**

- When you (or someone) enabled **“Require approval for AI actions”** for an AI connection, any write action from that connection goes to the queue instead of running straight away.
- You’ll see the queue in **Settings → AI Connections** (often as a section or tab like “Pending approvals” or “Approval queue”), or inside the AI chat UI if your version shows it there.

**What appears in the queue**

- Each row is one **pending action**: e.g. “Create entry in blog”, “Update entry in products”, “Delete entry …”. You may see a short description and the main data (collection, entry slug or id, field values). Opening the item (or “Details”) shows the full payload the AI requested.

**Approve**

- Click **Approve** (or “Run”) to execute the action now. The system will create the entry, update the entry, delete the entry, etc., as requested. After that, the item is removed from the pending list (or marked approved). If execution fails (e.g. collection not found), you’ll see an error; the action may stay in the queue or be marked failed depending on the UI.

**Reject**

- Click **Reject** (or “Cancel”). You may be asked for a reason (for your own notes or audit). The action is **not** executed and is marked rejected. It disappears from the “pending” list.

**Why use approvals?**

- **Safety** — Avoid the AI creating or changing content by mistake (wrong collection, wrong text).
- **Control** — Review what the AI wants to do before it affects live content.
- **Compliance** — Some teams need a human in the loop for any content change.

You can turn off “Require approval” for a connection if you want the AI’s write actions to run immediately (e.g. for a trusted local Ollama used only by you).

## Advanced Users

**API**

- **List:** `GET api/ai_approvals.php?action=list` — Optional `status` (e.g. pending, approved, rejected). Returns approvals, often sorted by created_at descending.
- **Get one:** `GET api/ai_approvals.php?action=get&id=<approval_id>`.
- **Create:** Used internally by the AI chat flow when a write action is requested and the connection has require_approval. POST with action=create, ai_user_id, action_type, action_data, description.
- **Approve:** POST with action=approve, id, _csrf. Backend loads the approval, calls `executeAiAction($approval)` (which dispatches to the right executor, e.g. executeCreateEntry, executeUpdateEntry), then updates the approval record to status approved and stores the result. CSRF required.
- **Reject:** POST with action=reject, id, optional reason, _csrf. Approval record is updated to status rejected and optional rejection_reason. CSRF required.

**Storage**

- Approval records are stored under `data/ai_approvals/` as JSON files (e.g. `approval_<id>.json`). Fields typically include: id, ai_user_id, action_type, action_data, description, status (pending | approved | rejected), created_at, reviewed_at, reviewed_by, optional result (on approve), optional rejection_reason (on reject).

**Execution**

- `executeAiAction()` in `api/ai_approvals.php` switches on action_type and calls the corresponding executor (e.g. executeCreateEntry, executeUpdateEntry, executeDeleteEntry, executeCreateCollection, …). Executors use the same logic as direct AI execution but are invoked in the approval flow with the stored action_data. The HTTP session user remains the human who approved; the AI user is passed for attribution (e.g. created_by on new entries).

**Security and audit**

- Approve/reject require authentication. Optional: restrict to users with a specific permission. All approval create/approve/reject events can be logged (e.g. ai_approval_created, ai_approval_approved, ai_approval_rejected) for audit.

## Related

- [AI overview](ai-overview.md)
- [AI connections](ai-connections.md)
- [AI chat and actions](ai-chat-and-actions.md)
- [Audit log and activity](../06-extensibility/audit-log-and-activity.md)
