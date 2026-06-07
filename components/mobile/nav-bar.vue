<template lang="pug">
div
    div(class="lg:hidden")
        //- div.w-12
            IconList.text-black(code="menu")
    ul.grid.gap-2
        li.nav-item.font-extrabold.tracking-wider.text-lg.text-foreground.font-adam.uppercase(v-for="item in menuStore.menu" :key="item.label" :class="{'active': item.active===true}")
            a(:href="item.path" @click.prevent.stop="loadPage(item.path)") {{ item.label }}
</template>
<script setup lang="ts">
import 'animate.css';
const menuStore = useMenuStore()
const route = useRoute()
const loadPage = (path:string) => {
    menuStore.loadPage(path)
    menuStore.toggleMenu()
}
</script>