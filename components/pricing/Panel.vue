<template lang="pug">
div.panel
    //- Close button
    button.panel__close(@click="$emit('close')" aria-label="Close")
        i.bi.bi-arrow-left
        span Back to Pricing

    div.panel__body
        //- Package card
        div.panel__card
            div.panel__card-badge(v-if="plan.featured") Most Popular
            h3.panel__card-name {{ plan.name }}
            div.panel__card-price
                span.panel__card-currency(v-if="!isNaN(Number(plan.price.replace(',','')))") £
                span.panel__card-amount {{ plan.price }}
            p.panel__card-desc {{ plan.description }}
            ul.panel__card-features
                li(v-for="feature in plan.features" :key="feature")
                    i.bi.bi-check-circle-fill
                    span {{ feature }}

        //- Inquiry form
        div.panel__form
            h3.panel__form-title Start your project
            p.panel__form-sub Fill in your details and we'll get back to you within 24 hours.
            form.panel__form-fields(@submit.prevent="submit")
                div.field
                    label.field__label Full Name
                    input.field__input(v-model="form.name" type="text" placeholder="Jane Smith" required)
                div.field
                    label.field__label Email Address
                    input.field__input(v-model="form.email" type="email" placeholder="jane@example.com" required)
                div.field
                    label.field__label Phone (optional)
                    input.field__input(v-model="form.phone" type="tel" placeholder="+44 000 000 0000")
                div.field
                    label.field__label Website (if you have one)
                    input.field__input(v-model="form.website" type="url" placeholder="https://yoursite.com")
                div.field
                    label.field__label Tell us about your project
                    textarea.field__input.field__input--textarea(v-model="form.message" rows="4" placeholder="Brief description of what you need..." required)
                div.field
                    label.field__label Selected package
                    input.field__input(type="text" :value="plan.name" disabled)
                p.panel__form-error(v-if="errorMsg") {{ errorMsg }}
                button.panel__submit(type="submit" :disabled="submitted || sending")
                    span(v-if="sending") Sending…
                    span(v-else-if="!submitted") Send enquiry
                    span(v-else)
                        i.bi.bi-check-lg
                        |  Sent! We'll be in touch.
</template>

<script setup lang="ts">
interface PricingPlan {
	name: string
	price: string
	period?: string
	description: string
	features: string[]
	cta: string
	featured: boolean
}

const props = defineProps<{ plan: PricingPlan }>()
defineEmits(['close'])

const form = reactive({
	name: '',
	email: '',
	phone: '',
	website: '',
	message: '',
})

const submitted = ref(false)
const sending = ref(false)
const errorMsg = ref('')

// Field names must match the "quote" form in scripts/create-cms-forms.mjs
const { submitCmsForm } = useCmsForms()

const submit = async () => {
	sending.value = true
	errorMsg.value = ''
	try {
		await submitCmsForm('quote', { ...form, plan: props.plan.name })
		submitted.value = true
	}
	catch (err) {
		errorMsg.value = err instanceof CmsFormError
			? ((Object.values(err.fieldErrors).flat()[0] as string) ?? err.message)
			: 'Something went wrong — please try again.'
	}
	finally {
		sending.value = false
	}
}
</script>

<style scoped lang="scss">
.panel {
    @apply w-full;

    &__close {
        // @apply flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary text-sm font-bold font-comforta text-foreground transition-all duration-200 mb-10;
        // &:hover { @apply border-secondary bg-primary text-white; }

        @apply inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary text-primary font-bold font-comforta text-sm uppercase tracking-wider transition-all duration-200 self-start;
        &:hover { @apply bg-primary text-white; }
        i { @apply text-base; }
    }

    &__body {
        @apply grid grid-cols-1 gap-10;
        @apply lg:grid-cols-2 lg:gap-16 lg:items-start;
    }

    // ── Package card ──────────────────────────────────────────────────────
    &__card {
        @apply relative flex flex-col gap-4 p-8 rounded-2xl border border-secondary/90 bg-foreground/85 mt-10;
    }
    &__card-badge {
        @apply absolute -top-3 left-6 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full font-comforta uppercase tracking-wider;
    }
    &__card-name {
        @apply text-2xl font-extrabold font-junegull text-maintext uppercase tracking-wide;
    }
    &__card-price {
        @apply flex items-end gap-1 mt-2;
    }
    &__card-currency {
        @apply text-3xl font-bold text-primary mb-1;
    }
    &__card-amount {
        @apply text-5xl font-extrabold font-junegull text-maintext;
    }
    &__card-desc {
        @apply text-maintext leading-7 text-sm;
    }
    &__card-features {
        @apply flex flex-col gap-3 mt-2;
        li {
            @apply flex items-start gap-3 text-sm text-maintext;
            i { @apply text-primary text-base mt-0.5 shrink-0; }
        }
    }

    // ── Form ──────────────────────────────────────────────────────────────
    &__form {
        @apply flex flex-col gap-4;
    }
    &__form-title {
        @apply text-2xl font-extrabold font-junegull text-maintext;
    }
    &__form-sub {
        @apply text-sm text-maintext leading-6 -mt-2;
    }
    &__form-fields {
        @apply flex flex-col gap-4 mt-2;
    }
    &__form-error {
        @apply text-red-400 text-sm font-comforta;
    }
    &__submit {
        @apply w-full py-3 rounded-xl bg-primary text-white font-bold font-comforta uppercase tracking-wider transition-all duration-200 mt-2;
        &:hover:not(:disabled) { @apply bg-primary/80; }
        &:disabled { @apply opacity-70 cursor-not-allowed; }
    }
}

// ── Form fields ────────────────────────────────────────────────────────────
.field {
    @apply flex flex-col gap-1.5;
    &__label {
        @apply text-xs font-bold font-comforta uppercase tracking-wider text-maintext;
    }
    &__input {
        @apply w-full px-4 py-3 rounded-xl border border-secondary/30 bg-foreground text-maintext text-sm outline-none transition-all duration-200;
        &:focus { @apply border-primary/50 bg-background/90 text-foreground; }
        &:disabled { @apply opacity-50 cursor-not-allowed; }
        &--textarea { @apply resize-none; }
    }
}
</style>
