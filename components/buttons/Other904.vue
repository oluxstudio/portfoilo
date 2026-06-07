<template lang="pug">
a.click-btn.btn-style904(:href="href" :data-hover="dataHover")
    span {{ label }}
</template>
<script setup lang="ts">
defineProps({
    label:     { type: String, default: 'Hover me' },
    href:      { type: String, default: '#' },
    dataHover: { type: String, default: 'Click me!' },
})
</script>
