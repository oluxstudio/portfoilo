<template lang="pug">
a.glow-on-hover(:href="href") {{ label }}
</template>
<script setup lang="ts">
defineProps({
    label: { type: String, default: 'Hover me' },
    href:  { type: String, default: '#' },
})
</script>
