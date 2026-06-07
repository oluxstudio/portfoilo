// Registers the global v-scroll-animate directive.
// Usage:
//   v-scroll-animate                        → defaults to 'slide-up'
//   v-scroll-animate="'slide-left'"
//   v-scroll-animate="'slide-right'"
//   v-scroll-animate="'fade'"
//   v-scroll-animate="'zoom'"
//   :style="`--anim-delay: ${i * 80}ms`"   → stagger via CSS variable

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('scroll-animate', {
        getSSRProps() { return {} },
        mounted(el: any, binding: any) {
            const value     = binding.value
            const animation = typeof value === 'string' ? value : (value?.animation ?? 'slide-up')
            const threshold = typeof value === 'object'  ? (value?.threshold ?? 0.12) : 0.12

            el.classList.add('scroll-animate', `sa--${animation}`)

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            el.classList.add('sa--visible')
                        } else {
                            el.classList.remove('sa--visible')
                        }
                    })
                },
                { threshold }
            )

            observer.observe(el)
            el._scrollObserver = observer
        },
        unmounted(el: any) {
            el._scrollObserver?.disconnect()
            delete el._scrollObserver
        },
    })
})
