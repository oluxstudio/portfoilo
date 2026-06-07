<template lang="pug">
a.click-btn.btn-style901(:href="href") {{ label }}
</template>

<script setup lang="ts">
defineProps({
  label: { type: String, default: 'Hover me' },
  href: { type: String, default: '#' },
})
</script>

<style lang="scss" scoped>
.btn-style901 {
  $btn-color: rgba(var(--color-primary));
  $btn-color1: rgba(var(--color-secondary));
  $padding: 10px 30px 10px 35px;

  position: relative;
  background-color: $btn-color;
  border-color: $btn-color1;
  color: #fff;
  overflow: hidden;
  padding: $padding;
    font-weight: bolder;

  &::before {
    width: 55px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    content: "\f4ff";
    font-family: "bootstrap-icons";
    font-size: 24px;
    font-weight: bolder;
    color: #3a0d22;
    display: flex;
    align-items: center;

    justify-content: center;
    text-indent: 0;
    border-radius: 0 50% 50% 0;
    background-color: rgba(245, 235, 233, 0.63);
    transform: translate(-20%, 0) scale(0, 1);
    transform-origin: left center;
    transition: all 0.25s;
    z-index: 1;
    box-shadow: 4px 0 10px 0 rgba(34, 7, 25, 0.73);
  }
  &:hover {
    text-indent: 20px;
    &::before {
      transform: translate(-15%, 0) scale(1, 1);
    }
  }
}
</style>
