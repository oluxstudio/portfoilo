<template lang="pug">
div
    ul.nav-menu-box
        li.nav-item.font-extrabold.tracking-wider.text-base.font-adam.uppercase(v-for="item in menuStore.menu" :key="item.label" :class="{'active': item.active===true}")
            a(:href="item.path" @click.prevent.stop="loadPage(item.path)") {{ item.label }}
</template>

<script setup lang="ts">
import 'animate.css'

const menuStore = useMenuStore()
const route = useRoute()

const loadPage = (path: string) => {
	menuStore.isActive(path)
	menuStore.loadPage(path)
}

menuStore.isActive(route.fullPath)
</script>

<style scoped lang="scss">
.nav-menu-box{
	border-radius: 4rem;
	box-shadow: 5px -4px 2px 6px rgba(0, 0, 0, 0.1) inset;
	@apply flex gap-1 bg-foreground/75 px-2 py-2;
}
.nav-item{
    width: 100%;
    height: 100%;
    display: block;
	@apply text-background;

    a{
        display: block;
        padding: 5px 20px;
        &:hover{
            animation: heartBeat;
            animation-duration: 1s; /* don't forget to set a duration! */
        }
    }
    // &:hover{
    //     animation: bounceIn;
    //     animation-duration: 1s; /* don't forget to set a duration! */
    // }
}
.active{
    @apply text-primary !important;
    text-shadow: 0 1px 2px currentColor;
}
</style>
