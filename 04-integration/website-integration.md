# Website Integration

Connect your website to Birkly so visitors see CMS-managed content. The main path is `birkly-client.js` plus the public template language.

## Summary

**In short:** (1) Add the Birkly client script (`data-cms-url` when the site is not on the CMS host). (2) Put canonical template tags in your HTML (`{title}`, `{for each entry in 'blog'}`, `{'excerpt'}`). The client fetches published content and replaces the tags. Stack choice: [Choose your stack](choose-your-stack.md). Templating deep dive: [Templating overview](../03-templating/templating-overview.md) and [Client setup](../03-templating/client-setup.md).

## Beginner

### Add the client

**External site:**

```html
<script src="https://your-cms-domain.com/birkly-client.js"
        data-cms-url="https://your-cms-domain.com"></script>
```

**Same host / project preview:**

```html
<script src="/birkly-client.js"></script>
```

### Use template tags

```html
<h1>Blog</h1>
{for each entry in 'blog' with status = published ordered by newest}
  <article>
    <h2>
      <a href="post.html?collection=blog&slug={slug}">{title}</a>
    </h2>
    {if entry has 'excerpt'}
      <p>{'excerpt'}</p>
    {endif}
    <time>{created_at format "F j, Y"}</time>
  </article>
{endfor}
```

Detail pages must **not** loop the whole collection — [Detail pages & URL context](../03-templating/detail-pages-and-url-context.md).

### Full static page example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Site</title>
</head>
<body>
  <birkly-region collection="site_elements" entry="header"></birkly-region>
  <main>
    {for each entry in 'blog' with status = published ordered by newest limit 10}
      <article>
        <h2><a href="post.html?collection=blog&slug={slug}">{title}</a></h2>
        <time>{created_at format "F j, Y"}</time>
      </article>
    {endfor}
  </main>
  <script src="https://cms.example.com/birkly-client.js"
          data-cms-url="https://cms.example.com"></script>
</body>
</html>
```

### When to use another path

- **Web components / regions** — [Web components](web-components.md), [Templating regions](../03-templating/web-components.md)
- **SPA (React / Vue)** — [SPA guide](spa-react-vue.md) (no `{for each}` in JSX)
- **SSR / bake** — [SSR and build-time](ssr-and-build-time.md)
- **Forms** — [Public forms](public-forms.md), [Public forms templating](../03-templating/public-forms-templating.md)
- **AI apps** — connect under **Settings → AI** ([MCP connections](../01-admin/mcp-connections.md)); website tools under Agent Guide → Tools ([WebMCP](webmcp-tools.md))
- **Agent Guide discovery** — when the guide is published, Birkly may inject `<link rel="alternate" type="application/json" title="Agent Guide" href="https://YOUR-SITE/.well-known/agent-guide.json">` into `project/` pages; crawlers and integrations can also use `/llms.txt` and the public API ([Agent Guide public API](agent-guide-public-api.md))

## Advanced Users

### For developers & AI

- Syntax SSOT: [Canonical syntax](../03-templating/canonical-syntax.md) + CMS `docs/TEMPLATE_LANGUAGE_SPEC.md`
- CORS: allow your site origin on the CMS for external embeds
- Install Birkly via **zip or Docker** only (Composer/npm/cPanel install channels are not documented as supported product paths)
- Cheat sheet: [Templating cheat sheet](../03-templating/cheat-sheet.md)

## Related

- [Client setup](../03-templating/client-setup.md)
- [Client library](client-library.md)
- [Choose your stack](choose-your-stack.md)
- [Public API](public-api.md)
- [Public forms](public-forms.md)
- [Worked site walkthrough](../03-templating/worked-site-walkthrough.md)
