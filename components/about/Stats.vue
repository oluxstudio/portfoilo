<template lang="pug">
div.stats-bar
    div.stats-bar__item(v-for="(stat, i) in stats" :key="stat.label" v-scroll-animate="'slide-up'" :style="`--anim-delay: ${i * 100}ms`")
        div.stats-bar__value {{ stat.value }}
        div.stats-bar__label {{ stat.label }}
</template>

<script setup lang="ts">
const fallbackStats = [
	{ value: '50+', label: 'Projects Delivered' },
	{ value: '30+', label: 'Happy Clients' },
	{ value: '5+', label: 'Years Experience' },
	{ value: '100%', label: 'On-Time Delivery' },
]
const { collection } = useCmsContent()
const stats = collection('stats', fallbackStats, d => ({
	value: String(d.value ?? ''),
	label: String(d.label ?? ''),
}))
</script>

<style scoped lang="scss">
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
</style>
