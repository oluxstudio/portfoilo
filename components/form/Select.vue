<template lang="pug">
div.form-field
    label.form-field__label(v-if="label" :for="name")
        | {{ label }}
        span.form-field__required(v-if="required") *
    div.form-field__select-wrap
        select.form-field__input(
            :id="name"
            :name="name"
            :value="value"
            :disabled="disabled"
            :class="{ 'form-field__input--error': errorMessage }"
            @change="handleChange"
            @blur="handleBlur"
        )
            option(value="" disabled) {{ placeholder || 'Select an option' }}
            option(
                v-for="opt in options"
                :key="typeof opt === 'string' ? opt : opt.value"
                :value="typeof opt === 'string' ? opt : opt.value"
            ) {{ typeof opt === 'string' ? opt : opt.label }}
        i.bi.bi-chevron-down.form-field__chevron
    Transition(name="err")
        span.form-field__error(v-if="errorMessage")
            i.bi.bi-exclamation-circle-fill
            |  {{ errorMessage }}
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
    name: string
    label?: string
    options: Array<string | { label: string; value: string }>
    placeholder?: string
    required?: boolean
    disabled?: boolean
    rules?: any
}>()

const { value, errorMessage, handleChange, handleBlur } = useField(() => props.name, props.rules)
</script>

<style scoped lang="scss">
.form-field {
    @apply flex flex-col gap-1.5;

    &__label {
        @apply text-sm font-bold font-comforta text-foreground/80;
    }
    &__required {
        @apply text-primary ml-0.5;
    }
    &__select-wrap {
        @apply relative;
    }
    &__input {
        @apply w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-foreground/15 bg-background;
        @apply text-foreground text-sm outline-none cursor-pointer;
        @apply transition-all duration-200;

        &:focus {
            @apply border-primary/60 ring-2 ring-primary/15;
        }
        &:disabled {
            @apply opacity-50 cursor-not-allowed;
        }
        &--error {
            @apply border-primary/60 ring-2 ring-primary/10;
        }
    }
    &__chevron {
        @apply absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none text-sm;
    }
    &__error {
        @apply text-primary text-xs font-comforta font-bold flex items-center gap-1;
        i { @apply text-xs; }
    }
}

.err-enter-active, .err-leave-active { transition: all 0.2s ease; }
.err-enter-from, .err-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
