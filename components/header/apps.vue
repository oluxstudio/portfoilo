<template lang="pug">
div
    div(class="lg:hidden")
        //- div.w-12
            IconList.text-black(code="menu")
    ul.flex.gap-2
        li.nav-item.font-extrabold.tracking-wider.text-lg.text-foreground.font-adam.uppercase
            a(href="http://localhost:8000/" target="_blank") CMS App
</template>

<script setup lang="ts">
import 'animate.css'

const menuStore = useMenuStore()
const route = useRoute()
// const router = useRouter()
const loadPage = (path: string) => {
	menuStore.isActive(path)
	menuStore.loadPage(path)
}
</script>

<style scoped lang="scss">
.active{
    @apply text-primary;
    text-shadow: 0 1px 2px currentColor;
}
.nav-item{
    width: 100%;
    height: 100%;
    display: block;
    a{
        display: block;
        padding: 20px;
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
</style>
