<template lang="pug">
div
    div.page-label
        h3.subtitle Get in touch
        h2.header Contact

    div.contact-wrapper.mt-20

        //- Left: info
        div.contact-info
            span.feature-label {{ contactLabel }}
            h2.section-header {{ contactHeading }}
            p.contact-info__body {{ intro }}

            div.contact-tiles
                div.contact-tile(v-for="tile in tiles" :key="tile.label")
                    div.contact-tile__icon
                        i.bi(:class="tile.icon")
                    div
                        div.contact-tile__label {{ tile.label }}
                        div.contact-tile__value {{ tile.value }}

            div.contact-social
                a.contact-social__link(
                    v-for="s in socials"
                    :key="s.label"
                    :href="s.href"
                    target="_blank"
                    :title="s.label"
                )
                    i.bi(:class="s.icon")

        //- Right: form
        div.contact-form-wrap

            div(v-if="!submitted")
                FormWrap(
                    ref="formRef"
                    :schema="schema"
                    :handler="onSubmit"
                    submit-label="Send Message"
                    note="Your information is kept private and never shared."
                )
                    div.form-row
                        FormField(name="name"  label="Full Name"      type="text"  placeholder="Jane Smith"         required)
                        FormField(name="email" label="Email Address"  type="email" placeholder="jane@example.com"   required)
                    FormField(name="subject" label="Subject"   type="text"     placeholder="New website project"      required)
                    FormField(name="message" label="Message"   type="textarea" placeholder="Tell us about your project, goals, and timeline..." :rows="5" required)

            //- Success state
            div.contact-success(v-else)
                div.contact-success__icon
                    i.bi.bi-send-check-fill
                h3.contact-success__title Message sent!
                p.contact-success__body Thanks for reaching out. We'll review your message and get back to you within one working day.
                button.contact-success__reset(@click="submitted = false") Send another message
</template>

<script setup lang="ts">
import * as yup from 'yup'

const schema = yup.object({
	name: yup.string().required('Full name is required').min(2, 'Name is too short'),
	email: yup.string().required('Email address is required').email('Enter a valid email'),
	subject: yup.string().required('Subject is required').min(3, 'Subject is too short'),
	message: yup.string().required('Message is required').min(20, 'Please write a bit more detail'),
})

const fallbackTiles = [
	{ icon: 'bi-envelope-fill', label: 'Email', value: 'contact@oluxstudio.com' },
	{ icon: 'bi-telephone-fill', label: 'Phone', value: '+44 78 2768 5736' },
	{ icon: 'bi-geo-alt-fill', label: 'Location', value: 'Blackburn, Lancashire, UK' },
	{ icon: 'bi-clock-fill', label: 'Response', value: 'Within 1 working day' },
]

const fallbackSocials = [
	{ label: 'LinkedIn', icon: 'bi-linkedin', href: '#' },
	{ label: 'GitHub', icon: 'bi-github', href: '#' },
	{ label: 'Twitter/X', icon: 'bi-twitter-x', href: '#' },
	{ label: 'Instagram', icon: 'bi-instagram', href: '#' },
]

const { collection, attr } = useCmsContent()
const tiles = collection('contact-info', fallbackTiles, d => ({
	icon: String(d.icon ?? ''),
	label: String(d.label ?? ''),
	value: String(d.value ?? ''),
}))
const socials = collection('socials', fallbackSocials, d => ({
	label: String(d.label ?? ''),
	icon: String(d.icon ?? ''),
	href: String(d.href || '#'),
}))
const intro = attr('contact_intro', 'Whether you have a brief ready or just an idea, we\'d love to hear from you. Fill in the form and we\'ll get back to you within one working day.')
const contactLabel = attr('contact_label', "Let's talk")
const contactHeading = attr('contact_heading', "Have a project in mind? Let's build it.")

const submitted = ref(false)
const formRef = ref<any>(null)

// Pre-fill subject from other sections (e.g. services "Get in touch")
const { subject, clear } = useContactPrefill()
watch(subject, (val) => {
	if (!val) return
	setTimeout(() => {
		formRef.value?.setFieldValue('subject', val)
		clear()
	}, 300)
})

// Field names must match the "contact" form in scripts/create-cms-forms.mjs
const { submitCmsForm } = useCmsForms()

async function onSubmit(values: Record<string, string>) {
	await submitCmsForm('contact', values)
	setTimeout(() => { submitted.value = true }, 600)
}

function onInvalidSubmit() {}
</script>

<style scoped lang="scss">
// ── Layout ─────────────────────────────────────────────────────────────────
.contact-wrapper {
    @apply grid grid-cols-1 gap-16;
    @apply lg:grid-cols-2 lg:items-start;
}

// ── Left: info ─────────────────────────────────────────────────────────────
.feature-label {
    @apply text-sm font-bold font-comforta uppercase tracking-widest text-primary;
}
.contact-info {
    @apply flex flex-col gap-6;
    &__heading {
        @apply text-4xl font-extrabold font-junegull leading-tight text-maintext;
    }
    &__body {
        @apply text-maintext leading-8;
    }
}
.contact-tiles {
    @apply grid grid-cols-1 gap-4 mt-2;
    @apply sm:grid-cols-2;
}
.contact-tile {
    @apply flex items-start gap-4 p-4 rounded-xl border border-primary/20 bg-foreground/75;
    &__icon {
        @apply w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-lg shrink-0;
    }
    &__label { @apply text-xs font-bold font-comforta uppercase tracking-wider text-maintext; }
    &__value { @apply font-bold font-comforta text-maintext text-sm mt-0.5; }
}
.contact-social {
    @apply flex gap-3 mt-2;
    &__link {
        @apply w-10 h-10 rounded-full border border-foreground/95 flex items-center justify-center text-maintext text-lg transition-all duration-200;
        &:hover { @apply border-primary text-primary; }
    }
}

// ── Right: form ────────────────────────────────────────────────────────────
.form-row {
    @apply grid grid-cols-1 gap-5;
    @apply sm:grid-cols-2;
}

// ── Success state ──────────────────────────────────────────────────────────
.contact-success {
    @apply flex flex-col items-center gap-4 text-center py-16 px-8 rounded-2xl border border-foreground/10 bg-foreground/5;
    &__icon {
        @apply w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-3xl text-primary;
    }
    &__title { @apply text-2xl font-extrabold font-junegull text-maintext; }
    &__body  { @apply text-maintext leading-7 max-w-sm; }
    &__reset {
        @apply mt-2 text-sm text-primary underline underline-offset-4 font-comforta font-bold;
        &:hover { @apply opacity-70; }
    }
}
</style>
