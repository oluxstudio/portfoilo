<template lang="pug">
div.mmenu-root(class="lg:hidden")
    //- Backdrop
    Transition(name="fade")
        div.mmenu-backdrop(v-if="menuStore.menuMode" @click="close")

    //- Drawer
    Transition(name="slide")
        aside.mmenu(v-if="menuStore.menuMode")
                //- Decorative curve
                div.mmenu__deco

                //- Header: close + logo
                div.mmenu__head
                    button.mmenu__close(@click="close" aria-label="Close menu")
                        i.bi.bi-x-lg
                    div.mmenu__logo
                        HeaderLogo

                //- Nav items
                nav.mmenu__nav
                    a.mmenu__link(
                        v-for="(item, i) in menuStore.menu"
                        :key="item.path"
                        :href="item.path"
                        :class="{ 'mmenu__link--active': item.active }"
                        :style="`--i: ${i}`"
                        @click.prevent="go(item.path)"
                    ) {{ item.label }}

                //- Divider + secondary links
                div.mmenu__divider
                div.mmenu__sub
                    a.mmenu__sub-link(href="#contact" @click.prevent="go('/contact')")
                        i.bi.bi-headset
                        span Customer Support
                    a.mmenu__sub-link(href="#services" @click.prevent="go('/services')")
                        i.bi.bi-rocket-takeoff
                        span Get Started
</template>

<script setup lang="ts">
const menuStore = useMenuStore()

const close = () => { menuStore.menuMode = false }

const go = (path: string) => {
	menuStore.isActive(path)
	menuStore.loadPage(path)
	close()
}
</script>

<style scoped lang="scss">
// ── Backdrop ────────────────────────────────────────────────────────────────
.mmenu-backdrop {
    @apply fixed inset-0 z-[90];
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
}

// ── Drawer ──────────────────────────────────────────────────────────────────
.mmenu {
    @apply fixed top-0 left-0 bottom-0 z-[91] flex flex-col overflow-hidden;
    width: min(86vw, 360px);
    background-color: rgba(var(--color-fore));
    box-shadow: 8px 0 40px rgba(0, 0, 0, 0.25);

    &__deco {
        @apply absolute pointer-events-none;
        left: -55%;
        top: 18%;
        width: 90%;
        height: 55%;
        border-radius: 50%;
        background: radial-gradient(circle at 70% 50%,
            rgba(var(--color-primary), 0.85),
            rgba(var(--color-tertiary), 0.4) 60%,
            transparent 72%);
        filter: blur(2px);
    }

    &__head {
        @apply relative flex justify-between items-center gap-4 px-6 pt-7 pb-2 z-10;
    }
    &__close {
        @apply w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200;
        border: 2px solid rgba(var(--color-text), 0.25);
        color: rgba(var(--color-text));
        &:hover {
            background-color: rgba(var(--color-primary));
            border-color: rgba(var(--color-primary));
            color: #fff;
        }
    }
    &__logo {
        @apply flex items-center;
    }

    // ── Nav ──────────────────────────────────────────────────────────────
    &__nav {
        @apply relative flex flex-col gap-1 px-6 mt-auto z-10;
    }
    &__link {
        @apply font-junegull font-extrabold no-underline leading-tight py-1;
        font-size: clamp(2rem, 9vw, 2.75rem);
        color: rgba(var(--color-text));
        transition: color 0.2s, transform 0.2s;
        &:hover, &--active {
            color: rgba(var(--color-primary));
            transform: translateX(6px);
        }
    }

    &__divider {
        @apply mx-6 my-5 z-10 relative;
        height: 2px;
        width: 60px;
        background-color: rgba(var(--color-primary));
    }

    // ── Sub links ─────────────────────────────────────────────────────────
    &__sub {
        @apply relative flex flex-col gap-3 px-6 pb-8 z-10;
    }
    &__sub-link {
        @apply flex items-center gap-3 no-underline text-sm font-bold font-comforta uppercase tracking-wider;
        color: rgba(var(--color-text), 0.7);
        transition: color 0.2s;
        i { color: rgba(var(--color-primary)); @apply text-base; }
        &:hover { color: rgba(var(--color-primary)); }
    }
}

// ── Transitions ─────────────────────────────────────────────────────────────
.slide-enter-active { transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-leave-active { transition: transform 0.3s cubic-bezier(0.7, 0, 0.84, 0); }
.slide-enter-from,
.slide-leave-to { transform: translateX(-100%); }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
