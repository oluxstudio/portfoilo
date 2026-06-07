type ScrollTarget =
    | string              // CSS selector or element ID (e.g. '#newsletter', 'newsletter')
    | HTMLElement         // raw DOM element
    | Ref<HTMLElement | null> // Vue template ref

const getNavHeight = (): number =>
    (document.querySelector('.sticky.top-0.z-50') as HTMLElement)?.offsetHeight ?? 72

const resolveTarget = (target: ScrollTarget): HTMLElement | null => {
    if (!target) return null

    // Vue Ref
    if (typeof target === 'object' && 'value' in target) return target.value

    // Raw DOM element
    if (target instanceof HTMLElement) return target

    // String: try as-is first, then prefix with '#'
    if (typeof target === 'string') {
        return (
            document.querySelector(target) ??
            document.getElementById(target.replace(/^#/, ''))
        ) as HTMLElement | null
    }

    return null
}

export const useScrollToSection = () => {
    /**
     * Smoothly scrolls to the given target, accounting for the sticky nav height.
     *
     * @param target - A Vue ref, DOM element, CSS selector, or element ID string.
     * @param offset - Extra gap (px) below the nav. Defaults to 24.
     *
     * @example
     * scrollToSection(myRef)
     * scrollToSection('#newsletter')
     * scrollToSection('contact')
     * scrollToSection(document.getElementById('blog'))
     */
    const scrollToSection = (target: ScrollTarget, offset = 24) => {
        nextTick(() => {
            const el = resolveTarget(target)
            if (!el) return
            const top = el.getBoundingClientRect().top + window.scrollY - getNavHeight() - offset
            window.scrollTo({ top, behavior: 'smooth' })
        })
    }

    return { scrollToSection }
}
