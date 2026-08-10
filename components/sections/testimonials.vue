<template lang="pug">
div
    div.page-label
        h3.subtitle What clients say
        h2.header Reviews

    //- Heading
    div.mt-20.text-center.max-w-4xl.mx-auto
        span.section-label {{ label }}
        h2.section-header.mt-3 {{ header }}
        p.section-sub.mt-4 {{ intro }}

    //- Stats strip
    div.stats-strip.mt-14
        div.stats-strip__item(v-for="s in stats" :key="s.label")
            div.stats-strip__value {{ s.value }}
            div.stats-strip__label {{ s.label }}

    //- Testimonial grid / carousel
    div(ref="sectionRef")
    Transition(name="panel-swap" mode="out-in")
        div(v-if="!showCarousel" key="grid")
            div.testimonial-grid.mt-16
                div.testimonial-card(
                    v-for="t in testimonials"
                    :key="t.id"
                    @click="openCarousel(t)"
                    role="button"
                    tabindex="0"
                    @keydown.enter="openCarousel(t)"
                )
                    div.testimonial-card__stars
                        i.bi.bi-star-fill(v-for="n in t.rating" :key="n")
                    p.testimonial-card__quote "{{ truncate(t.quote) }}"
                    div.testimonial-card__author
                        div.testimonial-card__avatar {{ t.initials }}
                        div
                            div.testimonial-card__name {{ t.name }}
                            div.testimonial-card__role {{ t.role }}, {{ t.company }}
                    div.testimonial-card__read-more Read more

        div.mt-16(v-else key="carousel")
            ReviewsCarousel(:reviews="orderedReviews" @close="closeCarousel")

    //- CTA
    div.testimonial-cta.mt-20
        p.section-header {{ ctaHeading }}
        a(href="#contact")
            button.btn {{ ctaButton }}
</template>

<script setup lang="ts">
const fallbackStats = [
	{ value: '50+', label: 'Projects completed' },
	{ value: '30+', label: 'Happy clients' },
	{ value: '4.9★', label: 'Average rating' },
	{ value: '100%', label: 'Would recommend us' },
]

interface Testimonial {
	id: number
	quote: string
	name: string
	role: string
	company: string
	initials: string
	rating: number
}

const fallbackTestimonials: Testimonial[] = [
	{
		id: 1,
		quote: 'Olux Studio delivered our new website ahead of schedule and it looked better than anything we could have imagined. The attention to detail and communication throughout was exceptional.',
		name: 'Sarah Mitchell', role: 'Founder', company: 'Bloom Creative',
		initials: 'SM', rating: 5,
	},
	{
		id: 2,
		quote: 'We needed a complete redesign fast. Olux understood our brand immediately and built something that genuinely sets us apart from competitors. Our enquiries doubled within a month of launch.',
		name: 'James Patel', role: 'Managing Director', company: 'Apex Consulting',
		initials: 'JP', rating: 5,
	},
	{
		id: 3,
		quote: 'Working with Olux was effortless. They asked the right questions, pushed back on ideas that wouldn\'t work, and delivered a clean, fast site that our team can actually manage ourselves.',
		name: 'Lauren Davies', role: 'Marketing Manager', company: 'Forte Digital',
		initials: 'LD', rating: 5,
	},
	{
		id: 4,
		quote: 'The e-commerce site they built for us handles hundreds of orders a week without a hitch. The UX is intuitive, the checkout is fast, and our conversion rate has never been higher.',
		name: 'Tom Reeves', role: 'CEO', company: 'NorthBay Goods',
		initials: 'TR', rating: 5,
	},
	{
		id: 5,
		quote: 'I came with a rough idea and a tight budget. Olux was honest about what was achievable, prioritised beautifully, and the result is a site I\'m genuinely proud to share with clients.',
		name: 'Amara Osei', role: 'Freelance Consultant', company: 'AO Strategy',
		initials: 'AO', rating: 5,
	},
	{
		id: 6,
		quote: 'From the first call to launch day, Olux Studio made the whole process feel simple. They\'re the kind of team you keep on retainer because losing them would be a real step backwards.',
		name: 'Daniel Wright', role: 'Head of Digital', company: 'Meridian Group',
		initials: 'DW', rating: 5,
	},
]

const { collection, attr } = useCmsContent()
const intro = attr('testimonials_intro', 'Don\'t just take our word for it — here\'s what our clients have to say about working with Olux Studio.')
const label = attr('testimonials_label', 'Client testimonials')
const header = attr('testimonials_header', 'Trusted by businesses across the UK')
const ctaHeading = attr('testimonials_cta_heading', 'Ready to join them?')
const ctaButton = attr('testimonials_cta_button', 'Start your project')
const stats = collection('testimonial-stats', fallbackStats, d => ({
	value: String(d.value ?? ''),
	label: String(d.label ?? ''),
}))
const testimonials = collection<Testimonial>('testimonials', fallbackTestimonials, (d, item) => ({
	id: item.id,
	quote: String(d.quote ?? ''),
	name: String(d.name ?? ''),
	role: String(d.role ?? ''),
	company: String(d.company ?? ''),
	initials: String(d.initials || String(d.name ?? '').split(' ').map(w => w[0]).join('').toUpperCase()),
	rating: Math.min(5, Math.max(1, Number(d.rating ?? 5))),
}))

const showCarousel = ref(false)
const startIndex = ref(0)
const sectionRef = ref<HTMLElement | null>(null)

const { scrollToSection: scrollTo } = useScrollToSection()

const truncate = (text: string, maxWords = 10) => {
	const words = text.split(' ')
	return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ') + '…'
}

const orderedReviews = computed(() => {
	const idx = startIndex.value
	return [...testimonials.value.slice(idx), ...testimonials.value.slice(0, idx)]
})

const openCarousel = (t: Testimonial) => {
	startIndex.value = testimonials.value.findIndex(r => r.id === t.id)
	showCarousel.value = true
	scrollTo(sectionRef)
}

// Called from carousel @close
const closeCarousel = () => {
	showCarousel.value = false
	scrollTo(sectionRef)
}
</script>

<style scoped lang="scss">
.section-sub {
    @apply text-background leading-8;
}

// ── Stats strip ────────────────────────────────────────────────────────────
.stats-strip {
    @apply grid grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 rounded-xl overflow-hidden;
    @apply md:grid-cols-4;
    &__item {
  		background-color: color-mix(in hsl, rgb(var(--color-tertiary)), rgba(0, 0, 0, .8) 50%);
        @apply flex flex-col items-center py-7 px-4 ;
    }
    &__value {
        @apply text-3xl font-extrabold font-junegull text-primary;
    }
    &__label {
        @apply text-xs text-white/70  mt-1 font-comforta uppercase tracking-wide text-center;
    }
}

// ── Testimonial grid ───────────────────────────────────────────────────────
.testimonial-grid {
    @apply grid grid-cols-1 gap-6;
    @apply md:grid-cols-2 lg:grid-cols-3;
}
.testimonial-card {
    @apply relative flex flex-col gap-4 p-7 rounded-2xl border border-primary/30 bg-overlay/75 transition-all duration-300 cursor-pointer;
    &:hover {
        @apply border-primary/30 bg-primary text-white;
        .testimonial-card__read-more { @apply opacity-100 text-white; }
        .testimonial-card__quote { @apply text-white/90; }
        .testimonial-card__author { @apply border-white/20; }
        .testimonial-card__avatar { @apply bg-white/20 text-white; }
        .testimonial-card__name { @apply text-white; }
        .testimonial-card__role { @apply text-white/70; }
    }
    &__stars {
        @apply flex gap-1 text-tertiary text-sm;
    }
    &__quote {
        @apply text-background leading-8 flex-1 italic transition-colors duration-300;
    }
    &__author {
        @apply flex items-center gap-3 pt-4 border-t border-background/10 mt-auto transition-colors duration-300;
    }
    &__avatar {
        @apply w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-extrabold font-junegull text-primary shrink-0 transition-all duration-300;
    }
    &__name { @apply font-bold font-comforta text-background text-sm transition-colors duration-300; }
    &__role { @apply text-xs text-background/80 mt-0.5 transition-colors duration-300; }
    &__read-more {
        @apply absolute top-8 right-8 text-xs font-bold font-comforta text-primary uppercase tracking-wider opacity-0 transition-all duration-200;
    }
}

// ── Lightbox ───────────────────────────────────────────────────────────────

// ── Panel swap transition ──────────────────────────────────────────────────
.panel-swap-enter-active,
.panel-swap-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}
.panel-swap-enter-from,
.panel-swap-leave-to {
    opacity: 0;
    transform: translateY(12px);
}

// ── CTA ────────────────────────────────────────────────────────────────────
.testimonial-cta {
    @apply flex flex-col items-center gap-5 text-center;
    &__text {
        @apply text-2xl font-extrabold font-junegull text-foreground;
    }
}
</style>
