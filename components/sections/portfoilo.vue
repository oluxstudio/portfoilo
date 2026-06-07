<template lang="pug">
div
    div.page-label
        h3.subtitle {{ props.title }}
        h2.header Portfolio

    //- Intro
    div.mt-20.text-center.max-w-2xl.mx-auto(v-scroll-animate="'fade'")
        p.text-lg.text-foreground/70.leading-8 A selection of projects we're proud of — from landing pages to full web applications. Each one built with purpose, precision, and care.

    //- Filter buttons
    div.filter-row.mt-10(v-scroll-animate="'slide-up'")
        button.filter-btn(
            v-for="cat in categories"
            :key="cat"
            :class="{ 'filter-btn--active': selectedCat === cat }"
            @click="selectedCat = cat"
        ) {{ cat }}

    //- Grid / Detail panel
    div(ref="panelRef")
    Transition(name="panel-swap" mode="out-in")
        //- Grid
        div.portfolio-grid.mt-8(v-if="!activeItem" key="grid")
            div.portfolio-item(
                v-for="(item, i) in filteredItems"
                :key="item.id"
                v-scroll-animate="'zoom'"
                :style="`--anim-delay: ${(i % 4) * 70}ms`"
                @click="openItem(item)"
                role="button"
                tabindex="0"
                @keydown.enter="openItem(item)"
            )
                img(
                    :src="item.images[0]"
                    :alt="item.title"
                    loading="lazy"
                    decoding="async"
                )
                div.portfolio-item__overlay
                    div.portfolio-item__info
                        span.portfolio-item__cat {{ item.category }}
                        h3.portfolio-item__title {{ item.title }}
                        i.bi.bi-arrow-up-right.portfolio-item__icon

        //- Detail card
        div.portfolio-detail.mt-8(v-else :key="activeItem.id")
            button.portfolio-detail__back(@click="closeItem")
                i.bi.bi-arrow-left
                span Back to Portfolio

            div.portfolio-detail__card
                //- Slideshow
                div.portfolio-detail__slideshow
                    div.portfolio-detail__slide-track
                        Transition(:name="slideDir === 'next' ? 'slide-next' : 'slide-prev'" mode="out-in")
                            img.portfolio-detail__slide-img(
                                :key="slideIndex"
                                :src="activeItem.images[slideIndex]"
                                :alt="`${activeItem.title} ${slideIndex + 1}`"
                                loading="lazy"
                                decoding="async"
                            )
                    div.portfolio-detail__slide-controls(v-if="activeItem.images.length > 1")
                        button.portfolio-detail__slide-arrow(@click="slidePrev")
                            i.bi.bi-chevron-left
                        div.portfolio-detail__slide-dots
                            button.portfolio-detail__slide-dot(
                                v-for="(_, i) in activeItem.images"
                                :key="i"
                                :class="{ 'portfolio-detail__slide-dot--active': i === slideIndex }"
                                @click="goSlide(i)"
                            )
                        button.portfolio-detail__slide-arrow(@click="slideNext")
                            i.bi.bi-chevron-right

                //- Info
                div.portfolio-detail__info
                    div.portfolio-detail__meta
                        span.portfolio-detail__cat {{ activeItem.category }}
                        span.portfolio-detail__year {{ activeItem.year }}
                    h2.portfolio-detail__title {{ activeItem.title }}
                    p.portfolio-detail__desc {{ activeItem.description }}
                    div.portfolio-detail__tags
                        span.portfolio-detail__tag(v-for="tech in activeItem.tech" :key="tech") {{ tech }}
                    div.portfolio-detail__actions
                        a(v-if="activeItem.url" :href="activeItem.url" target="_blank" rel="noopener")
                            button.portfolio-detail__cta
                                i.bi.bi-box-arrow-up-right
                                span  View Live Site
                        a(href="#contact" @click="closeItem")
                            //- button.portfolio-detail__cta.portfolio-detail__cta--outline Start a similar project
                            ButtonsFlipV2.text-sm(front="Start a similar project" back="Let's Talk")
</template>

<script setup lang="ts">
const props = defineProps({ title: { type: String, required: true } })
const { scrollToSection } = useScrollToSection()

const categories = ['All Work', 'Web Design', 'E-Commerce', 'Branding', 'UI/UX', 'Development']
const selectedCat = ref('All Work')
const activeItem = ref<PortfolioItem | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const slideIndex = ref(0)
const slideDir = ref<'next' | 'prev'>('next')

interface PortfolioItem {
	id: number
	images: string[]
	title: string
	category: string
	description: string
	tech: string[]
	year: string
	url?: string
}

const items: PortfolioItem[] = [
	{
		id: 1,
		images: ['/images/portfolio/port1.png', '/images/portfolio/port2.png', '/images/portfolio/port3.png'],
		title: 'Nexus Studio', category: 'Web Design', year: '2024',
		description: 'A full brand and web presence for a creative studio. Bold typographic-led design with strong motion principles. Nuxt-powered with custom scroll animations, a project case study system, and a dark/light theme toggle.',
		tech: ['Nuxt 3', 'Tailwind CSS', 'GSAP', 'Sanity CMS'],
		url: '#',
	},
	{
		id: 2,
		images: ['/images/portfolio/port4.png', '/images/portfolio/port6.webp', '/images/portfolio/port7.png'],
		title: 'Bloom E-Shop', category: 'E-Commerce', year: '2024',
		description: 'A premium floral e-commerce store for a UK-based florist. Custom product builder, real-time stock management, and seamless Stripe checkout with delivery slot selection.',
		tech: ['Nuxt 3', 'Stripe', 'Pinia', 'Tailwind CSS'],
		url: '#',
	},
	{
		id: 3,
		images: ['/images/portfolio/port8.png', '/images/portfolio/port9.webp', '/images/portfolio/port10.webp'],
		title: 'Forma Brand Identity', category: 'Branding', year: '2023',
		description: 'Complete brand identity system for a B2B SaaS startup — logo, colour system, typography hierarchy, icon library, and full brand guidelines document.',
		tech: ['Figma', 'Illustrator', 'Brand Guidelines'],
	},
	{
		id: 4,
		images: ['/images/portfolio/port11.webp', '/images/portfolio/port12.png', '/images/portfolio/port13.webp'],
		title: 'Flux Dashboard', category: 'UI/UX', year: '2024',
		description: 'Data analytics dashboard UI for an internal ops team. Custom charts, filterable tables, and a collapsible sidebar — designed in Figma with a full component handoff.',
		tech: ['Figma', 'Prototyping', 'Design System'],
	},
	{
		id: 5,
		images: ['/images/portfolio/port14.webp', '/images/portfolio/port15.png', '/images/portfolio/port16.webp'],
		title: 'Apex Consulting', category: 'Web Design', year: '2023',
		description: 'Corporate website for a Manchester consulting firm — case study pages, team profiles, and a custom enquiry system. SEO-optimised with a 98 Lighthouse score.',
		tech: ['Nuxt 3', 'Contentful', 'Tailwind CSS', 'TypeScript'],
		url: '#',
	},
	{
		id: 6,
		images: ['/images/portfolio/port17.webp', '/images/portfolio/port18.png', '/images/portfolio/port19.png'],
		title: 'NorthBay Goods', category: 'E-Commerce', year: '2024',
		description: 'High-volume outdoor goods platform with thousands of SKUs — headless Shopify backend, custom Vue storefront, faceted search, and a loyalty rewards programme.',
		tech: ['Nuxt 3', 'Shopify Headless', 'Algolia', 'Vue'],
		url: '#',
	},
	{
		id: 7,
		images: ['/images/portfolio/port20.webp', '/images/portfolio/port21.webp', '/images/portfolio/port22.png'],
		title: 'Slate CMS Platform', category: 'Development', year: '2023',
		description: 'Bespoke CMS for a media group with multiple publication brands — multi-tenant, role-based access, visual page builder, and a REST API powering their mobile app.',
		tech: ['Node.js', 'Vue 3', 'PostgreSQL', 'REST API'],
	},
	{
		id: 8,
		images: ['/images/portfolio/port1.png', '/images/portfolio/port4.png', '/images/portfolio/port8.png'],
		title: 'Halo Identity', category: 'Branding', year: '2024',
		description: 'Rebranding for a wellness startup — soft gradients, approachable typography, and a visual language centred on calm and clarity. Delivered as a full Figma design system.',
		tech: ['Figma', 'Illustrator', 'Motion Design'],
	},
	{
		id: 9,
		images: ['/images/portfolio/port9.webp', '/images/portfolio/port12.png', '/images/portfolio/port15.png'],
		title: 'Velo Ride App', category: 'UI/UX', year: '2023',
		description: 'Mobile UI for a cycling route planning app — full user flow from onboarding to route creation, segment tracking, and social sharing with high-fidelity prototypes.',
		tech: ['Figma', 'Prototyping', 'Mobile UI', 'User Testing'],
	},
	{
		id: 10,
		images: ['/images/portfolio/port13.webp', '/images/portfolio/port16.webp', '/images/portfolio/port19.png'],
		title: 'Pulse Landing Page', category: 'Web Design', year: '2024',
		description: 'High-converting SaaS landing page for a B2B email automation tool. A/B tested hero variants, animated feature sections, and Calendly integration — 34% improvement in sign-ups.',
		tech: ['Nuxt 3', 'Tailwind CSS', 'Calendly API'],
		url: '#',
	},
	{
		id: 11,
		images: ['/images/portfolio/port7.png', '/images/portfolio/port10.webp', '/images/portfolio/port22.png'],
		title: 'Grid Design System', category: 'UI/UX', year: '2024',
		description: '200+ component design system for a fintech company — dark/light modes, accessibility-first patterns, and a Storybook-integrated documentation site across 5 product squads.',
		tech: ['Figma', 'Storybook', 'Vue 3', 'WCAG 2.1'],
	},
	{
		id: 12,
		images: ['/images/portfolio/port2.png', '/images/portfolio/port6.webp', '/images/portfolio/port11.webp'],
		title: 'Forte Digital', category: 'Development', year: '2023',
		description: 'Web app for a digital agency — project management, deliverable tracking, automated invoicing, PDF export, and a client-facing read-only portal.',
		tech: ['Nuxt 3', 'Supabase', 'TypeScript', 'PDFKit'],
		url: '#',
	},
]

const filteredItems = computed(() =>
	selectedCat.value === 'All Work' ? items : items.filter(i => i.category === selectedCat.value),
)

const openItem = (item: PortfolioItem) => {
	activeItem.value = item
	slideIndex.value = 0
	slideDir.value = 'next'
	scrollToSection(panelRef)
}

const closeItem = () => {
	activeItem.value = null
	scrollToSection(panelRef)
}

const slideNext = () => {
	if (!activeItem.value) return
	slideDir.value = 'next'
	slideIndex.value = (slideIndex.value + 1) % activeItem.value.images.length
}
const slidePrev = () => {
	if (!activeItem.value) return
	slideDir.value = 'prev'
	slideIndex.value = (slideIndex.value - 1 + activeItem.value.images.length) % activeItem.value.images.length
}
const goSlide = (i: number) => {
	slideDir.value = i > slideIndex.value ? 'next' : 'prev'
	slideIndex.value = i
}
</script>

<style scoped lang="scss">
// ── Filter row ─────────────────────────────────────────────────────────────
.filter-row {
    @apply flex flex-wrap justify-center gap-3;
}
.filter-btn {
    @apply px-5 py-2 rounded-full border border-foreground/80 text-maintext font-bold font-comforta text-sm tracking-wide transition-all duration-200;
    &:hover { @apply border-primary text-primary; }
    &--active {
        @apply bg-primary text-white border-primary;
        &:hover { @apply opacity-90 text-white; }
    }
}

// ── Portfolio grid ─────────────────────────────────────────────────────────
.portfolio-grid {
    @apply grid gap-3;
    grid-template-columns: repeat(4, 1fr);
    @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 640px)  { grid-template-columns: repeat(1, 1fr); }
}

.portfolio-item {
    @apply relative overflow-hidden cursor-pointer border-2 border-primary/60 rounded-lg;
    aspect-ratio: 4 / 3;

    img {
        @apply absolute inset-0 w-full h-full object-cover transition-transform duration-500;
    }
    &:hover img { transform: scale(1.06); }

    &__overlay {
        @apply absolute inset-0 flex items-end p-5 opacity-0 transition-opacity duration-300;
        background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 60%, transparent 100%);
    }
    &:hover &__overlay { @apply opacity-100; }

    &__info { @apply flex flex-col gap-1 w-full; }
    &__cat { @apply text-xs font-bold font-comforta uppercase tracking-widest text-primary; }
    &__title { @apply text-white font-extrabold font-junegull text-lg leading-tight; }
    &__icon { @apply text-white text-xl mt-1 self-end; }
}

// ── Detail card ────────────────────────────────────────────────────────────
.portfolio-detail {
    &__back {
        @apply inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full border-2 border-primary text-primary font-bold font-comforta text-sm uppercase tracking-wider transition-all duration-200;
        &:hover { @apply bg-primary text-white; }
        i { @apply text-base; }
    }

    &__card {
        @apply grid grid-cols-1 gap-10;
        @apply lg:grid-cols-2 lg:gap-14 lg:items-start;
    }

    &__info {
        @apply flex flex-col gap-5;
    }
    &__meta {
        @apply flex items-center gap-3;
    }
    &__cat {
        @apply text-xs font-bold font-comforta uppercase tracking-widest text-primary px-3 py-1 rounded-full border border-primary/30 bg-primary/10;
    }
    &__year {
        @apply text-xs font-comforta text-foreground/40 font-bold;
    }
    &__title {
        @apply text-3xl font-extrabold font-junegull text-maintext leading-tight;
        @apply md:text-4xl;
    }
    &__desc {
        @apply text-maintext leading-7 text-base;
    }
    &__tags {
        @apply flex flex-wrap gap-2;
    }
    &__tag {
        @apply text-xs font-bold font-comforta px-3 py-1 rounded-full border border-primary/90 text-maintext bg-foreground/5;
    }
    &__actions {
        @apply flex flex-wrap gap-3 mt-2;
    }
    &__cta {
        @apply flex items-center gap-2 px-6 py-3 rounded-xl bg-primary font-bold font-comforta text-sm uppercase tracking-wider transition-all duration-200;
        &:hover { @apply bg-secondary/80 text-white ; }
        &--outline {
            @apply bg-primary border-2 border-primary/80 text-white;
            &:hover { @apply border-primary text-foreground; }
        }
    }

    // ── Slideshow ────────────────────────────────────────────────────────
    &__slideshow {
        @apply flex flex-col gap-4;
    }
    &__slide-track {
        @apply relative overflow-hidden rounded-xl border-4 border-primary/60 bg-foreground/5;
        aspect-ratio: 16 / 10;
    }
    &__slide-img {
        @apply absolute inset-0 w-full h-full object-cover;
    }
    &__slide-controls {
        @apply flex items-center justify-center gap-4;
    }
    &__slide-arrow {
        @apply w-9 h-9 flex items-center justify-center rounded-full border border-background/80 text-maintext/50 transition-all duration-200;
        &:hover { @apply border-primary text-primary; }
        i { @apply text-sm; }
    }
    &__slide-dots {
        @apply flex gap-2;
    }
    &__slide-dot {
        @apply w-2 h-2 rounded-full border border-maintext/30 bg-transparent transition-all duration-200 cursor-pointer;
        &--active { @apply bg-primary border-primary; }
    }
}

// ── Panel swap transition ──────────────────────────────────────────────────
.panel-swap-enter-active,
.panel-swap-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}
.panel-swap-enter-from,
.panel-swap-leave-to { opacity: 0; transform: translateY(12px); }

// ── Slideshow transitions ──────────────────────────────────────────────────
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-next-enter-from { opacity: 0; transform: translateX(40px); }
.slide-next-leave-to   { opacity: 0; transform: translateX(-40px); }
.slide-prev-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-prev-leave-to   { opacity: 0; transform: translateX(40px); }
</style>
