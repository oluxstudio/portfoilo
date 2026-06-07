<template lang="pug">
div
    div.page-label
        h3.subtitle {{props.title}}
        h2.header Services

    //- Service cards / detail panel
    div.mt-20
        h3.text-2xl.font-bold From first sketch to final click, we help your vision come alive online.
        h1.section-header.my-6 What We Do
        div(ref="serviceRef")
        Transition(name="panel-swap" mode="out-in")
            //- Grid
            div(v-if="!activeService" key="grid")
                div.grid.grid-cols-1.gap-6(class="md:grid-cols-2 lg:grid-cols-3")
                    div.service-card(
                        v-for="(item, i) in services"
                        :key="item.header"
                        :style="`--anim-delay: ${i * 80}ms`"
                        @click="activeService = item; scrollToSection(serviceRef)"
                        role="button"
                        tabindex="0"
                        @keydown.enter="activeService = item; scrollToSection(serviceRef)"
                    )
                        div.service-card__icon
                            i(:class="item.icon")
                        div.header4.mt-4 {{ item.header }}
                        div.mt-3.text-maintext {{ item.text }}
                        div.service-card__cta Learn more

            //- Detail card
            div.service-detail(v-else :key="activeService.header")
                button.service-detail__back(@click="activeService = null; scrollToSection(serviceRef)")
                    i.bi.bi-arrow-left
                    span Back to Services

                div.service-detail__card
                    div.service-detail__card-icon
                        i(:class="activeService.icon")
                    div.service-detail__card-body
                        h2.service-detail__card-title {{ activeService.header }}
                        p.service-detail__card-summary {{ activeService.text }}
                        ul.service-detail__card-list
                            li(v-for="point in activeService.details" :key="point")
                                i.bi.bi-check-circle-fill
                                span {{ point }}
                        div.w-60(@click="goToContact")
                            ButtonsFlip(front="Get in touch" back="Let's talk")
    //- Pricing
    div.py-20
        div(ref="pricingRef")
        Transition(name="panel-swap" mode="out-in")
            //- Pricing grid
            div(v-if="!selectedPlan" key="grid")
                div.text-center.mb-14
                    h3.section-label Simple, transparent pricing
                    h1.section-header.my-4 Choose Your Plan
                    p.text-foreground/60.max-w-xl.mx-auto Every project is different — pick the tier that fits, or reach out for a tailored quote.

                div.grid.grid-cols-1.gap-8(class="md:grid-cols-3")
                    div.pricing-card(
                        v-for="(plan, i) in pricing"
                        :key="plan.name"
                        :class="{'pricing-card--featured': plan.featured}"
                        @click="selectedPlan = plan; scrollToSection(pricingRef)"
                        role="button"
                        tabindex="0"
                        @keydown.enter="selectedPlan = plan; scrollToSection(pricingRef)"
                    )
                        div.pricing-card__badge(v-if="plan.featured") Most Popular
                        h3.pricing-card__name {{ plan.name }}
                        div.pricing-card__price
                            span.pricing-card__currency £
                            span.pricing-card__amount {{ plan.price }}
                            span.pricing-card__period(v-if="plan.period")  {{ plan.period }}
                        p.pricing-card__desc {{ plan.description }}
                        ul.pricing-card__features
                            li(v-for="feature in plan.features" :key="feature")
                                i.bi.bi-check-lg
                                span  {{ feature }}
                        button.pricing-card__cta(:class="plan.featured ? 'pricing-card__cta--featured' : ''") {{ plan.cta }}

            //- Panel
            div(v-else key="panel")
                PricingPanel(:plan="selectedPlan" @close="selectedPlan = null; scrollToSection(pricingRef)")

    //- CTA strip
    div.cta-strip(v-scroll-animate="'fade'")
        div.cta-strip__inner
            div
                h2.text-3xl.font-bold.font-comforta Got a project in mind?
                p.text-maintext.mt-2 Let's talk about what we can build together.
            div(@click="goToContact")
                button.btn Get in touch
</template>

<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
})

interface Service {
	icon: string
	header: string
	text: string
	details: string[]
}

const activeService = ref<Service | null>(null)
const selectedPlan = ref<PricingPlan | null>(null)
const serviceRef = ref<HTMLElement | null>(null)
const pricingRef = ref<HTMLElement | null>(null)

const { scrollToSection } = useScrollToSection()
const { prefill } = useContactPrefill()
const menuStore = useMenuStore()

const goToContact = () => {
	const serviceName = activeService.value?.header ?? ''
	activeService.value = null
	if (serviceName) prefill(`${serviceName} enquiry`)
	menuStore.isActive('/contact')
	menuStore.loadPage('/contact')
}

const services: Service[] = [
	{
		icon: 'bi bi-laptop text-3xl text-primary',
		header: 'Custom Website Design',
		text: 'Bespoke websites built from scratch — no templates. Every pixel crafted to reflect your brand identity and business goals.',
		details: [
			'Full discovery session to understand your brand, goals, and audience',
			'Custom wireframes and design mockups before any code is written',
			'Typography, colour, and layout decisions tailored to your identity',
			'Fully bespoke — no page builders, no cookie-cutter themes',
			'2 rounds of design revisions included as standard',
			'Final handoff includes all source files and assets',
		],
	},
	{
		icon: 'bi bi-phone text-3xl text-primary',
		header: 'Responsive Development',
		text: 'Fast, fluid experiences across every screen size. Built with modern frameworks for performance and long-term maintainability.',
		details: [
			'Mobile-first approach — designed for phones, scaled up to desktop',
			'Built with Nuxt 3, Vue, and Tailwind CSS for modern performance',
			'Tested across all major browsers and device sizes',
			'Smooth animations and transitions that enhance — not distract',
			'Clean, maintainable code with clear documentation',
			'Lighthouse scores of 90+ targeted across all categories',
		],
	},
	{
		icon: 'bi bi-cart3 text-3xl text-primary',
		header: 'E-Commerce Solutions',
		text: 'Online stores that convert. From product pages to checkout flows, we build shops that are easy to manage and built to sell.',
		details: [
			'Custom product catalogue with filtering, search, and variants',
			'Streamlined, distraction-free checkout flow to reduce drop-off',
			'Secure payment integration (Stripe, PayPal, and more)',
			'Inventory and order management built in or integrated',
			'Abandoned cart recovery and upsell logic available',
			'Headless commerce architecture for maximum flexibility',
		],
	},
	{
		icon: 'bi bi-pencil-square text-3xl text-primary',
		header: 'CMS Integration',
		text: 'Take control of your content. We integrate headless CMS platforms so you can update your site without touching code.',
		details: [
			'Headless CMS setup with Sanity, Contentful, or your preferred platform',
			'Custom content schemas matched to your exact content structure',
			'Intuitive editing experience — no developer needed for updates',
			'Preview mode so you can review changes before publishing',
			'Role-based access control for teams of any size',
			'Full training and documentation provided on handoff',
		],
	},
	{
		icon: 'bi bi-graph-up-arrow text-3xl text-primary',
		header: 'SEO & Performance',
		text: 'Sites built with Core Web Vitals in mind — optimised images, clean code, and structured data baked in from day one.',
		details: [
			'Semantic HTML structure for strong crawlability from day one',
			'Meta tags, Open Graph, and structured data (JSON-LD) configured',
			'Image optimisation — WebP conversion, lazy loading, correct sizing',
			'Core Web Vitals optimisation: LCP, CLS, and INP targets met',
			'Google Analytics 4 and Search Console setup and verification',
			'Ongoing SEO audit reports available as part of support plans',
		],
	},
	{
		icon: 'bi bi-wrench-adjustable text-3xl text-primary',
		header: 'Ongoing Support',
		text: 'Your site is never truly finished. We offer maintenance plans to keep things updated, secure, and performing at their best.',
		details: [
			'Monthly or quarterly maintenance plans to suit your needs',
			'Dependency and security updates applied proactively',
			'Performance monitoring with alerts for downtime or regressions',
			'Priority response SLA — issues addressed within 1 business day',
			'Content updates and minor feature additions included in plan',
			'Quarterly review calls to align the site with your business goals',
		],
	},
]

interface PricingPlan {
	name: string
	price: string
	period?: string
	description: string
	features: string[]
	cta: string
	featured: boolean
}

const pricing: PricingPlan[] = [
	{
		name: 'Starter',
		price: '799',
		description: 'Perfect for freelancers, creatives, and small businesses needing a clean, professional presence online.',
		features: [
			'Up to 3 pages',
			'Responsive design',
			'Contact form',
			'SEO foundations',
			'2 rounds of revisions',
			'30-day post-launch support',
		],
		cta: 'Get started',
		featured: false,
	},
	{
		name: 'Growth',
		price: '1,999',
		description: 'For growing businesses that need a full site, CMS control, and a stronger digital foundation.',
		features: [
			'Up to 8 pages',
			'CMS integration',
			'Blog or news section',
			'Performance optimisation',
			'Google Analytics setup',
			'3 months post-launch support',
		],
		cta: 'Get started',
		featured: true,
	},
	{
		name: 'Custom',
		price: 'Let\'s talk',
		description: 'Complex web apps, e-commerce builds, or anything requiring a fully tailored solution — we scope it together.',
		features: [
			'Unlimited scope',
			'E-commerce / web app',
			'Custom integrations & APIs',
			'Dedicated project management',
			'Ongoing retainer available',
			'Priority support',
		],
		cta: 'Contact us',
		featured: false,
	},
]
</script>

<style scoped lang="scss">
.service-card {
    @apply p-8 border border-primary/30 bg-overlay/75 rounded-lg transition-all duration-300 cursor-pointer;
    &:hover {
        @apply border-primary bg-primary text-white;
        .service-card__icon { @apply bg-white/20; }
        .service-card__icon i { @apply text-white; }
        .header4 { @apply text-white; }
        div.mt-3 { @apply text-white/80; }
        .service-card__cta { @apply opacity-100; }
    }
    &__icon {
        @apply w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 transition-all duration-300;
    }
    &__cta {
        @apply mt-4 text-sm font-bold font-comforta uppercase tracking-wider text-white/80 opacity-0 transition-opacity duration-200;
    }
}

// ── Service detail panel ───────────────────────────────────────────────────
.service-detail {
    &__back {
        @apply inline-flex items-center gap-2 px-5 py-2.5 mb-10 rounded-full border-2 border-primary text-primary font-bold font-comforta text-sm uppercase tracking-wider transition-all duration-200;
        &:hover { @apply bg-primary text-white; }
        i { @apply text-base; }
    }

    &__card {
        @apply flex flex-col gap-8 p-8 rounded-2xl border border-primary/40 bg-tertiary/85;
        @apply lg:flex-row lg:items-start lg:gap-12;
    }

    &__card-icon {
        @apply w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/20;
        i { @apply text-4xl text-primary; }
    }

    &__card-body {
        @apply flex flex-col gap-5 flex-1;
    }

    &__card-title {
        @apply text-3xl font-extrabold font-junegull text-foreground;
    }

    &__card-summary {
        @apply text-white leading-7 text-base;
    }

    &__card-list {
        @apply grid grid-cols-1 gap-3;
        @apply sm:grid-cols-2;
        li {
            @apply flex items-start gap-3 text-sm text-white;
            i { @apply text-primary text-base mt-0.5 shrink-0; }
        }
    }

    &__card-cta {
        @apply inline-block self-start px-8 py-3 rounded-xl bg-primary text-white font-bold font-comforta uppercase tracking-wider transition-all duration-200 mt-2 cursor-pointer;
        &:hover { @apply bg-primary/80 text-white; }
    }
}

.pricing-card {
    @apply relative flex flex-col p-8 rounded-xl border border-secondary/10 bg-primary/90;
    &--featured {
        @apply border-primary bg-background/80 text-foreground;
    }
    &__badge {
        @apply absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1 rounded-full font-comforta uppercase tracking-wider;
    }
    &__name {
        @apply text-2xl font-bold font-comforta text-foreground uppercase tracking-wide;
    }
    &__price {
        @apply mt-4 mb-6 flex items-end gap-1;
    }
    &__currency {
        @apply text-3xl font-bold text-overlay mb-1;
    }
    &__amount {
        @apply text-5xl font-extrabold font-junegull text-foreground;
    }
    &__period {
        @apply mb-2;
    }
    &__desc {
        @apply mb-6 text-base leading-7;
    }
    &__features {
        @apply flex flex-col gap-3 flex-1 mb-8;
        li {
            @apply flex items-start gap-2 text-base;
            i { @apply text-primary text-xl mt-0.5 shrink-0; }
        }
    }
    &__cta {
        @apply w-full py-3 rounded-lg font-bold font-comforta uppercase tracking-wider transition-all duration-200 border border-foreground/20 bg-foreground/5;
        &:hover { @apply bg-foreground/10; }
        &--featured {
            @apply bg-primary text-white border-primary;
            &:hover { @apply bg-primary/80; }
        }
    }
}

// ── Pricing card click cursor ──────────────────────────────────────────────
.pricing-card {
    @apply cursor-pointer;
}

// ── Panel swap transition ──────────────────────────────────────────────────
.panel-swap-enter-active,
.panel-swap-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.panel-swap-enter-from,
.panel-swap-leave-to {
    opacity: 0;
    transform: translateY(12px);
}

.cta-strip {
    @apply mt-8 rounded-xl border border-foreground/10 bg-foreground/5 p-10;
    &__inner {
        @apply flex flex-col gap-6 items-start;
        @apply md:flex-row md:items-center md:justify-between;
    }
}
</style>
