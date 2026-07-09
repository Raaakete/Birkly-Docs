# Studio creative suite

Phase 26 adds motion, modals, design import, and multi-page funnels to Birkly Studio.

## Features

- **Animation timeline** — keyframes with scroll, click, or load triggers
- **Popup builder** — click, delay, exit intent; accessible dialogs
- **Figma import** — paste JSON to create sections and color tokens
- **Funnel stepper** — multi-page flows with linked progress UI

## Quick start

1. In Studio IDE, use the **Creative** sidebar for timeline, popups, and funnel.
2. Use the **Creative** inspector tab to quick-add animation/popup for the selected element.
3. **Publish** — compiled pages load `studio-creative-runtime.js` and `creative.css`.

See the Birkly repo: `plugins/studio/docs/creative-suite.md` for schema and API details.

## CI

`scripts/studio-creative-smoke.sh` runs in `ci-check.sh` alongside P25 `studio-smoke.sh`.
