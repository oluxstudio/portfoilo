<template lang="pug">
form.form-wrap(@submit.prevent="onSubmit")
    slot
    div.form-wrap__footer(v-if="!hideSubmit")
        ButtonsSubmit(ref="submitRef" :label="submitLabel")
        p.form-wrap__note(v-if="note")
            i.bi.bi-lock-fill
            |  {{ note }}
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'

const props = withDefaults(defineProps<{
    schema?: any
    submitLabel?: string
    note?: string
    hideSubmit?: boolean
    handler?: (values: Record<string, any>) => Promise<void>
}>(), {
    submitLabel: 'Send',
    note: '',
    hideSubmit: false,
})

const emit = defineEmits<{
    submit: [values: Record<string, any>, done: () => void, fail: () => void]
}>()

const { handleSubmit, setFieldValue, resetForm } = useForm({
    validationSchema: props.schema,
})

const submitRef = ref<any>(null)

const onSubmit = handleSubmit(async (values) => {
    submitRef.value?.startLoading()
    try {
        if (props.handler) {
            await props.handler(values)
        } else {
            await new Promise<void>((resolve, reject) => {
                emit('submit', values, resolve, reject)
            })
        }
        submitRef.value?.showSuccess()
    } catch {
        submitRef.value?.showError()
    }
})

defineExpose({ setFieldValue, resetForm })
</script>

<style scoped lang="scss">
.form-wrap {
    @apply flex flex-col gap-5 w-full;

    &__footer {
        @apply flex flex-col gap-2 mt-1;
    }
    &__note {
        @apply text-xs text-foreground/40 text-center;
        i { @apply mr-1; }
    }
}
</style>
