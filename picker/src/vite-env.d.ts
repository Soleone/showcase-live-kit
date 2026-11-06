declare module "virtual:theme-head" {
  import type { ThemeOption } from "@/components/soleone/theme"
  export const themeOptions: ThemeOption[]
  export const themeStyles: string
}
declare module "*.css?inline" {
  const css: string
  export default css
}
