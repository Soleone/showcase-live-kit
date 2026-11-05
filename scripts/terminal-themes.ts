// Writes terminal/themes.json, the palettes of showcase's browser terminal, from the @soleone/theme
// registry item, so the terminal pages follow the same themes as the apps.
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const ITEM = "https://raw.githubusercontent.com/Soleone/shadcn-components/main/public/r/theme.json";
const DEFAULT_THEME = "gilt";

type Palette = Record<string, string>;
type ThemeModule = { parseThemeFile(text: string): { mode: string; palette: Palette } };
type PalettesModule = {
  BUILTIN_THEMES: { name: string; label: string; toml?: string; hidden?: boolean }[];
};

const response = await fetch(ITEM);
if (!response.ok) throw new Error(`${ITEM}: ${response.status}`);
const item: { files: { path: string; content: string }[] } = await response.json();
const dir = await mkdtemp(path.join(tmpdir(), "soleone-theme-"));
for (const file of item.files) await writeFile(path.join(dir, path.basename(file.path)), file.content);

const { parseThemeFile }: ThemeModule = await import(path.join(dir, "palette.ts"));
const { BUILTIN_THEMES }: PalettesModule = await import(path.join(dir, "palettes.ts"));

const themes = BUILTIN_THEMES.filter((theme) => theme.toml && !theme.hidden)
  .map(({ name, label, toml }) => {
    const { mode, palette: p } = parseThemeFile(toml!);
    return {
      name,
      label,
      mode,
      page: p.background,
      terminal: p.dark_background,
      surface: p.lighter_background,
      line: p.selection,
      ink: p.foreground,
      inkStrong: p.bright_foreground,
      muted: p.muted_foreground,
      accent: p.accent,
      ansi: {
        red: p.red,
        green: p.green,
        yellow: p.yellow,
        blue: p.blue,
        magenta: p.magenta,
        cyan: p.cyan,
        black: p.lighter_background,
        white: p.foreground,
        brightWhite: p.bright_foreground,
        brightBlack: p.muted_foreground,
      },
    };
  })
  // The default leads, then alphabetically, as in the apps' theme picker.
  .sort((a, b) => Number(b.name === DEFAULT_THEME) - Number(a.name === DEFAULT_THEME) || a.label.localeCompare(b.label));

const out = new URL("../terminal/themes.json", import.meta.url);
await writeFile(out, `${JSON.stringify(themes)}\n`);
console.log(`Wrote ${themes.length} themes to terminal/themes.json`);
