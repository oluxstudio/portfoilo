<template lang="pug">
div
    NuxtLink.img(to="/") 
        img(src="~/assets/images/systems/logo.svg", alt="Olux Studio")
</template>
<style scoped lang="scss">
.img{
    @apply block w-44;
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>