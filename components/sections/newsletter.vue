<template lang="pug">
div
    div.page-label
        h3.subtitle {{ props.title }}
        h2.header Newsletter

    div.newsletter-wrapper.mt-20

        //- Left: copy
        div.newsletter-copy(v-scroll-animate="'slide-right'")
            span.feature-label {{ nlLabel }}
            h2.section-header  {{ nlHeading }}
                br
                span.text-primary  {{ nlAccent }}
            p.newsletter-copy__body {{ nlBody }}
            ul.newsletter-benefits
                li(v-for="b in benefits" :key="b")
                    i.bi.bi-check-circle-fill
                    span {{ b }}

        //- Right: form
        div.newsletter-form-wrap(v-scroll-animate="'slide-left'")
            div.newsletter-form-card(v-if="!submitted")
                h3.newsletter-form-card__title {{ nlFormTitle }}
                p.newsletter-form-card__sub {{ nlFormSub }}

                Form.newsletter-form(
                    @submit="onSubmit"
                    :validation-schema="schema"
                    @invalid-submit="onInvalidSubmit"
                )
                    div.flex.flex-col.gap-8
                        FormField(name="name"  label="Full Name"      type="text"  placeholder="Jane Smith"         required)
                        FormField(name="email"  label="Email Address"      type="email"  placeholder="jane@example.com"         required)

                    ButtonsSubmit(ref="submitButton" label="Subscribe")

                    p.newsletter-form__privacy
                        i.bi.bi-shield-lock
                        |  We respect your privacy. No spam, ever.

            //- Success state
            div.newsletter-success(v-else)
                div.newsletter-success__icon
                    i.bi.bi-envelope-check-fill
                h3.newsletter-success__title You're subscribed!
                p.newsletter-success__body Thanks for joining. Your first issue will arrive soon.
                button.newsletter-success__reset(@click="submitted = false") Subscribe another email
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps({
	title: { type: String, required: true },
})

const fallbackBenefits = [
	'Practical web design & dev tips',
	'Studio project case studies',
	'Industry news, curated weekly',
	'Exclusive offers for subscribers',
]

const { attr } = useCmsContent()
const nlLabel = attr('newsletter_label', 'Stay in the loop')
const nlHeading = attr('newsletter_heading', 'Web insights,')
const nlAccent = attr('newsletter_heading_accent', 'delivered weekly.')
const nlBody = attr('newsletter_body', 'Get practical articles on web design, development, and growing your business online — straight to your inbox. No spam, unsubscribe any time.')
const nlFormTitle = attr('newsletter_form_title', 'Join the newsletter')
const nlFormSub = attr('newsletter_form_sub', 'Enter your details below to start receiving updates.')
const nlBenefits = attr('newsletter_benefits')
const benefits = computed(() => {
	const fromCms = lines(nlBenefits.value)
	return fromCms.length ? fromCms : fallbackBenefits
})

const schema = yup.object({
	name: yup.string().required('Please enter your name').min(2, 'Name is too short'),
	email: yup.string().required('Please enter your email').email('Enter a valid email address'),
})

const submitButton = ref<any>(null)
const submitted = ref(false)

// Field names must match the "newsletter" form in scripts/create-cms-forms.mjs
const { submitCmsForm } = useCmsForms()

async function onSubmit(values: Record<string, string>, { setErrors }: { setErrors: (errors: Record<string, string | string[]>) => void }) {
	submitButton.value?.startLoading()
	try {
		await submitCmsForm('newsletter', values)
		submitButton.value?.showSuccess()
		setTimeout(() => { submitted.value = true }, 800)
	}
	catch (err) {
		if (err instanceof CmsFormError && Object.keys(err.fieldErrors).length) setErrors(err.fieldErrors)
		submitButton.value?.showError()
	}
}

function onInvalidSubmit() {}
</script>

<style scoped lang="scss">
// ── Wrapper ────────────────────────────────────────────────────────────────
.newsletter-wrapper {
    @apply grid grid-cols-1 gap-16;
    @apply lg:grid-cols-2 lg:items-center;
}

// ── Left copy ──────────────────────────────────────────────────────────────
.feature-label {
    @apply text-sm font-bold font-comforta uppercase tracking-widest text-primary;
}
.newsletter-copy {
    @apply flex flex-col gap-6;
    &__heading {
        @apply text-4xl font-extrabold font-junegull leading-tight text-foreground;
    }
    &__body {
        @apply text-maintext leading-8;
    }
}
.newsletter-benefits {
    @apply flex flex-col gap-3 mt-2;
    li {
        @apply flex items-center gap-3 text-maintext/80;
        i { @apply text-primary text-lg shrink-0; }
    }
}

// ── Form card ──────────────────────────────────────────────────────────────
.newsletter-form-card {
    @apply p-8 rounded-2xl border border-foreground/10 bg-foreground/5 flex flex-col gap-5;
    &__title { @apply text-2xl font-extrabold font-junegull text-maintext; }
    &__sub   { @apply text-sm text-maintext; }
}
.newsletter-form {
    @apply flex flex-col gap-5;
    &__privacy {
        @apply text-xs text-maintext text-center mt-1;
        i { @apply text-primary shrink  text-base; }
    }
}

// ── Fields ─────────────────────────────────────────────────────────────────
.field-group {
    @apply flex flex-col gap-1;
}
.field-label {
    @apply text-sm font-bold font-comforta text-maintext;
}
.field-input {
    @apply w-full px-4 py-3 rounded-lg border border-secondary/65 bg-background/10 text-maintext placeholder-maintext/30 text-base outline-none transition-colors duration-200;
    &:focus { @apply border-primary/60 ring-1 ring-primary/20; }
}
.field-error {
    @apply text-red-400 text-xs mt-0.5 font-comforta;
}

// ── Success state ──────────────────────────────────────────────────────────
.newsletter-success {
    @apply flex flex-col items-center gap-4 text-center py-12 px-8 rounded-2xl border border-foreground/10 bg-foreground/5;
    &__icon {
        @apply w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-3xl text-primary;
    }
    &__title { @apply text-2xl font-extrabold font-junegull text-maintext; }
    &__body  { @apply text-maintext leading-7; }
    &__reset {
        @apply mt-2 text-sm text-primary underline underline-offset-4 font-comforta font-bold;
        &:hover { @apply opacity-70; }
    }
}
</style>
