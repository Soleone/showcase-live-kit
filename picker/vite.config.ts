import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig, type Plugin } from "vite"
import { createThemeHead } from "./src/components/soleone/theme/head"
import { BUILTIN_THEMES } from "./src/components/soleone/theme/palettes"

// Every theme's tokens and options, worked out here so the palettes don't ship to the page.
function themeHead(): Plugin {
  const id = "virtual:theme-head"
  const { themeOptions, themeStyles } = createThemeHead({ themes: BUILTIN_THEMES, defaultTheme: "gilt", storageKey: "unused" })
  return {
    name: "theme-head",
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    load: (source) => (source === `\0${id}` ? `export const themeOptions = ${JSON.stringify(themeOptions)}; export const themeStyles = ${JSON.stringify(themeStyles)};` : undefined),
  }
}

// One ES module, CSS inlined, that the browser terminal page loads as its skin.js.
export default defineConfig({
  plugins: [react(), tailwindcss(), themeHead()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "../terminal",
    emptyOutDir: false,
    // Not library mode, which leaves ES output unminified.
    rolldownOptions: {
      input: "src/skin.tsx",
      preserveEntrySignatures: "exports-only",
      output: { entryFileNames: "skin.js" },
    },
  },
})
