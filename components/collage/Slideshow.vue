<template lang="pug">
div.slideshow(:style="{ minHeight: minHeight + 'px' }")
    //- ── Main display ──────────────────────────────────────────────────────
    div.slideshow__main
        Transition(:name="transitionName" mode="out-in")
            div.slideshow__main-inner(:key="active.id")
                img.slideshow__media(
                    v-if="active.type === 'image'"
                    :src="active.src"
                    :alt="active.alt || ''"
                    loading="lazy"
                    decoding="async"
                )
                video.slideshow__media(
                    v-else-if="active.type === 'video'"
                    :src="active.src"
                    autoplay loop muted playsinline
                )
                div.slideshow__text-card(v-else-if="active.type === 'text'")
                    span.slideshow__text-label(v-if="active.label") {{ active.label }}
                    p.slideshow__text-body {{ active.text }}

        //- Play / Pause button — top left
        button.slideshow__playbtn(v-if="showControls" @click="togglePlay" :aria-label="playing ? 'Pause' : 'Play'")
            i.bi(:class="playing ? 'bi-pause-fill' : 'bi-play-fill'")

        //- Progress bar — bottom
        div.slideshow__progress(v-if="showProgress" :style="{ height: progressHeight + 'px' }")
            div.slideshow__progress-fill(:style="progressFillStyle")

    //- ── Queue (right column, always 2 items) ──────────────────────────────
    div.slideshow__queue
        TransitionGroup(name="queue-item" tag="div" class="slideshow__queue-inner")
            div.slideshow__thumb(
                v-for="item in visibleQueue"
                :key="item.id"
                @click="swapToMain(item)"
                role="button"
                :title="item.alt || item.label || 'View'"
            )
                img.slideshow__thumb-media(
                    v-if="item.type === 'image'"
                    :src="item.src"
                    :alt="item.alt || ''"
                    loading="lazy"
                    decoding="async"
                )
                video.slideshow__thumb-media(
                    v-else-if="item.type === 'video'"
                    :src="item.src"
                    muted loop autoplay playsinline
                )
                div.slideshow__thumb-text(v-else-if="item.type === 'text'")
                    span.slideshow__thumb-label(v-if="item.label") {{ item.label }}
                    p {{ item.text }}
                //- Persistent overlay on thumbnails
                div.slideshow__thumb-tint(v-if="showOverlay" :style="overlayStyle")
                //- Hover overlay with icon
                div.slideshow__thumb-overlay
                    i.bi.bi-arrow-up-left
</template>

<script setup lang="ts">
export interface SlideItem {
	id: number
	type: 'image' | 'video' | 'text'
	src?: string
	alt?: string
	label?: string
	text?: string
}

const props = withDefaults(defineProps<{
	items: SlideItem[]
	/** Number of items visible in the right queue */
	queueSize?: number
	/** Auto-advance interval in ms. Set to 0 to disable autoplay */
	interval?: number
	/** Start playing automatically on mount */
	autoplay?: boolean
	/** Show the play/pause button */
	showControls?: boolean
	/** Show the progress bar */
	showProgress?: boolean
	/** Show the colour overlay on the main item */
	showOverlay?: boolean
	/** CSS color for the overlay (default: tertiary at 18% opacity) */
	overlayColor?: string
	/** Overlay opacity 0–1 */
	overlayOpacity?: number
	/** CSS color for the progress bar fill */
	progressColor?: string
	/** Height of the progress bar in px */
	progressHeight?: number
	/** Min height of the slideshow in px */
	minHeight?: number
}>(), {
	queueSize: 2,
	interval: 4000,
	autoplay: true,
	showControls: true,
	showProgress: true,
	showOverlay: true,
	overlayOpacity: 0.18,
	progressHeight: 4,
	minHeight: 480,
})

// ── State ──────────────────────────────────────────────────────────────────
const active = ref<SlideItem>(props.items[0])
const queue = ref<SlideItem[]>(props.items.slice(1))
const direction = ref<'up' | 'down'>('up')
const playing = ref(props.autoplay && props.interval > 0)
const progress = ref(0)

const transitionName = computed(() => `slide-${direction.value}`)
const visibleQueue = computed(() => queue.value.slice(0, props.queueSize))

const overlayStyle = computed(() => ({
	background: props.overlayColor
		? props.overlayColor
		: `rgba(var(--color-tertiary), ${props.overlayOpacity})`,
}))

// Only override background via inline style if a custom color prop is given.
// Otherwise let SCSS handle it so CSS variables resolve correctly.
const progressFillStyle = computed(() => ({
	width: progress.value + '%',
	...(props.progressColor ? { background: props.progressColor } : {}),
}))

// ── Swap ───────────────────────────────────────────────────────────────────
const swapToMain = (item: SlideItem) => {
	direction.value = 'up'
	const idx = queue.value.findIndex(q => q.id === item.id)
	if (idx === -1) return
	queue.value.splice(idx, 1)
	queue.value.push(active.value)
	active.value = item
	resetTimer()
}

const advance = () => {
	direction.value = 'up'
	const next = queue.value[0]
	if (!next) return
	queue.value.shift()
	queue.value.push(active.value)
	active.value = next
}

// ── Autoplay + progress ────────────────────────────────────────────────────
let timer: ReturnType<typeof setInterval> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null
const TICK = 50 // ms per progress tick

const startProgress = () => {
	stopProgress() // always clear any existing progress timer first
	progress.value = 0
	progressTimer = setInterval(() => {
		progress.value = Math.min(100, progress.value + (TICK / props.interval) * 100)
	}, TICK)
}

const stopProgress = () => {
	if (progressTimer) { clearInterval(progressTimer); progressTimer = null }
}

const startTimer = () => {
	stopTimer()
	startProgress()
	timer = setInterval(() => {
		advance()
		startProgress()
	}, props.interval)
}

const stopTimer = () => {
	if (timer) { clearInterval(timer); timer = null }
	stopProgress()
}

const resetTimer = () => {
	if (playing.value) startTimer()
}

const togglePlay = () => {
	playing.value = !playing.value
	playing.value ? startTimer() : stopTimer()
}

onMounted(() => { if (playing.value) startTimer() })
onUnmounted(() => stopTimer())
</script>

<style scoped lang="scss">
.slideshow {
    @apply grid gap-2;
    grid-template-columns: 2fr 1fr;

    // ── Main area ────────────────────────────────────────────────────────
    &__main {
        @apply relative overflow-hidden rounded-2xl shadow-xl bg-background border-8 border-secondary/40;
        isolation: isolate;
    }
    &__main-inner {
        @apply absolute inset-0 w-full h-full;
    }
    &__media {
        @apply absolute inset-0 w-full h-full object-cover;
    }
    &__text-card {
        @apply flex flex-col gap-4 p-8 h-full justify-center;
        background: rgba(var(--color-tertiary));
        .slideshow__text-label {
            @apply text-xs font-bold font-comforta uppercase tracking-widest text-primary;
        }
        .slideshow__text-body {
            @apply text-white text-xl font-bold font-junegull leading-8;
        }
    }

    // ── Play / Pause ──────────────────────────────────────────────────────
    &__playbtn {
        @apply absolute top-3 left-3 z-20 flex items-center justify-center;
        @apply w-16 h-16 rounded-full transition-all duration-200;
        background: rgba(var(--color-tertiary), 0.7);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,0.2);
        color: #fff;
        i { @apply text-2xl leading-none; }
        &:hover {
            background: rgba(var(--color-primary));
        }
    }

    // ── Progress bar ──────────────────────────────────────────────────────
    &__progress {
        @apply absolute bottom-0 left-0 right-0 z-20;
        background: rgba(255,255,255,0.15);
    }
    &__progress-fill {
        @apply h-full;
        background-color: rgba(var(--color-primary));
        border-radius: 0 2px 2px 0;
        will-change: width;
    }

    // ── Queue ─────────────────────────────────────────────────────────────
    &__queue {
        @apply flex flex-col gap-2;
    }
    &__queue-inner {
        @apply flex flex-col gap-2 h-full;
    }
    &__thumb {
        @apply relative flex-1 overflow-hidden rounded-2xl shadow-lg cursor-pointer;
        min-height: 0;
        &:hover .slideshow__thumb-overlay { @apply opacity-100; }
    }
    &__thumb-media {
        @apply w-full h-full object-cover transition-transform duration-500;
    }
    &__thumb:hover &__thumb-media {
        transform: scale(1.06);
    }
    &__thumb-text {
        @apply flex flex-col gap-2 p-4 h-full justify-center;
        background: rgba(var(--color-tertiary));
        .slideshow__thumb-label {
            @apply text-xs font-bold font-comforta uppercase tracking-widest text-primary;
        }
        p { @apply text-white text-sm font-bold font-comforta leading-5; }
    }
    &__thumb-tint {
        @apply absolute inset-0 pointer-events-none rounded-2xl;
    }
    &__thumb-overlay {
        @apply absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 rounded-2xl;
        background: rgba(0, 0, 0, 0.3);
        i { @apply text-white text-3xl; }
    }
}

// ── Main swap transitions ──────────────────────────────────────────────────
.slide-up-enter-active {
    transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-up-leave-active {
    transition: opacity 0.35s cubic-bezier(0.55, 0, 1, 0.45),
                transform 0.35s cubic-bezier(0.55, 0, 1, 0.45);
}
.slide-up-enter-from { opacity: 0; transform: translateX(100%); }
.slide-up-leave-to   { opacity: 0; transform: translateX(-60px); }

// ── Queue transitions ──────────────────────────────────────────────────────
.queue-item-enter-active,
.queue-item-leave-active { transition: all 0.4s ease; }
.queue-item-enter-from   { opacity: 0; transform: translateY(20px); }
.queue-item-leave-to     { opacity: 0; transform: translateY(-20px); }
.queue-item-move         { transition: transform 0.4s ease; }
</style>
