<template>
  <div class="w-full">
    <button class="btn-flip" :data-back="back" :data-front="front"></button>
  </div>
</template>

<script setup lang="ts">
const { front = 'Front', back = 'Back' } = defineProps<{
  front?: string
  back?: string
}>()
</script>

<style lang="scss" scoped>
$speed: 0.5s;
$color-primary: rgba(var(--color-primary));
$color-secondary: rgba(var(--color-secondary));
$color-tertiary: rgba(var(--color-tertiary));
$padding: 14px 30px;

.btn-flip{
    opacity: 1;
    outline: 0;
    color: #fff;
    line-height: 40px;
    position: relative;
    text-align: center;
    letter-spacing: 1px;
    display: block;
    width: 100%;
    border-radius: 5px;
    overflow: hidden;

    &:hover{
        &:after{
            opacity: 1;
            transform: translateY(0) rotateX(0);
        }
        &:before{
            opacity: 0;
            transform: translateY(50%) rotateX(90deg);
        }
    }
    &:after{
        top: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        color: #ffffff;
        display: block;
        transition: $speed;
        position: absolute;
        background: $color-tertiary;
        content: attr(data-back);
        transform: translateY(-50%) rotateX(90deg);
        padding: $padding;
        @apply font-adam text-xl lg:text-2xl font-bold rounded-md;

    }
    &:before{
        top: 0;
        left: 0;
        opacity: 1;
        color: #e3e3e4;
        display: block;
        padding: 0 30px;
        line-height: 40px;
        transition: $speed;
        position: relative;
        background: $color-primary;
        content: attr(data-front);
        transform: translateY(0) rotateX(0);
        padding: $padding;
        @apply font-adam text-xl lg:text-2xl font-bold rounded-md;

    }
}
</style>
