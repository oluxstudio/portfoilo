<template lang="pug">
div
    div.faq-header.text-center(v-scroll-animate="'fade'")
        div.faq-header__label {{ faqLabel }}
        h2.section-header Frequently Asked Questions

    div.faq-grid.mt-12
        //- col 1: description
        div.faq-desc(v-scroll-animate="'slide-right'")
            p.faq-desc__text {{ faqDesc }}
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
</template>

<script setup lang="ts">
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

const fallbackFaqData: Record<string, Faq[]> = {
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

// CMS "faq" collection: flat items with a `group` key; regroup to the tab record.
const { collection, attr } = useCmsContent()
const faqLabel = attr('about_faq_label', 'Got questions?')
const faqDesc = attr('about_faq_desc', 'Clear answers to common questions about our studio, process, and services.')
const cmsFaqs = collection<Faq & { group: string }>('faq', [], d => ({
	group: String(d.group ?? 'general'),
	question: String(d.question ?? ''),
	answer: String(d.answer ?? ''),
}))
const faqData = computed<Record<string, Faq[]>>(() => {
	if (!cmsFaqs.value.length) return fallbackFaqData
	const grouped: Record<string, Faq[]> = {}
	for (const { group, question, answer } of cmsFaqs.value) {
		(grouped[group] ??= []).push({ question, answer })
	}
	return grouped
})

const activeFaqs = computed(() => faqData.value[activeTab.value] ?? [])

watch(activeTab, () => { openIndex.value = null })
</script>

<style scoped lang="scss">
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
</style>
