# Built-in assistant

The built-in assistant lets you chat with AI **inside** the Birkly admin using the floating chat button (bottom-right). You connect once with a provider API key under **Settings → AI → Built-in assistant**.

Connecting Claude, ChatGPT, or Cursor to your site content is separate — see [Connect your AI app](mcp-connections.md).

## Summary

Go to **Settings → AI → Built-in assistant** and click **Quick connect**. Choose a provider, enter your **API key**, test the connection, and save. Use the chat button in the admin to get help with content. Consumer subscriptions (ChatGPT Plus, Claude Pro) do **not** include API access — you need a developer API key.

## Quick connect

1. **Settings → AI** tab.
2. Under **Built-in assistant**, click **Quick connect**.
3. Select your **provider** (OpenAI, Anthropic, Google, OpenRouter, Ollama, or Custom).
4. Enter your **API key** (skip for Ollama).
5. Click **Test connection**, then **Connect**.

## Form fields

- **Provider** — OpenAI, Anthropic, Google, OpenRouter, Ollama, or Custom.
- **Connection name** — A label you'll recognize.
- **API key** — From your provider's developer console. Empty for Ollama.
- **API URL** — For Ollama or Custom only.
- **Model** — Optional; defaults to the provider's default.
- **Role** — Viewer, Author, Editor, or Admin.
- **Require approval** — Recommended. Pending actions appear in the chat **Approvals** tab.

## Approvals

When the assistant (or a connected AI app) wants to change content, actions wait for your approval. Open the floating chat button → **Approvals** tab to review, approve, or reject.

## Related

- [AI overview](ai-overview.md)
- [Connect your AI app](mcp-connections.md)
- [AI approvals](ai-approvals.md)
- [Settings](settings.md)
