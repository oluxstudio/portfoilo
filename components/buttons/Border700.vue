<template lang="pug">
a.click-btn.btn-style700(:href="href") {{ label }}
</template>
<script setup lang="ts">
defineProps({
    label: { type: String, default: 'Hover me' },
    href:  { type: String, default: '#' },
})
</script>
