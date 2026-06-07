export type Theme = 'light' | 'dark' | 'blue'

const THEMES: Theme[] = ['light', 'dark', 'blue']

export const useTheme = () => {
    // Cookie is readable during SSR, so the correct theme class is in the
    // first byte of HTML (applied on the root <div> in app.vue) — no flash.
    // Empty cookie → default 'light'.
    const theme = useCookie<Theme>('theme', {
        default: () => 'light',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
        path: '/',
    })

    const setTheme = (t: Theme) => {
        if (THEMES.includes(t)) theme.value = t
    }

    const toggleTheme = () => {
        const idx = THEMES.indexOf(theme.value)
        setTheme(THEMES[(idx + 1) % THEMES.length])
    }

    // No-op kept for backwards compatibility with existing callers.
    const initTheme = () => {}

    return { theme, setTheme, toggleTheme, initTheme, THEMES }
}
