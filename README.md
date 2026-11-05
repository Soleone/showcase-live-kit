# showcase-live-kit

The house style for Soleone's live pages: the hosted demos that [showcase](https://github.com/Soleone/showcase) grades S. showcase says what a live page needs and stays neutral about its look; this kit is the look, so every demo in the portfolio feels like the same place.

The colors come from [`@soleone/theme`](https://github.com/Soleone/shadcn-components), the themes the apps themselves use, so nothing here redefines a palette.

## What a live page looks like

- **The app, or the terminal, is the page.** A small header names it and says in a few words what is simulated (sample text, canned replies). No extra links in the header.
- **Bottom right: the way to the real app.** A download app gets `DownloadButton` ("Download the app", to its latest release). A web app that is fully live doesn't need one.
- **Bottom left: one demo control, if any.** For example tasks' "Show example tasks" switch.
- **Themes:** the visitor can switch theme, and the default is the app's own (Gilt unless the app says otherwise).

## Web and desktop apps: `@live/corners`

For apps built with shadcn. Add the registry to `components.json`:

```json
"registries": {
  "@live": "https://raw.githubusercontent.com/Soleone/showcase-live-kit/main/public/r/{name}.json"
}
```

Then `pnpm dlx shadcn@latest add @live/corners` puts it in `src/components/live/corners/`. Like the `@soleone` items, it is vendored: update it with `--overwrite`, don't edit it (`kit check` notices).

```tsx
import { Corner, DownloadButton } from "@/components/live/corners"

<Corner side="right">
  <DownloadButton href="https://github.com/you/app/releases/latest" />
</Corner>
```

## CLIs: the terminal skin

showcase's browser terminal takes a `skin`. Point `demo/browser/terminal.json` at this one:

```json
"skin": "https://raw.githubusercontent.com/Soleone/showcase-live-kit/main/terminal"
```

It brings `themes.json` (the `@soleone/theme` palettes in the terminal's shape, Gilt first) and `skin.css` (Geist around the terminal). Rebuild and redeploy the page to pick up changes.

## Changing the kit

- `registry/live/` holds the components and `registry.json` lists them. `pnpm build` regenerates `public/r/` and `terminal/themes.json` (from the published `@soleone/theme`, so new palettes there show up here). Commit both.
- Components follow the apps' rules: theme tokens only, no raw colors.
- Apps get changes when they run `shadcn add @live/<item> --overwrite`; terminal pages when they are rebuilt.
