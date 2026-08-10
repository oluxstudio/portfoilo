<template lang="pug">
div.text-center
    span.section-label {{ label }}
    h2.section-header {{ header }}
    p.text-maintext.leading-1.mt-3 {{ sub }}
    div.grid.grid-cols-1.gap-8.mt-14(class="sm:grid-cols-2 lg:grid-cols-3")
        div.team-card(v-for="(member, i) in team" :key="member.name" v-scroll-animate="'slide-up'" :style="`--anim-delay: ${i * 120}ms`")
            div.team-card__avatar
                span {{ member.initials }}
            div.team-card__name {{ member.name }}
            div.team-card__role {{ member.role }}
</template>

<script setup lang="ts">
const fallbackTeam = [
	{ name: 'Oluwaseun', role: 'Founder & Lead Developer', initials: 'O' },
	{ name: 'Design Lead', role: 'UI / UX Designer', initials: 'DL' },
	{ name: 'Dev Support', role: 'Frontend Engineer', initials: 'DS' },
]
const { attr, collection } = useCmsContent()
const label = attr('about_team_label', 'Team')
const header = attr('about_team_header', 'Meet the Studio')
const sub = attr('about_team_sub', 'Small team. Big impact. Direct access to the people building your project.')
const team = collection('team', fallbackTeam, d => ({
	name: String(d.name ?? ''),
	role: String(d.role ?? ''),
	initials: String(d.initials ?? ''),
}))
</script>

<style scoped lang="scss">
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
</style>
