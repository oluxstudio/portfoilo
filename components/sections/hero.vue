<template lang="pug">
div.fit-content.pb-4(class="lg:pb-14 -mt-[98px]")
    div.grid.grid-flow-col.grid-rows-3.gap-4.content-between.items-end.h-full.text-white(class="scale-[.90] lg:scale-100")
        div
        div.py-14
            h2.text-2xl.font-bold.font-holen.text-white(class="lg:text-3xl") {{ headline }}
            Typewriter(
                :words="words"
                :typing-speed="150"
                :deleting-speed="75"
                :pause-time="2000"
                class="text-5xl lg:text-8xl text-color-hero font-junegull")

            p.text-2xl.font-wonderland.text-white(class="lg:text-3xl") {{ sub }}
            button.mt-8(@click.prevent="goToContact")
                ButtonsOther901(:label="cta" href="#contact")

        div(class="flex flex-col lg:flex lg:flex-row gap-6")
          div(class="mob-tile lg:h-tile" v-for="item in _footerContent" :key="item.label")
                h4.label {{item.label}}
                div.content {{item.content}}
</template>


<script setup lang="ts">
const menuStore = useMenuStore()
const { scrollToSection } = useScrollToSection()

const { attr, collection } = useCmsContent()
const headline = attr('hero_headline', 'Let me help you with your project')
const cta = attr('hero_cta', "Let's Get Started")
const sub = attr('hero_sub', 'I make the complex simple')
const fallbackWords = ['Web Development', 'Mobile Apps', 'Digital Solutions', 'UI/UX Design', 'Branding', 'Automation']
const heroWords = attr('hero_words')
const words = computed(() => {
	const fromCms = lines(heroWords.value)
	return fromCms.length ? fromCms : fallbackWords
})

const goToContact = () => {
	menuStore.isActive('/contact')
	scrollToSection('contact')
}

// Hero tiles reuse the shared `contact-info` collection (first 3 entries).
const fallbackFooterContent = [
	{ label: 'Email', content: 'contact@oluxstudio.com' },
	{ label: 'Phone', content: '+44-78-2768-5736' },
	{ label: 'Location', content: 'Blackburn, Lancashire, UK' },
]
const contactTiles = collection('contact-info', fallbackFooterContent, d => ({
	label: String(d.label ?? ''),
	content: String(d.value ?? ''),
}))
const _footerContent = computed(() => contactTiles.value.slice(0, 3))
</script>

<style scoped lang="scss">
.fit-content{
    height: 100%;
    min-height: var(--hero-min-height);
}
</style>
