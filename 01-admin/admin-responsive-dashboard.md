# Admin responsive dashboard

**Phase:** P31 · **Status:** shipped on `main`

## Widget grid

The admin dashboard uses a single responsive **widget grid** (`#dashboard-widget-grid`). Every widget renders as `.card.dash-widget` and is loaded from `GET /api/dashboard.php?action=widgets`.

Breakpoints:

| Viewport | Columns |
|----------|---------|
| Desktop (>1280px) | 3 |
| Laptop (≤1280px) | 2 |
| Mobile (≤768px) | 1 |

Widget sizes: `sm`, `md`, `lg` (spans 2 columns on desktop), `full` (spans all columns).

## Widget API v2

Plugins and core register widgets with:

| Field | Purpose |
|-------|---------|
| `id` | Stable widget id |
| `title` | Card heading |
| `size` | Grid span hint (`sm` / `md` / `lg` / `full`) |
| `priority` | Sort order (lower = higher on page) |
| `mount` | JS mount handler name in `admin/js/dashboard-widgets.js` |
| `endpoint` | Optional API URL for data |
| `refresh` | Auto-refresh interval in seconds (0 = none) |
| `roles` | Allowed CMS roles |
| `plugin_id` | Plugin owner (for opt-in settings) |

**Security:** Widgets must **not** ship executable `javascript` strings. Use `mount` handlers registered on `Birkly.Dashboard.registerMount()`.

Core registry: `core/dashboard_widgets.php` (`birkly_get_core_dashboard_widgets()`).

## Core widgets

- Quick actions
- Content snapshot (collections / entries / published / drafts)
- Analytics mini
- Recent collections, entries, activity
- Drafts summary
- System health, security, updates & alerts

## Plugin widgets

Commerce, Events, Studio, and Automation register dashboard widgets when active. Commerce is **on by default** for admin (`enable_dashboard_widget` opt-out).

## Responsive shell (P31)

Breakpoint tokens live in `admin/css/core/variables.css`. Main content padding scales down at 1280px. Below xl, the sidebar collapse control shows a visual hint. Entry tables hide extra field columns on laptop widths.
