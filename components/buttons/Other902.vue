<template lang="pug">
a.click-btn.btn-style902(:href="href")
    div.block
        span
    span(data-name="hover") {{ hoverWord }}
    span(data-name="me")    {{ meWord }}
</template>
<script setup lang="ts">
defineProps({
    hoverWord: { type: String, default: 'Hover' },
    meWord:    { type: String, default: 'me' },
    href:      { type: String, default: '#' },
})
</script>
