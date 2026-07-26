# Website Integration

Website integration is how you connect your website (or app) to Birkly so it can display content managed in the CMS. The main method is adding the Birkly client script and using the templating language in your HTML.

## Summary

**Connect your site to Birkly in two steps:** (1) Add one script tag that loads the Birkly client and points to your CMS URL (`data-cms-url="https://your-cms.com"`). (2) In your HTML use the template placeholders (`{ title }`, `{for each entry in 'blog'}`) where you want content. When the page loads, the client fetches content from Birkly and replaces those placeholders. No separate backend is required for a static site.

**Not sure which approach fits?** Start at **[Choose your stack](choose-your-stack.md)** — HTML + templates, web components, SPA (React/Vue), or SSR/build-time. For more control or server-side rendering, use the [Public API](public-api.md) instead of or together with the client.

## Beginner

Your **website** is what visitors see; **Birkly** is where you store and edit content. Integration is simply: “how does the website get that content?”

**The simplest way: the Birkly client**

1. **Add one line** to your page (before `</body>`):

   ```html
   <script src="https://your-cms-domain.com/birkly-client.js"
           data-cms-url="https://your-cms-domain.com"></script>
   ```

   Replace `your-cms-domain.com` with the real URL where your Birkly CMS is hosted.

2. **Use template tags** in the same HTML where you want content:

   ```html
   <h1>{ title }</h1>
   {for each entry in 'blog'}
     <article>
       <h2><a href="/blog/{ slug }">{ title }</a></h2>
       <p>{ excerpt }</p>
     </article>
   {endfor}
   ```

3. **Open the page in a browser.** The script loads, asks Birkly for the right content, and replaces the placeholders. You don’t write any API code yourself.

**Example: full static page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Site</title>
</head>
<body>
  <header>
    <h1>My Company Blog</h1>
  </header>
  <main>
    {for each entry in 'blog'}
      <article>
        <h2><a href="/blog/{ slug }">{ title }</a></h2>
        <time>{ date "F j, Y" }</time>
        <p>{ excerpt }</p>
      </article>
    {endfor}
  </main>
  <script src="https://cms.mycompany.com/birkly-client.js"
          data-cms-url="https://cms.mycompany.com"></script>
</body>
</html>
```

**Local development**

If you run Birkly on your machine (e.g. `http://localhost:8080`), use that as the base URL:

```html
<script src="http://localhost:8080/birkly-client.js"
        data-cms-url="http://localhost:8080"></script>
```

**When to use another path**

- **Web components** — one-line `<birkly-region>` for headers, footers, lists: [Web components](web-components.md).
- **SPA (React / Vue)** — fetch JSON and render with your framework: [SPA (React / Vue)](spa-react-vue.md).
- **SSR / build-time** — PHP, Astro, Next: [SSR and build-time](ssr-and-build-time.md).
- **Public API** — combine Birkly with other backends: [Public API](public-api.md).

Decision hub: [Choose your stack](choose-your-stack.md). You can also mix paths (client on marketing pages, API in an app).

**Security**

- The client only **reads** content. It does not send admin credentials from your website.
- The Birkly server must allow requests from your site’s domain (CORS). Usually the public API is read-only and safe to call from the browser.
- For **form submissions** (contact form, etc.), use the secure public submit or forms API—see [Public forms](public-forms.md)—never put admin login on the frontend.

## Advanced Users

**Integration options**

See [Choose your stack](choose-your-stack.md) for the decision table. Short version:

| Option | How it works | Best for |
|--------|--------------|----------|
| **Birkly client** | Script in HTML; fetches from public API; replaces template syntax in Light DOM | Static sites, marketing pages, simple blogs |
| **Web components** | `<birkly-region>` / `data-birkly-region` + client | Shared regions, less repeated template boilerplate |
| **Public API / SPA** | Your app calls REST/JSON; you render (no `{for}` in JSX) | React, Vue, custom UIs |
| **SSR / build-time** | Server or CI fetches API / `page_bundle.php` | SEO, PHP hosts, static generators |
| **Hybrid** | Client on some pages, API on others | Mixed stacks |

**Client flow (concise)**

1. Page loads; script runs when DOM is ready.
2. Script scans the page for Birkly template syntax (`{ … }`, `{for …}`, `{if …}`).
3. It infers which collection(s) are needed (from tags, URL, or `data-collection`).
4. Fetches from `GET /api/public/collections/{handle}/entries` (and single-entry by slug if needed).
5. Renders: replaces variables, runs loops and conditionals, formats dates and media.
6. Visitor sees final content; no full page reload for content updates.

**Collection detection**

The client typically determines what to fetch from: (1) template tags on the page (e.g. `{for each entry in 'blog'}` → blog), (2) URL path (e.g. `/blog/` → blog), or (3) `data-collection="blog"` on the script tag. See [Client library](client-library.md) for your version’s logic.

**CORS**

Birkly must send CORS headers allowing your website’s origin (e.g. `https://www.yoursite.com`). Configure allowed origins in Birkly settings or your reverse proxy. Without CORS, browser requests from your site to the CMS will be blocked.

**Server-side rendering**

Same template syntax can be rendered on the server (PHP, Node, etc.): load entries from the API or from content files, run the template engine, send HTML. Benefits: SEO, no dependency on client JS, faster first paint. Implementation is environment-specific.

## Related

- [Choose your stack](choose-your-stack.md)
- [Web components](web-components.md)
- [Client library](client-library.md)
- [Public API](public-api.md)
- [Public forms](public-forms.md)
- [Templating overview](../03-templating/templating-overview.md)
