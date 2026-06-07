<template>
  <button
    class="loading-btn"
    :class="{ onclic: isLoading, validate: isSuccess }"
    :disabled="isLoading || isSuccess"
    type="submit"
  >
    <span class="btn-text">
      {{ isSuccess ? 'Success!' : isLoading ? 'Processing...' : 'Submit' }}
      <i class="bi bi-check-lg" />
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(false)
const isSuccess = ref(false)

// Expose methods so parent can control the button state
defineExpose({
  startLoading() {
    isLoading.value = true
    isSuccess.value = false
    console.log('Loading...')
  },
  showSuccess() {
    isLoading.value = false
    isSuccess.value = true

    // Reset after showing success
    setTimeout(() => {
      isSuccess.value = false
    }, 31250)
  },
  /*
        */
  showError() {
    isLoading.value = false
    isSuccess.value = false
  },
  reset() {
    isLoading.value = false
    isSuccess.value = false
  },
})
/*
  function handleClick() {
    if (isLoading.value || isSuccess.value) return

    // ── Phase 1: onclic ──
    isLoading.value = true

    // Simulate long processing (like original 2250ms)
    setTimeout(() => {
      // ── Phase 2: validate / success ──
      isLoading.value = false
      isSuccess.value = true

      // Show success for ~1250ms (like original)
      setTimeout(() => {
        // ── Phase 3: reset ──
        isSuccess.value = false
      }, 1250)
    }, 2250)
  }
  */
</script>

<style lang="scss" scoped>
    $default: rgba(var(--color-overlay1));
    $pri-color: rgba(var(--color-primary));
    $suc-color: rgba(var(--color-secondary));
    .loading-btn {
        position: relative;
        width: 100%;
        height: 56px;
        border: none;
        border-radius: 28px;
        background: $pri-color;
        border: 2px solid $pri-color;
        color: white;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.4s ease;
        &:hover {
            color:var(--color-primary);
            background: transparent;
        }
        &:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }

        .btn-text {
            transition: opacity 0.35s;
            display: block;
            text-align: center;
            padding: 0 20px;
        }
    }

    /* ── onclic state ── */
    .onclic {
        width: 56px !important;
        border-radius: 15rem !important;
        border-width:5px;
        font-size:0;
        border-color:$default;
        border-left-color:$pri-color;
        animation: rotate 2.2s 0.25s linear infinite;
    }

    .onclic .btn-text {
        opacity: 0;
    }

    /* ── validate / success state ── */
    .validate {
        background: $suc-color !important;
        width: 156px !important;
        border-radius: 50pt !important;
        color: white;
        &::after {
            content: "✓";
            padding-right: 15px !important;
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: end;
            font-size: 32px;
            color: white;
        }

        .btn-text {
            transition: opacity 0.35s;
            display: block;
            text-align: start;
            padding: 0 20px;
        }
    }

    /* Optional spinning animation during loading */
    @keyframes rotate {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
