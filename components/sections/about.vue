<template lang="pug">
div
    div.page-label
        h3.subtitle {{ title }}
        h2.header About

    //- ── Intro collage + headline ──────────────────────────────────────────
    div.mt-20
        div.grid.grid-cols-1.gap-12(class="lg:grid-cols-2 lg:items-center")
            div.flex.flex-col.gap-6(v-scroll-animate="'slide-right'")
                h3.text-2xl.font-bold.font-holen From first sketch to final click, we help your vision come alive online.
                h1.text-4xl.font-extrabold.font-junegull.leading-tight Turning Bright Ideas into
                    span.text-primary  Beautiful Websites
                p.text-maintext.leading-8 A modern web studio is a creative and technical partner that designs and builds high-quality, custom digital experiences. We're a small, specialised team focused on creating websites and digital products that are visually striking, high-performing, and conversion-driven.
                div.w-80(@click="goToServices")
                    ButtonsFlip(front="See our services" back="→")

            div(v-scroll-animate="'slide-left'")
                CollageSlideshow(:items="collageItems", interval="8000" :show-progress="true" progress-color="rgba(var(--color-primary), 0.8)" :progress-height="4" :overlay-opacity="0.53")

    //- ── Mission statement ────────────────────────────────────────────────
    div.mt-24.text-center.max-w-3xl.mx-auto(v-scroll-animate="'fade'")
        p.text-xl.leading-10.font-garet
            | We are on a mission to help businesses reach their&nbsp;
            span.font-bold.text-primary full potential
            | &nbsp;through smarter and more&nbsp;
            span.font-bold.text-primary purposeful web experiences
            | &nbsp;built for the modern world.

    //- ── Stats bar ────────────────────────────────────────────────────────
    div.stats-bar.mt-20
        div.stats-bar__item(v-for="(stat, i) in stats" :key="stat.label" v-scroll-animate="'slide-up'" :style="`--anim-delay: ${i * 100}ms`")
            div.stats-bar__value {{ stat.value }}
            div.stats-bar__label {{ stat.label }}

    //- ── Team section ─────────────────────────────────────────────────────
    div.mt-28.text-center
        span.section-label Team
        //- h2.text-4xl.font-extrabold.font-junegull.mt-2 Meet the Studio
        h2.section-header Meet the Studio
        p.text-maintext.leading-1.mt-3 Small team. Big impact. Direct access to the people building your project.
        div.grid.grid-cols-1.gap-8.mt-14(class="sm:grid-cols-2 lg:grid-cols-3")
            div.team-card(v-for="(member, i) in team" :key="member.name" v-scroll-animate="'slide-up'" :style="`--anim-delay: ${i * 120}ms`")
                div.team-card__avatar
                    span {{ member.initials }}
                div.team-card__name {{ member.name }}
                div.team-card__role {{ member.role }}

    //- ── FAQ section ──────────────────────────────────────────────────────
    div.mt-28
        div.faq-header.text-center(v-scroll-animate="'fade'")
            div.faq-header__label Got questions?
            h2.section-header Frequently Asked Questions

        div.faq-grid.mt-12
            //- col 1: description
            div.faq-desc(v-scroll-animate="'slide-right'")
                p.faq-desc__text Clear answers to common questions about our studio, process, and services.
                div.faq-tabs.mt-8
                    button.faq-tab(
                        v-for="tab in faqTabs"
                        :key="tab.key"
                        :class="{ 'faq-tab--active': activeTab === tab.key }"
                        @click="activeTab = tab.key"
                    ) {{ tab.label }}

            //- col 2: accordion (spans 2 of 3 cols on desktop)
            div.faq-list(v-scroll-animate="'slide-left'" class="lg:col-span-2")
                div.faq-item(
                    v-for="(item, index) in activeFaqs"
                    :key="`${activeTab}-${index}`"
                )
                    button.faq-item__question.background1(@click="toggle(index)" :aria-expanded="openIndex === index")
                        span {{ item.question }}
                        span.faq-item__icon(:class="{ 'faq-item__icon--open': openIndex === index }")
                            i.bi.bi-plus-lg
                    Transition(name="faq-answer")
                        div.faq-item__answer(v-if="openIndex === index")
                            p {{ item.answer }}

    //- ── CTA strip ────────────────────────────────────────────────────────
    div.cta-strip.mt-28.background1(v-scroll-animate="'fade'")
        div.cta-strip__inner
            div.text-white
                h2.text-3xl.font-bold.font-comforta Let's build something great together
                p.mt-2 Tell us about your project and we'll get back to you within 24 hours.
            div.flex.flex-col.gap-4.flex-wrap
                div(@click="goToContact")
                    ButtonsFlip(front="Get in touch" back="→")
                div(@click="goToServices")
                    ButtonsShadow5 See our services
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

defineProps({
	title: {
		type: String,
		default: () => 'About Us',
	},
})

// ── Collage slideshow items ────────────────────────────────────────────────
const collageItems = [
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

// ── Navigation ─────────────────────────────────────────────────────────────
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

// ── Stats ──────────────────────────────────────────────────────────────────
const stats = [
	{ value: '50+', label: 'Projects Delivered' },
	{ value: '30+', label: 'Happy Clients' },
	{ value: '5+', label: 'Years Experience' },
	{ value: '100%', label: 'On-Time Delivery' },
]

// ── Feature block data ─────────────────────────────────────────────────────
const block1Stats = [
	{ value: 'Faster Decisions', label: 'Real-time insight into what your users want' },
	{ value: 'Sustainable Growth', label: 'Long-term strategies that scale with your business' },
]

const block2Features = [
	{ title: 'Deep Industry Expertise', desc: 'Built real-world experience across a wide range of industries.' },
	{ title: 'Consistent Performance', desc: 'Delivering measurable results with clear impact on efficiency.' },
]

// ── Team ───────────────────────────────────────────────────────────────────
const team = [
	{ name: 'Oluwaseun', role: 'Founder & Lead Developer', initials: 'O' },
	{ name: 'Design Lead', role: 'UI / UX Designer', initials: 'DL' },
	{ name: 'Dev Support', role: 'Frontend Engineer', initials: 'DS' },
]

// ── FAQ ────────────────────────────────────────────────────────────────────
const openIndex = ref<number | null>(null)
const toggle = (index: number) => {
	openIndex.value = openIndex.value === index ? null : index
}

const activeTab = ref('general')

const faqTabs = [
	{ key: 'general', label: 'General' },
	{ key: 'process', label: 'Process' },
	{ key: 'technical', label: 'Technical' },
	{ key: 'pricing', label: 'Pricing' },
]

interface Faq { question: string, answer: string }

const faqData: Record<string, Faq[]> = {
	general: [
		{
			question: 'What is Olux Studio?',
			answer: 'Olux Studio is a specialist web design and development studio based in Blackburn, Lancashire. We build bespoke websites and digital experiences for businesses, startups, and creatives who want to stand out online.',
		},
		{
			question: 'Do you work with clients remotely?',
			answer: 'Absolutely. Most of our clients are remote. We communicate via video call, email, and shared project boards — no need to be local to work with us.',
		},
		{
			question: 'What industries do you work with?',
			answer: 'We work across a wide range of industries including retail, professional services, hospitality, creative agencies, and technology startups. If you have a website need, we can help.',
		},
	],
	process: [
		{
			question: 'How long does a typical project take?',
			answer: 'Most projects land between 2–6 weeks. A simple landing page can be ready in 1–2 weeks, while a full multi-page site with CMS integration typically takes 4–6 weeks. We agree on a timeline before any work begins.',
		},
		{
			question: 'What do you need from me to get started?',
			answer: 'A brief covering your goals, target audience, and any sites you admire. From there we\'ll schedule a discovery call to scope the project properly before sending a proposal.',
		},
		{
			question: 'How many rounds of revisions do I get?',
			answer: 'All plans include at least 2 rounds of design revisions. We work collaboratively throughout, so by the time we reach revisions the design is usually very close to final.',
		},
	],
	technical: [
		{
			question: 'What tech stack do you use?',
			answer: 'We primarily build with Nuxt 3, Vue, and Tailwind CSS for custom sites. For CMS-driven projects we use headless options like Sanity or Contentful. We\'re tech-agnostic and can work within your existing stack if needed.',
		},
		{
			question: 'Will I own the code?',
			answer: 'Yes — full code ownership is transferred to you on project completion. We don\'t use proprietary builders or lock you into our systems.',
		},
		{
			question: 'Can you work with my existing website?',
			answer: 'Yes. We offer redesigns, partial rebuilds, and performance audits. Get in touch with details of your current site and we\'ll advise on the best path forward.',
		},
	],
	pricing: [
		{
			question: 'How much does a website cost?',
			answer: 'Our Starter plan begins at £799 for up to 3 pages. Full multi-page sites start at £1,999. Custom apps and e-commerce builds are scoped individually. See our Services section for full pricing details.',
		},
		{
			question: 'Do you offer payment plans?',
			answer: 'Yes — we typically split projects into a 50% deposit upfront and 50% on completion. For larger projects we can arrange milestone-based payment schedules.',
		},
		{
			question: 'What happens if I need changes after launch?',
			answer: 'All plans include a post-launch support window (30 days on Starter, 3 months on Growth). After that, changes are covered under a monthly retainer or billed at our standard hourly rate.',
		},
	],
}

const activeFaqs = computed(() => {
	openIndex.value = null
	return faqData[activeTab.value] ?? []
})

watch(activeTab, () => { openIndex.value = null })
</script>

<style scoped lang="scss">
// ── Stats bar ──────────────────────────────────────────────────────────────
.stats-bar {
    @apply grid grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 rounded-xl overflow-hidden;
    @apply md:grid-cols-4;
    &__item {
		background-color: color-mix(in hsl, rgb(var(--color-tertiary)), rgba(0, 0, 0, 0.8) 50%);
        @apply flex flex-col items-center py-8 px-4;
    }
    &__value {
        @apply text-4xl font-extrabold font-junegull text-primary;
    }
    &__label {
        @apply text-sm text-foreground/60 mt-1 font-comforta uppercase tracking-wider text-center;
    }
}

// ── Feature label ──────────────────────────────────────────────────────────
.feature-label {
    @apply text-sm font-bold font-comforta uppercase tracking-widest text-primary;
}

// ── Stat callout cards ─────────────────────────────────────────────────────
.stat-callout {
    @apply p-5 rounded-xl border border-foreground/10 bg-foreground/5;
    &__value {
        @apply text-xl font-extrabold font-comforta text-foreground;
    }
    &__label {
        @apply text-sm text-foreground/60 mt-1 leading-5;
    }
}

// ── Image badge (overlaid stat cards) ─────────────────────────────────────
.img-badge {
    @apply absolute bg-background/90 backdrop-blur-sm border border-foreground/10 rounded-xl px-4 py-3 min-w-32;
    &__value {
        @apply text-2xl font-extrabold font-junegull text-primary;
    }
    &__label {
        @apply text-xs text-foreground/60 font-comforta uppercase tracking-wide;
    }
}

// ── Testimonial card ───────────────────────────────────────────────────────
.testimonial-card {
    @apply absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm border border-foreground/10 rounded-xl p-5;
    &__quote {
        @apply text-sm text-foreground/80 italic leading-6;
    }
    &__author {
        @apply text-sm font-bold font-comforta text-primary mt-3;
    }
}

// ── Feature list ───────────────────────────────────────────────────────────
.feature-list {
    @apply flex flex-col gap-5 mt-2;
    li {
        @apply flex items-start gap-3;
        i { @apply text-primary text-xl mt-0.5 shrink-0; }
    }
}

// ── Team cards ─────────────────────────────────────────────────────────────
.team-card {
  	background-color: color-mix(in hsl, rgb(var(--color-tertiary)), rgba(0, 0, 0, .8) 10%);

    @apply flex flex-col items-center gap-3 p-6 rounded-xl border border-foreground/10;
    &__avatar {
        @apply w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-extrabold font-junegull text-primary;
    }
    &__name {
        @apply font-bold font-comforta text-lg text-white;
    }
    &__role {
        @apply text-sm text-white/60;
    }
}

// ── FAQ header ─────────────────────────────────────────────────────────────
.faq-header {
    &__label {
        @apply text-sm font-bold font-comforta uppercase tracking-widest text-primary mb-2;
    }
}

// ── FAQ grid ───────────────────────────────────────────────────────────────
.faq-grid {
    @apply grid grid-cols-1 gap-10;
    @apply lg:grid-cols-3 lg:gap-16 lg:items-start;
}

// ── FAQ description col ────────────────────────────────────────────────────
.faq-desc {
    @apply lg:col-span-1;
    &__text {
        @apply text-background text-base leading-7;
    }
}

// ── FAQ tabs ───────────────────────────────────────────────────────────────
.faq-tabs {
    @apply flex gap-2 flex-wrap;
}
.faq-tab {
    @apply px-4 py-2 rounded-full border border-primary/80 text-sm font-bold font-comforta text-maintext/60 transition-all duration-200;
    &:hover { @apply border-primary text-secondary; }
    &--active {
		@apply bg-primary text-white border-primary;
    	&:hover { @apply border-primary text-overlay; }
	}
}

// ── FAQ accordion ──────────────────────────────────────────────────────────
.faq-list {
    @apply flex flex-col divide-y divide-foreground/10 border border-foreground/10 rounded-xl overflow-hidden;
}
.faq-item {
    &__question {
  		// background-color: color-mix(in hsl, rgb(var(--color-tertiary)), rgba(255, 255, 255, .05) 75%);
        @apply w-full flex justify-between items-center gap-3 px-4 py-4 text-left font-comforta font-bold text-base text-white transition-colors duration-200;
        @apply sm:px-6 sm:py-5 sm:text-lg;
        &:hover { @apply bg-background/5 text-background; }
    }
    &__icon {
        @apply flex-shrink-0 w-8 h-8 rounded-full border border-foreground/40 flex items-center justify-center text-secondary transition-all duration-300;
        i { @apply text-sm leading-none; }
        &--open {
            @apply bg-primary border-secondary text-white rotate-45;
            i { @apply text-white; }
        }
    }
    &__answer {
        @apply px-4 pb-5 pt-1 text-black leading-7 text-sm;
        @apply sm:px-6 sm:pb-6 sm:leading-8 sm:text-base;
    }
}

// ── FAQ answer transition ──────────────────────────────────────────────────
.faq-answer-enter-active,
.faq-answer-leave-active {
    transition: all 0.25s ease;
    overflow: hidden;
}
.faq-answer-enter-from,
.faq-answer-leave-to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
}
.faq-answer-enter-to,
.faq-answer-leave-from {
    opacity: 1;
    max-height: 300px;
}

// ── CTA strip ─────────────────────────────────────────────────────────────
.cta-strip {

    @apply rounded-xl border border-foreground/10 p-10;
    &__inner {
        @apply flex flex-col gap-6 items-start text-foreground;
        @apply md:flex-row md:items-center md:justify-between;
    }
}
.btn-outline {
    @apply px-8 py-4 rounded-md font-adam text-xl font-bold border border-foreground/30 text-foreground transition-all duration-200;
    &:hover { @apply border-primary text-primary; }
}
</style>
