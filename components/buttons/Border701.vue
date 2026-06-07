<template lang="pug">
a.click-btn.btn-style701(:href="href")
    span {{ label }}
</template>
<script setup lang="ts">
defineProps({
    label: { type: String, default: 'Hover me' },
    href:  { type: String, default: '#' },
})
</script>
