# Admin responsive refinement (Phase 33)

## Summary

Phase 33 tightens the Birkly admin layout for laptop, tablet, and phone widths. The shell uses a single **1280px** breakpoint for the sidebar drawer, entry tables keep all columns visible with ellipsis truncation, and tabbed pages switch to scroll + **More** or a select picker at narrower widths.

## Beginner

### Breakpoints at a glance

| Width | What changes |
|-------|----------------|
| **≥ 1280px** | Persistent sidebar (or collapsed icon rail). Standard horizontal tabs. |
| **1024–1279px** | Sidebar becomes a slide-out **drawer** (hamburger in the header). Tabs scroll horizontally; overflow tabs move to a **More** menu. |
| **< 1024px** | Same drawer sidebar. Tab rows become a **select picker** — no wrapped link cloud. |

### Sidebar and navigation

- Below 1280px, open the sidebar with the menu button in the top bar. It overlays content and closes when you tap outside or navigate.
- The sidebar scrolls **with the page** — you no longer scroll nav links inside a fixed panel.
- **Trash** appears in the sidebar under Media when at least one collection exists. It opens the trashed-entries view for your first collection.

### Entry lists

Long field values truncate with an ellipsis instead of wrapping or pushing columns off-screen. Edit and delete stay visible in a sticky actions column on the right. If the table is wider than the window, only the table area scrolls horizontally — the rest of the page stays put.

### Tabs (Settings, Plugins, etc.)

On a laptop-sized window, swipe or scroll the tab row; tabs that do not fit appear under **More**. On a phone or narrow tablet, pick the section from the dropdown at the top of the tab area.

### Account page

Profile, password, 2FA, and related settings use the same **card stack** pattern as Settings. One **Save changes** button stays in the sticky bar at the top as you scroll.

### Global search

Press **Ctrl+K** (or click the search icon) to open admin search. Results are grouped by type (collections, entries), support keyboard navigation, and show localized empty states.

## Advanced Users

### Breakpoint contract

| Token | Value | Used for |
|-------|-------|----------|
| `--bp-xl` | 1280px | Drawer vs persistent sidebar; Tab v2 desktop mode |
| `--bp-lg` | 1024px | Tab v2 scroll + **More** vs select picker |

`theme.js` and `sidebar.css` both key off **1280px** (`max-width: 1279px` for drawer). Do not reintroduce 768px drawer rules.

### Sidebar scroll-with-page

`.sidebar-body` no longer sets `overflow-y: auto`. The document scrolls as one unit; the drawer is `position: fixed` below xl.

### Entry smart table (`entries-smart-table`)

| Piece | Implementation |
|-------|----------------|
| Field columns | `.fields-region` / `.fields-head-region` — `display: flex; flex: 1 1 0; min-width: 0` |
| Truncation | `text-overflow: ellipsis; white-space: nowrap` on `.cell-field` and title text |
| Horizontal scroll | `.table-viewport { overflow-x: auto }` only — page body does not scroll for wide tables |
| Sticky actions | `.cell-actions` / `.head-actions` — `position: sticky; right: 0` with overlap shadow via `.is-actions-overlapping` |

CSS: `admin/css/components/tables.css`.

### Tab v2 (`tabs-v2.js`)

Auto-initializes on `.tabs-v2-root` elements (Settings, Plugins, and other tabbed admin pages).

```html
<div class="settings-tabs tabs-v2-root">
  <nav class="tabs" role="tablist">…</nav>
</div>
```

| Mode | Class | Behavior |
|------|-------|----------|
| Desktop | `tabs-v2--desktop` | Standard `.tabs` row |
| Scroll | `tabs-v2--scroll` | Horizontal scroll + `.tabs-v2-more` overflow menu |
| Picker | `tabs-v2--picker` | `<select class="tabs-v2-picker">`; `.tabs` hidden |

Public API: `Birkly.TabsV2.init(wrap)`, `.initAll()`, `.refresh(wrap)`.

Assets: `admin/js/tabs-v2.js`, `admin/css/components/tabs-v2.css` (loaded from `layout_footer.php`).

### Account page

Template: `admin/templates/account.html`. Sections use `.card.settings-section` inside `.settings-stack`. A single `#account-save-btn` in `.main-actions-bar--sticky` submits profile changes; password and 2FA keep their own form actions inside cards.

### Trash sidebar link

`admin/partials/sidebar.php` renders the Trash nav item when `$trashCollectionSlug` is set (first collection slug). Link: `entries?collection={slug}&status=trashed`. i18n key: `admin.trash`.

### Global search

- Modal: `admin/partials/global-search-modal.php`
- Client: `admin/js/global-search.js`
- API: `GET /api/search.php?action=admin_search&q=…&limit=20`
- Grouped results, arrow-key selection, `data-i18n-*` strings on the modal for empty states

## Related

- [Admin chrome & action zones](../01-admin/admin-chrome-action-zones.md)
- [Responsive dashboard](../01-admin/admin-responsive-dashboard.md)
- [Admin appearance](../01-admin/admin-appearance.md)
- [Account](../01-admin/account.md)
- [Settings](../01-admin/settings.md)
