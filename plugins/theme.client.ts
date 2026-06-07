// Restores the persisted theme as early as possible on every client load,
// so the user's selection is used until they change it again.
export default defineNuxtPlugin(() => {
    const { initTheme } = useTheme()
    initTheme()
})
