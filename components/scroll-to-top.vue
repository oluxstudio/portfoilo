<template lang="pug">
div.scroll-corner
    //- Theme toggle — always visible
    button.theme-toggle(:class="{ 'theme-toggle--hero': inHero }" @click="toggleTheme" :aria-label="`Switch theme (current: ${theme})`")
        i.bi(:class="themeIcon")

    //- Scroll to top — visible after 200px scroll
    Transition(name="fade-up")
        button.scroll-top(v-if="visible" @click="scrollToTop" aria-label="Scroll to top")
            //- Fill layer — grows from bottom as page scrolls
            div.scroll-top__fill(:style="{ height: progress + '%' }")
            //- Content
            div.scroll-top__content(:class="{ 'scroll-top__content--filled': progress > 60 }")
                i.bi.bi-arrow-up.scroll-top__arrow
                span.scroll-top__label TO TOP
</template>

<script setup lang="ts">
const visible   = ref(false)
const progress  = ref(0)
const inHero    = ref(true)
const { theme, toggleTheme } = useTheme()

// light → sun, dark → moon, blue → circle half
const themeIcon = computed(() => ({
    'bi-sun-fill':         theme.value === 'light',
    'bi-moon-fill':        theme.value === 'dark',
    'bi-circle-half':      theme.value === 'blue',
}))

const onScroll = () => {
    const scrolled = window.scrollY
    const total    = document.documentElement.scrollHeight - window.innerHeight

    visible.value  = scrolled > 200
    progress.value = total > 0 ? Math.round((scrolled / total) * 100) : 0
    inHero.value   = scrolled <= 20
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped lang="scss">
.scroll-corner {
    @apply fixed bottom-10 right-8 z-50 flex flex-col items-center gap-3;
}

.theme-toggle {
    @apply w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300;
    border: 2px solid rgba(var(--color-primary), 0.6);
    color: rgba(var(--color-primary));
    background: transparent;
    i { @apply text-base; }
    &:hover {
        background-color: rgba(var(--color-primary));
        color: #fff;
    }

    // In hero: white text to show over the dark video background
    &--hero {
        border-color: rgba(255, 255, 255, 0.7);
        color: #fff;
        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
            color: #fff;
        }
    }
}

.scroll-top {
    @apply relative flex flex-col items-center justify-end overflow-hidden cursor-pointer;
    width: 44px;
    height: 110px;
    flex-shrink: 0;
    border-radius: 999px;
    border: 2px solid rgba(var(--color-primary), 0.6);
    background: transparent;

    &__fill {
        @apply absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out;
        background-color: rgba(var(--color-primary));
        border-radius: 0 0 999px 999px;
    }

    &__content {
        @apply relative z-10 flex flex-col items-center gap-1 pb-3 transition-colors duration-300;
        color: rgba(var(--color-primary));

        &--filled {
            color: #fff;
        }
    }

    &__arrow {
        @apply text-base;
    }

    &__label {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg);
        @apply text-[9px] font-extrabold font-comforta tracking-widest uppercase;
        letter-spacing: 0.2em;
    }

    // When fill is high enough, flip text/icon to white for contrast
    &:hover {
        border-color: rgba(var(--color-primary));
    }
}

// ── Show/hide transition ────────────────────────────────────────────────────
.fade-up-enter-active,
.fade-up-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
    opacity: 0;
    transform: translateY(16px);
}
</style>
