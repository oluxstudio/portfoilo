<!-- components/Typewriter.vue -->
<template>
    <h1 class="typewriter">
      <span class="text">{{ currentText }}</span>
      <span class="cursor" :class="{ blinking: isTyping }">|</span>
    </h1>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  
  const props = defineProps({
    words: {
      type: Array,
      required: true,
      default: () => ['Nuxt 3', 'Vue.js', 'Awesome']
    },
    typingSpeed: {
      type: Number,
      default: 100
    },
    deletingSpeed: {
      type: Number,
      default: 50
    },
    pauseTime: {
      type: Number,
      default: 1500
    }
  })
  
  const currentText = ref('')
  const currentWordIndex = ref(0)
  const isDeleting = ref(false)
  const isTyping = ref(true)
  
  let timer = null
  
  const type = () => {
    const currentWord = props.words[currentWordIndex.value]
    
    if (isDeleting.value) {
      // Delete character
      currentText.value = currentWord.substring(0, currentText.value.length - 1)
    } else {
      // Add character
      currentText.value = currentWord.substring(0, currentText.value.length + 1)
    }
  
    // Set typing speed
    let typeSpeed = props.typingSpeed
    if (isDeleting.value) {
      typeSpeed = props.deletingSpeed
    }
  
    // Check if word is complete
    if (!isDeleting.value && currentText.value === currentWord) {
      typeSpeed = props.pauseTime
      isDeleting.value = true
    } else if (isDeleting.value && currentText.value === '') {
      isDeleting.value = false
      currentWordIndex.value = (currentWordIndex.value + 1) % props.words.length
      typeSpeed = props.typingSpeed
    }
  
    timer = setTimeout(() => type(), typeSpeed)
  }
  
  onMounted(() => {
    type()
  })
  
  onBeforeUnmount(() => {
    clearTimeout(timer)
  })
  </script>
  
  <style scoped>
  .typewriter {
    display: inline-block;
    @apply font-junegull;
  }
  
  .cursor {
    margin-left: 2px;
    opacity: 1;
  }
  
  .blinking {
    animation: blink 0.7s infinite;
  }
  
  @keyframes blink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  </style>