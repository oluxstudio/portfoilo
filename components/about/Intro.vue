<template lang="pug">
div.grid.grid-cols-1.gap-12(class="lg:grid-cols-2 lg:items-center")
    div.flex.flex-col.gap-6(v-scroll-animate="'slide-right'")
        h3.text-2xl.font-bold.font-holen {{ introSubtitle }}
        h1.text-4xl.font-extrabold.font-junegull.leading-tight {{ introHeadline }}
            span.text-primary(v-if="introAccent")  {{ introAccent }}
        p.text-maintext.leading-8 {{ introBody }}
        div.w-80(@click="goToServices")
            ButtonsFlip(:front="introCta" back="→")

    div(v-scroll-animate="'slide-left'")
        CollageSlideshow(:items="collageItems", :interval="8000" :show-progress="true" progress-color="rgba(var(--color-primary), 0.8)" :progress-height="4" :overlay-opacity="0.53")
</template>

<script setup lang="ts">
// ── Asset imports (Vite resolves these at build time) ───────────────────────
import vidCode from '~/assets/videos/code.mp4'
import imgWavy from '~/assets/images/portfolio/port1.png'
import imgDesign from '~/assets/images/portfolio/port2.png'
import imgDev from '~/assets/images/portfolio/port3.png'
import imgGeometric from '~/assets/images/portfolio/port4.png'
import imgTriangle from '~/assets/images/portfolio/port15.png'
import imgBlog11 from '~/assets/images/blogs/blog11.png'
import imgPort12 from '~/assets/images/portfolio/port12.png'
import vidAbstract from '~/assets/videos/0_Abstract_Geometric_3840x2160.mp4'
import vidEthnicity from '~/assets/videos/solo.mp4'

// ── Collage slideshow items ────────────────────────────────────────────────
const fallbackCollage = [
	{ id: 10, type: 'video' as const, src: vidEthnicity, alt: 'Team at work' },
	{ id: 2, type: 'video' as const, src: vidCode, alt: 'Development in action' },
	{ id: 1, type: 'image' as const, src: imgWavy, alt: 'Studio work' },
	{ id: 3, type: 'image' as const, src: imgGeometric, alt: 'Design thinking' },
	{ id: 4, type: 'image' as const, src: imgDesign, alt: 'Design process' },
	{ id: 5, type: 'video' as const, src: vidAbstract, alt: 'Abstract motion' },
	{ id: 6, type: 'image' as const, src: imgTriangle, alt: 'Pattern design' },
	{ id: 7, type: 'image' as const, src: imgDev, alt: 'Web development' },
	{ id: 8, type: 'image' as const, src: imgBlog11, alt: 'Colour in design' },
	{ id: 9, type: 'image' as const, src: imgPort12, alt: 'Project work' },
	{ id: 11, type: 'text' as const, label: 'Our Mission', text: 'Turning bright ideas into beautiful, high-performing web experiences.' },
	{ id: 12, type: 'text' as const, label: 'Our Approach', text: 'Every pixel crafted with purpose. Every line of code built to last.' },
]

// ── CMS-driven copy via the "About Intro" page component ────────────────────
const { componentNodes, collection } = useCmsContent()
const intro = componentNodes('About Intro')
const introSubtitle = computed(() => intro.value.subtitle || 'From first sketch to final click, we help your vision come alive online.')
const introHeadline = computed(() => intro.value.headline || 'Turning Bright Ideas into')
const introAccent = computed(() => intro.value.accent || 'Beautiful Websites')
const introBody = computed(() => intro.value.body || "A modern web studio is a creative and technical partner that designs and builds high-quality, custom digital experiences. We're a small, specialised team focused on creating websites and digital products that are visually striking, high-performing, and conversion-driven.")
const introCta = computed(() => intro.value.cta || 'See our services')

// CMS collage items ({type,url,alt,label,text}) → slideshow shape ({id,type,src,...}).
const collageItems = collection('collage', fallbackCollage as any[], (d, item) => ({
	id: item.id,
	type: String(d.type ?? 'image'),
	src: d.url || undefined,
	alt: d.alt || '',
	label: d.label || undefined,
	text: d.text || undefined,
}))

// ── Navigation ─────────────────────────────────────────────────────────────
const menuStore = useMenuStore()
const { scrollToSection } = useScrollToSection()

const goToServices = () => {
	menuStore.isActive('/services')
	scrollToSection('services')
}
</script>
