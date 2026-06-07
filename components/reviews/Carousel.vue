<template lang="pug">
div.carousel
    //- Close button
    button.carousel__back(@click="$emit('close')")
        i.bi.bi-arrow-left
        span Back to Reviews

    div.carousel__stage
        //- Prev arrow — desktop only
        button.carousel__arrow.carousel__arrow--prev.hidden(class="md:flex" @click="prev" aria-label="Previous")
            i.bi.bi-chevron-left

        //- Card
        div.carousel__track(
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
        )
            Transition(:name="direction === 'next' ? 'slide-next' : 'slide-prev'" mode="out-in")
                div.carousel__card(:key="current")
                    //- Avatar
                    div.carousel__avatar
                        div.carousel__avatar-ring
                            img(
                                v-if="props.reviews[current].image"
                                :src="props.reviews[current].image"
                                :alt="props.reviews[current].name"
                            )
                            div.carousel__avatar-initials(v-else) {{ props.reviews[current].initials }}

                    //- Body
                    div.carousel__body
                        div.carousel__quote-mark
                            i.bi.bi-quote
                        div.carousel__content
                            p.carousel__text
                                | {{ expanded ? props.reviews[current].quote : truncate(props.reviews[current].quote) }}
                                button.carousel__read-more(
                                    v-if="!expanded && needsTruncation(props.reviews[current].quote)"
                                    @click="expanded = true"
                                ) &nbsp; read more »
                            p.carousel__author {{ props.reviews[current].name }}
                            div.carousel__stars
                                i.bi.bi-star-fill(v-for="n in props.reviews[current].rating" :key="n")

                    //- Wave decoration
                    div.carousel__wave
                        svg(viewBox="0 0 800 120" preserveAspectRatio="none")
                            path(d="M0,40 C150,100 350,0 550,60 C680,100 750,30 800,50 L800,120 L0,120 Z")

        //- Next arrow — desktop only
        button.carousel__arrow.carousel__arrow--next.hidden(class="md:flex" @click="next" aria-label="Next")
            i.bi.bi-chevron-right

    //- Dots + swipe hint
    div.carousel__footer
        //- Swipe hint — mobile only
        div.carousel__swipe-hint(class="md:hidden")
            i.bi.bi-arrow-left-right
            span Swipe to navigate

        div.carousel__dots
            button.carousel__dot(
                v-for="(_, i) in props.reviews"
                :key="i"
                :class="{ 'carousel__dot--active': i === current }"
                @click="goTo(i)"
                :aria-label="`Review ${i + 1}`"
            )
</template>

<script setup lang="ts">
interface Review {
	id: number
	quote: string
	name: string
	role: string
	company: string
	initials: string
	rating: number
	image?: string
}

const props = defineProps<{ reviews: Review[] }>()
defineEmits(['close'])

const current = ref(0)
const direction = ref<'next' | 'prev'>('next')
const expanded = ref(false)

const MAX_WORDS = 40

const needsTruncation = (text: string) => text.split(' ').length > MAX_WORDS
const truncate = (text: string) => {
	const words = text.split(' ')
	return words.length > MAX_WORDS ? words.slice(0, MAX_WORDS).join(' ') + ' …' : text
}

const goTo = (index: number) => {
	direction.value = index > current.value ? 'next' : 'prev'
	current.value = index
	expanded.value = false
}

const next = () => {
	direction.value = 'next'
	current.value = (current.value + 1) % props.reviews.length
	expanded.value = false
}

const prev = () => {
	direction.value = 'prev'
	current.value = (current.value - 1 + props.reviews.length) % props.reviews.length
	expanded.value = false
}

// ── Keyboard nav ──────────────────────────────────────────────────────────
const onKey = (e: KeyboardEvent) => {
	if (e.key === 'ArrowRight') next()
	if (e.key === 'ArrowLeft') prev()
}

// ── Swipe nav ─────────────────────────────────────────────────────────────
let touchStartX = 0
const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].clientX }
const onTouchEnd = (e: TouchEvent) => {
	const delta = e.changedTouches[0].clientX - touchStartX
	if (Math.abs(delta) < 40) return
	delta < 0 ? next() : prev()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped lang="scss">
.carousel {
    @apply flex flex-col gap-6;

    &__back {
        @apply inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary text-primary font-bold font-comforta text-sm uppercase tracking-wider transition-all duration-200 self-start;
        &:hover { @apply bg-primary text-white; }
    }

    &__stage {
        @apply flex items-center gap-2;
        @apply md:gap-6;
    }

    &__track {
        @apply flex-1 overflow-hidden cursor-grab active:cursor-grabbing;
    }

    // ── Card ──────────────────────────────────────────────────────────────
    &__card {
        @apply relative rounded-2xl overflow-hidden pb-24;
        background-color: rgba(var(--color-primary),.95);
    }

    // ── Avatar ────────────────────────────────────────────────────────────
    &__avatar {
        @apply flex justify-center pt-8 mb-4;
    }
    &__avatar-ring {
        @apply w-24 h-24 rounded-full overflow-hidden flex items-center justify-center shrink-0;
        @apply md:w-28 md:h-28;
        background-color: rgba(var(--color-tertiary));
        border: 4px solid rgba(255,255,255,0.15);
        box-shadow: 0 0 0 4px rgba(var(--color-primary), 0.4);
        img { @apply w-full h-full object-cover; }
    }
    &__avatar-initials {
        @apply text-2xl font-extrabold font-junegull text-secondary;
    }

    // ── Body ──────────────────────────────────────────────────────────────
    &__body {
        @apply flex gap-4 px-6 py-4 relative z-10;
        @apply md:px-12 md:py-6;
    }
    &__quote-mark {
        @apply shrink-0 mt-1;
        i { @apply text-6xl text-secondary leading-none; }
    }
    &__content {
        @apply flex flex-col gap-3;
    }
    &__text {
        @apply leading-8 text-base;
        color: rgba(255,255,255,0.85);
    }
    &__read-more {
        @apply text-primary font-bold font-comforta text-sm cursor-pointer inline;
        &:hover { @apply underline; }
    }
    &__author {
        @apply font-bold font-comforta text-lg;
        color: rgba(255,255,255,1);
    }
    &__stars {
        @apply flex gap-1 text-foreground;
    }

    // ── Wave ──────────────────────────────────────────────────────────────
    &__wave {
        @apply absolute bottom-0 left-0 right-0 h-24 pointer-events-none;
        svg {
            @apply w-full h-full;
            path { fill: rgba(var(--color-tertiary), 0.8); filter: brightness(0.7); }
        }
    }

    // ── Arrows — desktop only ─────────────────────────────────────────────
    &__arrow {
        @apply w-10 h-10 shrink-0 items-center justify-center rounded-full border border-background text-maintext transition-all duration-200;
        @apply md:w-12 md:h-12;
        &:hover { @apply border-primary text-primary; }
        i { @apply text-lg; }
    }

    // ── Footer ────────────────────────────────────────────────────────────
    &__footer {
        @apply flex flex-col items-center gap-3;
    }

    // ── Swipe hint — mobile only ──────────────────────────────────────────
    &__swipe-hint {
        @apply flex items-center gap-2 text-foreground/40 text-xs font-comforta;
        i { @apply text-sm; }
    }

    // ── Dots ──────────────────────────────────────────────────────────────
    &__dots {
        @apply flex justify-center gap-2;
    }
    &__dot {
        @apply w-2.5 h-2.5 rounded-full border border-background/40 bg-transparent transition-all duration-200;
        &--active { @apply bg-primary border-primary scale-110; }
        &:hover:not(&--active) { @apply border-primary/50; }
    }
}

// ── Slide transitions ──────────────────────────────────────────────────────
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-next-enter-from { opacity: 0; transform: translateX(60px); }
.slide-next-leave-to   { opacity: 0; transform: translateX(-60px); }
.slide-prev-enter-from { opacity: 0; transform: translateX(-60px); }
.slide-prev-leave-to   { opacity: 0; transform: translateX(60px); }
</style>
