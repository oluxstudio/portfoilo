<template lang="pug">
div
    div.page-label
        h3.subtitle {{ subtitle }}
        h2.header About

    //- ── Intro collage + headline ──────────────────────────────────────────
    div.mt-20
        AboutIntro

    //- ── Mission statement ────────────────────────────────────────────────
    div.mt-24
        AboutMission

    //- ── Stats bar ────────────────────────────────────────────────────────
    div.mt-20
        AboutStats

    //- ── Team section ─────────────────────────────────────────────────────
    div.mt-28
        AboutTeam

    //- ── FAQ section ──────────────────────────────────────────────────────
    div.mt-28
        AboutFaq

    //- ── CTA strip ────────────────────────────────────────────────────────
    div.mt-28
        AboutCta
</template>

<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: () => 'About Us',
	},
})

const { attr } = useCmsContent()
const subtitle = attr('about_subtitle', props.title)
</script>
