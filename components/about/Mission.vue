<template lang="pug">
div.text-center.max-w-3xl.mx-auto(v-scroll-animate="'fade'")
    p.text-xl.leading-10.font-garet {{ mission }}
</template>

<script setup lang="ts">
// CMS-driven mission statement; falls back to the original copy.
const { attr } = useCmsContent()
const mission = attr(
	'about_mission',
	'We are on a mission to help businesses reach their full potential through smarter and more purposeful web experiences built for the modern world.',
)
</script>
