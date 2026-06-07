<template lang="pug">
button.click-btn.btn-style906.py-4(:href="href" :data-hover="dataHover")
    slot
</template>

<script setup lang="ts">
defineProps({
  label: { type: String, default: 'Hover me' },
  href: { type: String, default: '#' },
  dataHover: { type: String, default: 'Click me!' },
})
</script>
