<template lang="pug">
div.form-field
    label.form-field__label(v-if="label" :for="fieldId")
        | {{ label }}
        span.form-field__required(v-if="required") *
    //- Textarea
    textarea.form-field__input(
        v-if="type === 'textarea'"
        :id="fieldId"
        :name="name"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        :class="{ 'form-field__input--error': errorMessage }"
        @input="handleChange"
        @blur="handleBlur"
    )
    //- Regular input
    input.form-field__input(
        v-else
        :id="fieldId"
        :type="type"
        :name="name"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="{ 'form-field__input--error': errorMessage }"
        @input="handleChange"
        @blur="handleBlur"
    )
    Transition(name="err")
        span.form-field__error(v-if="errorMessage")
            i.bi.bi-exclamation-circle-fill
            |  {{ errorMessage }}
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'

const props = withDefaults(defineProps<{
	name: string
	label?: string
	type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number' | 'textarea'
	placeholder?: string
	required?: boolean
	disabled?: boolean
	rows?: number
	rules?: any
	id?: string
}>(), {
	type: 'text',
	rows: 4,
})

const fieldId = computed(() => props.id ?? props.name)

const { value, errorMessage, handleChange, handleBlur } = useField(() => props.name, props.rules)
</script>

<style scoped lang="scss">
.form-field {
    @apply flex flex-col gap-1.5;

    &__label {
        @apply text-sm font-bold font-comforta text-maintext;
    }
    &__required {
        @apply text-primary ml-0.5;
    }
    &__input {
  		background-color: color-mix(in hsl, rgb(var(--color-overlay)), rgba(255, 255, 255, .9)60%);

        @apply w-full px-4 py-3 rounded-xl border border-primary/85;
        @apply text-maintext placeholder-foreground/35 text-sm outline-none;
        @apply transition-all duration-200 resize-none;

        &:focus {
            @apply border-primary/60 ring-2 ring-primary/15 bg-background/90 text-foreground;;
        }
        &:disabled {
            @apply opacity-50 cursor-not-allowed;
        }
        &--error {
            @apply border-primary/60 ring-2 ring-primary/10;
        }
    }
    &__error {
        @apply text-primary text-xs font-comforta font-bold flex items-center gap-1;
        i { @apply text-xs; }
    }
}

// ── Error transition ────────────────────────────────────────────────────────
.err-enter-active, .err-leave-active { transition: all 0.2s ease; }
.err-enter-from, .err-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
