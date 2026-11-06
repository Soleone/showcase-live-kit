// The browser terminal's theme picker: the @soleone ring in place of the page's dropdown. The page
// calls the default export with its themes (from themes.json) and an apply() that recolors the page,
// the terminal and the sandbox and remembers the choice. See showcase-terminal's README.
import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider, useTheme } from "@/components/soleone/theme"
import { ThemePicker } from "@/components/soleone/theme-picker"
import css from "./index.css?inline"
import { themeOptions, themeStyles } from "virtual:theme-head"

type PageTheme = { name: string }
type Skin<T extends PageTheme> = { themes: T[]; current: T; apply: (theme: T) => void; mount: HTMLElement }

// The provider changes data-theme on <html> when a card is chosen; the page follows with its own colors.
function Follow<T extends PageTheme>({ themes, current, apply }: Omit<Skin<T>, "mount">) {
  const { theme } = useTheme()
  const applied = useRef(current.name)
  useEffect(() => {
    const next = themes.find((candidate) => candidate.name === theme)
    if (!next || next.name === applied.current) return
    applied.current = next.name
    apply(next)
  }, [theme, themes, apply])
  return null
}

export default function skin<T extends PageTheme>({ themes, current, apply, mount }: Skin<T>) {
  const style = document.createElement("style")
  style.textContent = `${css}\n${themeStyles}`
  document.head.append(style)
  // Only the themes the page has colors for, in its order.
  const options = themes.flatMap((theme) => themeOptions.filter((option) => option.name === theme.name))
  createRoot(mount).render(
    // The page remembers the choice itself (browser-terminal.theme); this key is the provider's own copy.
    <ThemeProvider themes={options} storageKey="browser-terminal.picker">
      <Follow themes={themes} current={current} apply={apply} />
      <ThemePicker />
    </ThemeProvider>,
  )
}
