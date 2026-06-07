<template lang="pug">
div.social-box.flex.z-1.items-center.text-maintext(class="hidden lg:flex")
    div.label.font-adam Follow Us on
    ul.icon-list.flex.flex.gap-4.items-center.flex-col
        li.icon.w-4(v-for="item in socialMedia" :key="item.label")
            IconList(:code="item.icon")
            //- a(:href="item.path") {{ item.label }}
</template>

<script setup lang="ts">
const socialMedia = [
	{ label: 'facebook', icon: 'facebook' },
	{ label: 'X', icon: 'twitter' },
	{ label: 'instagram', icon: 'instagram' },
	{ label: 'linkedin', icon: 'linkedin' },
	{ label: 'github', icon: 'github' },
]
</script>

<style scoped lang="scss">
.social-box{
    position: fixed;
    left: .7rem;
    top: 50%;
    z-index: 1;
    .label{
        padding-right: 60px;
        position: absolute;
        bottom: 100%;
        right: 0;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        height: 24px;
        white-space: nowrap;
        transform-origin: 100% 0;
        text-align: right;
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        &::after{
            content: '';
            position: absolute;
            @apply bg-overlay1;
            top: 50%;
            right: 0;
            width: 40px;
            height: 1px;
        }
    }
    .icon-list{
        position: relative;
        right: 4px;
        top: 1px;
        // transform: rotate(90deg);
        // -webkit-transform: rotate(90deg);
    }
}
</style>
