<template lang="pug">
div
    a.img(href="/" @click.prevent="reload")
        img(src="~/assets/images/systems/logo.webp", alt="Olux Studio")
</template>

<script setup lang="ts">
const reload = () => {
	if (import.meta.client) window.location.assign('/')
}
</script>

<style scoped lang="scss">
.img{
    @apply flex justify-center w-[8rem] lg:w-44;
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
