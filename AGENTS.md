# showcase-live-kit

The house style for Soleone's live pages: a shadcn registry (`@live`) for web and desktop apps, and a skin for showcase's browser terminal. README.md is the guide agents follow; showcase points at it through `house` in `~/.config/showcase/portfolio.json`.

- Run `pnpm build` after changing `registry/` or `picker/`, or to pick up new `@soleone/theme` palettes, and commit `public/r/` and `terminal/` with the change. `picker/` has its own install (`pnpm -C picker install`). `pnpm check` fails when they are stale.
- Theme colors come from `@soleone/theme` only. Never copy palettes in here.
- Keep it to what at least two live pages use. An app's one-off stays in the app.
- No em dashes in prose.
