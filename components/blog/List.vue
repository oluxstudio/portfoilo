<template lang="pug">
div.blog-list
    //- Header — logo centered
    header.blog-list__header
        a.blog-list__back(href="/")
            i.bi.bi-arrow-left
            span Back to site
        span.blog-page__logo.w-20
            HeaderLogo2
        span.blog-list__spacer

    //- Blog layout (hero cards + grid + sidebar)
    div.blog-list__body
        SectionsBlog(title="our blog")
</template>

<script setup lang="ts">
const { initTheme } = useTheme()
onMounted(() => initTheme())
</script>

<style scoped lang="scss">
.blog-list {
    min-height: 100vh;
    background-color: rgba(var(--color-fore));
    color: rgba(var(--color-fore));

    &__header {
        @apply flex justify-between items-center px-6 py-4 sticky top-0 z-50;
        grid-template-columns: 1fr auto 1fr;
        background-color: rgba(var(--color-back), 0.92);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(var(--color-fore), 0.1);
    }
    &__back {
        @apply inline-flex items-center gap-2 text-sm font-bold font-comforta uppercase tracking-wider px-4 py-2 rounded-full no-underline transition-all duration-200 justify-self-start;
        color: rgba(var(--color-primary));
        border: 2px solid rgba(var(--color-primary));
        &:hover { background-color: rgba(var(--color-primary)); color: #fff; }
        i { @apply text-base; }
    }
    &__logo {
        @apply font-junegull font-extrabold text-xl justify-self-center;
        color: rgba(var(--color-primary));
    }
    &__spacer {
        @apply justify-self-end;
    }
    &__body {
        @apply max-w-screen-xl mx-auto px-4 py-12;
    }
}
</style>
