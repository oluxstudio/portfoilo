<template lang="pug">
div.cta-strip.background1(v-scroll-animate="'fade'")
    div.cta-strip__inner
        div.text-white
            h2.text-3xl.font-bold.font-comforta {{ heading }}
            p.mt-2 {{ body }}
        div.flex.flex-col.gap-4.flex-wrap
            div(@click="goToContact")
                ButtonsFlip(:front="primaryLabel" back="→")
            div(@click="goToServices")
                ButtonsShadow5 {{ secondaryLabel }}
</template>

<script setup lang="ts">
const { attr } = useCmsContent()
const heading = attr('about_cta_heading', "Let's build something great together")
const body = attr('about_cta_body', "Tell us about your project and we'll get back to you within 24 hours.")
const primaryLabel = attr('about_cta_primary', 'Get in touch')
const secondaryLabel = attr('about_cta_secondary', 'See our services')

const menuStore = useMenuStore()
const { scrollToSection } = useScrollToSection()

const goToServices = () => {
	menuStore.isActive('/services')
	scrollToSection('services')
}
const goToContact = () => {
	menuStore.isActive('/contact')
	scrollToSection('contact')
}
</script>

<style scoped lang="scss">
.cta-strip {
    @apply rounded-xl border border-foreground/10 p-10;
    &__inner {
        @apply flex flex-col gap-6 items-start text-foreground;
        @apply md:flex-row md:items-center md:justify-between;
    }
}
</style>
