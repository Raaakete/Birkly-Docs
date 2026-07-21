# Admin forms and navigation (P30)

## Summary

Phase 30 improves **admin navigation and forms** on laptop-width viewports: smart breadcrumb truncation in the topbar and stacked field labels across entry and collection editors.

## Breadcrumbs

When the trail is longer than the topbar allows, Birkly collapses segments **from the left** and keeps the **last two** visible — for example `… / Blog / My long entry title`.

- The `…` prefix is not a link.
- Hover the `…` or focus the breadcrumb nav to see the **full path** in a tooltip.
- `aria-label` on the breadcrumb `<nav>` includes the complete trail for screen readers.
- Truncation re-runs when you resize the window or collapse/expand the sidebar.

## Form layout

All **`.field-block`** rows in the entry and collection editors use a **label-above-control** layout at every breakpoint. Wide fieldtypes (ContentEditor, Media, Relation, and others) use the full width of the main column.

### Field validation errors

When the entry save API returns `field_errors`, the entry editor highlights the matching `.field-block` with `.field-block--error` and shows an inline message under the control. Required schema fields are validated server-side before save.

## Related

- [Entry editor](entry-editor.md)
- [Collection editor](collection-editor.md)
- [Content overview](content-overview.md)
