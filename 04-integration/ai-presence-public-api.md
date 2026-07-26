# AI Presence — public API

Read-only endpoints expose the **published** brand context on your **public site domain** (P43 hosting). Draft content is never served.

## Endpoints

| Channel | URL | Format |
|---------|-----|--------|
| Well-known file | `GET /.well-known/brand-context.json` | JSON |
| Public API | `GET /api/public/ai_presence.php?action=brand` | JSON envelope |

Both return the same canonical export with:

- `schema_version`: `ai_presence.v1`
- `published_version`: integer incremented on each publish
- `generated_at`: ISO 8601 timestamp
- Optional `json_ld` when enabled in publication settings

## Example response (API)

```json
{
  "status": "ok",
  "data": {
    "schema_version": "ai_presence.v1",
    "published_version": 3,
    "generated_at": "2026-07-26T20:00:00+00:00",
    "identity": {
      "official_name": "Acme Co",
      "short_description": "…"
    },
    "claims": [],
    "publication_settings": {
      "enabled": true,
      "public_path": "/.well-known/brand-context.json",
      "include_json_ld": true
    }
  }
}
```

## CORS

Public API uses the same origin whitelist as other Birkly public APIs (`get_registered_domains()` plus same-host dev origins).

## Caching

Responses include `Cache-Control: public, max-age=300` and `X-AI-Presence-Version`.

## Disabled publishing

When `publication_settings.enabled` is `false` or nothing has been published, endpoints return **404**.

## Headless / separate public host

Configure **public site URL** under Settings → Site delivery (P43). The well-known file is served on that domain — not only the CMS admin host.

For `public_site_mode=project`, publish also writes `project/.well-known/brand-context.json`.

## Security notes

- No authentication required (public read).
- Admin draft and suggest endpoints are separate (`/api/ai_presence.php`, authenticated).
- External evidence URL fetch in admin uses SSRF-safe validation (no private IPs).

## Rate limiting

Follows public API rate limits where applicable.
