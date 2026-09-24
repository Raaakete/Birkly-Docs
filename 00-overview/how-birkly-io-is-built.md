# How birkly.io is built

## Summary

[birkly.io](https://birkly.io) is the public marketing site for Birkly, and it is itself a Birkly project. The CMS lives at `cms.birkly.cloud`. The pages visitors see are plain HTML, CSS, and JavaScript in the CMS **project** folder, rendered on the server. Content that changes (navigation, footer copy, blog posts, club posts, donations, translations) is stored as collections. Layout, motion, and a few bespoke interactions are custom files in that same folder — not a theme, and not a plugin.

Read this when you want a worked example of a real Birkly site, or when you are comparing Birkly with Shopify or WordPress.

> **Note:** This page describes the live site as of September 2026. It is a pattern to copy, not a theme you install. The animation stack on birkly.io is optional. A smaller site can stop at collections, one stylesheet, and `birkly-client.js`.

## Beginner

### What you are looking at

Two hosts, one product:

| Piece | Where it lives | What it does |
|-------|----------------|--------------|
| CMS | `cms.birkly.cloud` | Admin, collections, media, plugins, public API |
| Website | `birkly.io` | The project folder, served as the public site |

The project is set to **server rendering** (`render_mode: server`, short cache). Visitors get HTML with the content already filled in. The same templates still work in the browser, which is why the site also loads `birkly-client.js` from the CMS. That is the cross-origin pattern: the website and the CMS are different domains, and one script tag connects them.

There are no CMS “pages” in the admin page list. Every public URL is a file in the project folder.

### The pages

| URL | File | What it is |
|-----|------|------------|
| `/` | `index.html` | Marketing home |
| `/product.html` | `product.html` | Product story |
| `/hub.html` | `hub.html` | Live plugin catalog |
| `/roadmap.html` | `roadmap.html` | Phases and planned features |
| `/docs.html` | `docs.html` | Docs reader (loads Birkly Docs) |
| `/blog.html` | `blog.html` | Post list |
| `/blog-post.html?collection=blog&slug=…` | `blog-post.html` | One template for every post |
| `/sponsors.html` | `sponsors.html` | Sponsors, donations, partnership form |
| `/club/` | `club/*.html` | Member area |
| `/imprint.html`, `/privacy.html`, `/terms.html` | those files | Legal |
| `/thank-you.html` | `thank-you.html` | After a donation |

Shared chrome is not copied into every file as a header table. Each page contains two custom elements:

```html
<birkly-header current="Blog" home-href="index.html" cta-label="Request early access" cta-href="#early-access"></birkly-header>
<birkly-footer id="early-access" home-href="index.html"></birkly-footer>
```

`birkly-header.js` and `birkly-footer.js` fill those elements. They use normal page HTML (Light DOM), because Birkly only resolves `{…}` tags in Light DOM. A shadow-DOM component would hide the templates from the CMS.

### Content you edit in the admin

The site uses many collections. These are the ones that matter for the public site:

| Collection | Used for |
|------------|----------|
| `nav-links` | Header links (label, href, page id, sort order). English, German, and Japanese. |
| `footer-links` | Footer columns, filtered by group (`product`, `company`, `legal`). |
| `site-elements` | Footer story, waitlist copy, contact modal, footer chrome. One dynamic-content field per entry. |
| `ui-strings` | Shared button labels and switches, such as whether free club signup is on. |
| `seo-metadata`, `page-heroes` | Titles and hero lines on club pages. |
| `blog` | Posts: tag, excerpt, body, author. One `blog-post.html` serves every entry. |
| `alpha-waitlist` | Early-access form in the footer. Public submissions. |
| `contact` | Contact modal. Public submissions. |
| `partnerships` | Sponsor inquiry form. |
| `donations` | The Commerce product “Support Birkly”. |
| `supporters` | A row created when someone pays, with an optional public listing. |
| `roadmap-phases`, `roadmap-features` | Roadmap cards and vote counts. |
| `club-posts`, `club-profiles`, `club-home`, and related club collections | The member feed, profiles, deals, and wishes. |

Languages on the public site are `en`, `de`, and `ja`. The header language menu stores the choice in `localStorage` and adds `?lang=` to links. Collections that need translation have multilanguage turned on. The rest of the layout stays one HTML file.

### Plugins on this site

Three plugins are installed on the birkly.io CMS:

| Plugin | What the website uses it for |
|--------|------------------------------|
| **User Management** | Club accounts: register, sign in, sign out, member-only feed, @mentions. |
| **Commerce** | Donations. The sponsor form is a linked checkout: pay for the `donations` entry, write a `supporters` row, then open `/thank-you.html`. Stripe is the payment provider. |
| **Automation** | Background workflows (receipts, club badge updates). Visitors do not see an Automation screen. |

Events and Studio are separate Hub offers. This marketing site does not need them. The homepage Hub strip and `/hub.html` load the live catalog from `marketplace.birkly.cloud` and fall back to `hub-registry.json` in the project if that request fails.

### A rough build order

If you want a site in the same shape, do it in this order. Skip anything you do not need.

1. **Install Birkly** on a PHP host and finish the admin wizard. See [Getting started](getting-started.md).
2. **Turn on the project site** and choose server rendering if the HTML should be filled in before the browser sees it.
3. **Define collections before you write pages.** Empty schemas leave blank templates. Match field names to the names you will use in HTML.
4. **Write one HTML file per kind of page** (home, list, detail, form). Put `birkly-client.js` on each file. On a separate domain, set `data-cms-url` to the CMS origin.
5. **Share the header and footer** with `<birkly-region>` or, as birkly.io does, with one custom element that injects the same template on every page.
6. **Publish entries** for nav, footer, and the first blog post. Confirm the list links to `blog-post.html?collection=blog&slug={slug}` and that the detail file does not loop the whole collection.
7. **Add a public collection** only when visitors should submit something (`alpha-waitlist`, `contact`). Point the form at the public submit API and use the same field names as the schema.
8. **Install a plugin only when the content model needs it.** A blog does not need Commerce. A donation form does. A member feed needs User Management.
9. **Put design in your own CSS.** birkly.io uses `home.css`, `birkly-subpage.css`, `product.css`, and `css/club.css`. Those files are the site’s design system. They are not part of the CMS.

> **Tip:** The six reference projects that ship with the CMS (blog, portfolio, yoga, coffee, social, influencer) are the smaller version of this pattern. Start there if birkly.io’s motion and club app are more than you need. See [Reference projects](../03-templating/reference-projects.md).

### Compared with Shopify and WordPress

Birkly, Shopify, and WordPress all let you publish a site and take payments. They charge for different things, and they put the design in different places.

**Cost (public list prices, September 2026).** Shopify’s US self-serve plans, from [shopify.com/pricing](https://www.shopify.com/pricing), are Basic at $29/month billed yearly ($39 month-to-month), Grow at $79/year-billed ($105 month-to-month), and Advanced at $299/year-billed ($399 month-to-month). Plus starts around $2,300/month. Card processing is extra. If you do not use Shopify Payments, Shopify also charges a third-party transaction fee (2% on Basic, 1% on Grow, 0.6% on Advanced). Apps and themes are extra again.

WordPress.org software is free. You pay for hosting, and usually for a few plugins or a page builder. WordPress.com sells hosting plans that limit plugins and themes until you pay for a higher tier. WooCommerce itself is free; payment, shipping, and subscription extensions often are not.

Birkly’s core is free and is planned to be fully open source at 1.0 (the site is in closed alpha until then). You pay for a PHP host. There is no per-seat CMS fee and no percentage of revenue taken by the CMS. Official plugins are optional Hub offers. In the project’s offline catalog snapshot (`hub-registry.json`, 14 August 2026), Automation, User Management, Events, and Studio are free, and Commerce is a subscription with a launch price of €29.90/month. The live Hub is the source of truth for current prices. Stripe (or another provider) still charges its own card fees. Email, if you send any, is also yours to pay for.

**Plugins.** Shopify apps run inside Shopify and often add a monthly fee on top of the plan. WordPress plugins are powerful and numerous, and they are also the usual source of conflicts, abandoned updates, and security patches. Birkly keeps the core small. Commerce, users, events, automation, and the visual builder are plugins you install from the Hub when a site needs them. birkly.io runs three. A brochure site can run zero.

**Freedom.** Shopify themes are Liquid inside Shopify’s hosting. Leaving means exporting what Shopify allows you to export. WordPress is closer to “you own the server,” but a typical site is a theme plus a page builder plus a stack of plugins, and the content sits in a database. On birkly.io the design is ordinary HTML, CSS, and JavaScript in the project folder. Content is JSON files. You can copy the folder, put it in Git (the admin can pull and push the project), and host it anywhere PHP runs. The same templates work if you only drop `birkly-client.js` onto a site you already have.

**Flexibility.** Shopify is the fastest path to a catalog, checkout, and apps, and the slowest path to a layout Shopify did not anticipate. WordPress can become almost anything, at the cost of maintaining that anything. Birkly’s bet is three primitives — collections, entries, and templates — plus plugins for the parts that are not content (cart, accounts, workflows). The homepage on birkly.io shows six shapes (portfolio, blog, docs, shop, events, social feed) as arrangements of those primitives, not as six products.

**What you give up.** Birkly does not ship a theme store or a visual theme customizer on the core. The template language is small on purpose: there is no “truncate” filter, and a loop inside a loop over a textarea is not how the engine works. birkly.io fills those gaps with a few lines of project JavaScript (chip lists, vote counts, the docs search). You also operate the server. Shopify operates Shopify.

## Advanced Users

### How a request is assembled

`settings/project.json` on the live site:

```json
{
  "render_mode": "server",
  "hosting_type": "birkly",
  "ssr_cache_ttl": 120
}
```

Server rendering expands `{for each}`, `{from … get entry}`, and `{if}` before the response is cached for two minutes. The client script still runs, so language switches, forms, and member-only blocks can update after load. Pages that are mostly fixed marketing copy (home, product) keep a lot of the layout as authored HTML. Pages that must follow the CMS (club, header, footer) keep live template tags.

The client tag on marketing pages points at the CMS explicitly:

```html
<script src="https://cms.birkly.cloud/birkly-client.js" data-cms-url="https://cms.birkly.cloud" data-tracking-id="birkly.io"></script>
```

Each rendered page also receives Agent Guide links (`/.well-known/agent-guide.json`, `llms.txt`) and a WebMCP config. Commerce adds `webmcp-pack.js` so an agent can read the cart. That injection is platform behavior, not a file you maintain in the project.

### Custom files in the project folder

These are the pieces that are specific to birkly.io. None of them are required to run Birkly.

| File | Job |
|------|-----|
| `birkly-header.js` | `<birkly-header>`. Injects a nav loop over `nav-links`, then calls `Birkly.processTemplates`. If server rendering already embedded `#birkly-nav-links-ssr`, it paints that JSON first so the nav does not flash empty. Includes the language `<select>`. |
| `birkly-footer.js` | `<birkly-footer>`. Footer story and waitlist copy from `site-elements`, link columns from `footer-links`, early-access form posting to `alpha-waitlist`, contact modal posting to `contact`. Watches the form status node and swaps in a thank-you panel. |
| `birkly-boot.js` | Sets `<html lang>` from `?lang=` or `localStorage`. Rewrites internal links so the language survives navigation. Loads scribble and nav modules. Drops a transition veil, waits for fonts and `birkly:templates-processed`, then starts motion. |
| `birkly-fx.js`, `birkly-scribble.js`, `birkly-nav.js`, `birkly-home.js` | Scroll and hero motion. GSAP and ScrollTrigger load from jsDelivr (copies also sit in `vendor/`). This is a design dependency of the marketing site, not a CMS runtime dependency. |
| `home.css`, `home-sections.css`, `birkly-subpage.css`, `product.css`, `sponsors.css`, `css/club*.css`, `self-hosted-fonts.css` | The visual system: paper background, serif display type, mono labels, mint accent. Fonts are self-hosted. |
| `hub.js` | Fetches `https://marketplace.birkly.cloud/api/v1/registry`, filters the grid, falls back to `hub-registry.json`. The homepage mosaic uses the same registry in an inline script. |
| `docs-loader.js` | Docs shell. Builds the sidebar from `manifest.json`, fetches topic HTML from `/docs` and falls back to `docs.birkly.cloud`, sanitizes the fragment, and searches `help-manifest.json`. |
| `js/roadmap-votes.js`, `roadmap-filters.js` | Category filters are CSS radios. Vote counts are read from the public entries API (`likes_count` on `roadmap-features`). Voting itself happens in the club, not on the public page. |
| `js/club-mentions.js` | `@` autocomplete against User Management’s member list. |
| `js/club-page.js` | Older session helper for guest versus member blocks. Newer club templates use `{if user_logged_in}` and `data-birkly-auth` instead. |
| `club/*.html` | Feed, post, members, notifications, settings, login, register. Registration posts to the user signup route with `flow_id=club_free_register`, and only when the `ui-strings` flag `club.free_registration_enabled` is `1`. Otherwise the page sends people to donate. |
| `sponsors.html` | `data-commerce-linked-checkout` form: product collection `donations`, entry `support-birkly`, linked collection `supporters`, consent field `featured`, success URL `/thank-you.html`. One-time versus monthly toggles the purchase option. A second form posts partnerships to the public submit API. |

`fieldtype-test.html` and `uploads/` are internal leftovers. They are not part of the public information architecture.

### Patterns worth copying, and the workarounds next to them

**Header and footer as one component, templates inside.** The component sets `innerHTML` once, on connect, to a string that still contains `{from 'nav-links'…}`. It then calls `Birkly.processTemplates({ root, force: true })`. Do not put the same markup in a shadow root.

**One detail template.** `blog-post.html` sets `<meta name="birkly-collection" content="blog">`. List cards link to `blog-post.html?collection=blog&slug={slug}`. A small script copies the rendered title and excerpt into `<title>` and Open Graph tags. Crawlers that do not run JavaScript still see the server-rendered body; the script is a client improvement on top.

**Public forms without a custom fetch.** Waitlist, contact, partnerships, and club posts use `data-birkly-url="/api/public_submit.php"` plus `<input type="hidden" name="collection" value="…">`. Field `name` attributes match the schema (`email`, `role`, `use_case` on the waitlist). The footer’s thank-you state listens for the client’s success class. It does not replace the platform submit handler.

**Commerce without a cart page.** Donations are a linked checkout, not a product grid. The form names the product entry and the collection that should receive the payer. Signup flow id `pay_then_activate` connects a payment to a club account. Receipt email is Commerce plus Automation, not a custom mailer in the project.

**Flags as content.** Whether free registration is open is a `ui-strings` entry, not a code deploy. The register page loops that entry twice, once for value `1` and once for value `0`, and shows one of the two blocks.

**Where the template language stopped, and JavaScript took over.** Nested loops over a newline field are awkward, so role bullets and “shape” chips are `data-role-bullets` and `data-shape-chips` attributes rendered by a few lines of script. A second `{from}` nested inside the hero block was dropping its text, so a translated label is copied from a hidden element with `data-i18n-copy`. These are local fixes. Prefer a real field or a real loop when the content model can express it.

**Docs are another site.** `docs.html` is a reader. The articles live in the Birkly Docs repo and are published to `docs.birkly.cloud`, with a copy under the project `docs/` folder for same-origin loads. Do not model a documentation tree as one giant HTML file.

### What “no dependencies” means here

The CMS runtime has no Composer or npm packages. The marketing site still chooses to load GSAP from a CDN for scroll effects. That choice sits in the project HTML. Remove those script tags and the pages still render; the motion stops. Hosting, Stripe, and transactional email are outside the CMS as well. The point of the architecture is that those choices stay visible in the project folder instead of being hidden inside a theme or an app you cannot read.

## Related

- [What is Birkly](what-is-birkly.md)
- [Getting started](getting-started.md)
- [Reference projects](../03-templating/reference-projects.md)
- [Project sites and plugins](../03-templating/project-sites-and-plugins.md)
- [Client setup](../03-templating/client-setup.md)
- [Public forms](../03-templating/public-forms-templating.md)
- [Commerce plugin](../06-extensibility/plugins/commerce.md)
- [User plugin](../06-extensibility/user-plugin.md)
- [Self-host install](../07-operations/self-host-install.md)
