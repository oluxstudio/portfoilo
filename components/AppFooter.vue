<template lang="pug">
footer.site-footer
    div.site-footer__inner

        //- Top grid
        div.footer-grid

            //- Brand column
            div.footer-col(v-scroll-animate="'slide-up'" style="--anim-delay: 0ms")
                NuxtLink(to="/")
                    img.footer-logo(src="~/assets/images/systems/logo.webp" alt="Olux Studio")
                p.footer-brand__tagline {{ tagline }}
                div.footer-social
                    a.footer-social__link(
                        v-for="s in socials"
                        :key="s.label"
                        :href="s.href"
                        :title="s.label"
                        target="_blank"
                    )
                        i.bi(:class="s.icon")

            //- Company links
            div.footer-col(v-scroll-animate="'slide-up'" style="--anim-delay: 100ms")
                div.footer-col__heading Company
                ul.footer-links
                    li(v-for="link in companyLinks" :key="link.label")
                        a.footer-link(:href="link.href" @click.prevent="navigate(link.href)") {{ link.label }}

            //- Services links
            div.footer-col(v-scroll-animate="'slide-up'" style="--anim-delay: 200ms")
                div.footer-col__heading Services
                ul.footer-links
                    li(v-for="s in serviceLinks" :key="s")
                        span.footer-link--plain {{ s }}

            //- Contact info
            div.footer-col(v-scroll-animate="'slide-up'" style="--anim-delay: 300ms")
                div.footer-col__heading Get in Touch
                ul.footer-contact
                    li(v-for="item in contactInfo" :key="item.label")
                        i.bi(:class="item.icon")
                        div
                            div.footer-contact__label {{ item.label }}
                            div.footer-contact__value {{ item.value }}
                div.mt-6
                    a(href="#contact" @click.prevent="navigate('/contact')")
                        button.footer-cta Start a project

        //- Divider
        div.footer-divider

        //- Bottom bar
        div.footer-bottom
            p.footer-bottom__copy © {{ year }} Olux Studio. All rights reserved.
            p.footer-bottom__built
                | Designed &amp; built by&nbsp;
                span.text-primary Olux Studio
                |  · Blackburn, UK
</template>

<script setup lang="ts">
const menuStore = useMenuStore()
const year = new Date().getFullYear()

const navigate = (path: string) => {
    menuStore.isActive(path)
    menuStore.loadPage(path)
}

const fallbackSocials = [
    { label: 'LinkedIn',  icon: 'bi-linkedin',  href: '#' },
    { label: 'GitHub',    icon: 'bi-github',    href: '#' },
    { label: 'Twitter/X', icon: 'bi-twitter-x', href: '#' },
    { label: 'Instagram', icon: 'bi-instagram', href: '#' },
]

const companyLinks = [
    { label: 'Home',          href: '/'            },
    { label: 'About',         href: '/about'        },
    { label: 'Services',      href: '/services'     },
    { label: 'Portfolio',     href: '/portfolio'    },
    { label: 'Blog',          href: '/blog'         },
    { label: 'Testimonials',  href: '/testimonials' },
    { label: 'Contact',       href: '/contact'      },
]

const fallbackServiceLinks = [
    'Custom Website Design',
    'Responsive Development',
    'E-Commerce Solutions',
    'CMS Integration',
    'SEO & Performance',
    'Ongoing Support',
]

const fallbackContactInfo = [
    { icon: 'bi-envelope-fill',  label: 'Email',    value: 'contact@oluxstudio.com' },
    { icon: 'bi-telephone-fill', label: 'Phone',    value: '+44 78 2768 5736'       },
    { icon: 'bi-geo-alt-fill',   label: 'Location', value: 'Blackburn, Lancashire'  },
    { icon: 'bi-clock-fill',     label: 'Response', value: 'Within 1 working day'   },
]

const { collection, attr } = useCmsContent()
const socials = collection('socials', fallbackSocials, d => ({
    label: String(d.label ?? ''),
    icon: String(d.icon ?? ''),
    href: String(d.href || '#'),
}))
const serviceLinks = collection('services', fallbackServiceLinks, d => String(d.header ?? ''))
const contactInfo = collection('contact-info', fallbackContactInfo, d => ({
    icon: String(d.icon ?? ''),
    label: String(d.label ?? ''),
    value: String(d.value ?? ''),
}))
const tagline = attr('footer_tagline', 'A specialist web design and development studio based in Blackburn, UK. We build fast, beautiful, purposeful websites for businesses that care about quality.')
</script>

<style scoped lang="scss">
.site-footer {
    @apply relative z-10 bg-neutral-950 border-t border-white/10;
    &__inner {
        @apply max-w-screen-xl mx-auto px-6 pt-16 pb-8;
    }
}

// ── Top grid ────────────────────────────────────────────────────────────────
.footer-grid {
    @apply grid grid-cols-1 gap-12;
    @apply sm:grid-cols-2 lg:grid-cols-4;
}

// ── Brand column ────────────────────────────────────────────────────────────
.footer-logo {
    @apply w-36 mb-5;
}
.footer-brand__tagline {
    @apply text-sm text-white/50 leading-7;
}
.footer-social {
    @apply flex gap-3 mt-6;
    &__link {
        @apply w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 text-base transition-all duration-200;
        &:hover { @apply border-primary text-primary; }
    }
}

// ── Columns ─────────────────────────────────────────────────────────────────
.footer-col {
    @apply flex flex-col;
    &__heading {
        @apply text-sm font-extrabold font-comforta uppercase tracking-widest text-white mb-5;
    }
}

// ── Nav links ───────────────────────────────────────────────────────────────
.footer-links {
    @apply flex flex-col gap-3;
}
.footer-link {
    @apply text-sm text-white/50 transition-colors duration-200 font-garet;
    &:hover { @apply text-primary; }
    &--plain {
        @apply text-sm text-white/50 font-garet;
    }
}

// ── Contact list ─────────────────────────────────────────────────────────────
.footer-contact {
    @apply flex flex-col gap-4;
    li {
        @apply flex items-start gap-3;
        i { @apply text-primary text-base mt-0.5 shrink-0; }
    }
    &__label { @apply text-xs font-bold font-comforta uppercase tracking-wider text-white/30; }
    &__value { @apply text-sm text-white/60 font-garet mt-0.5; }
}

.footer-cta {
    @apply mt-1 px-6 py-2.5 rounded-lg bg-primary text-white font-bold font-comforta text-sm uppercase tracking-wider transition-opacity duration-200;
    &:hover { @apply opacity-80; }
}

// ── Divider + bottom bar ──────────────────────────────────────────────────────
.footer-divider {
    @apply border-t border-white/10 my-10;
}
.footer-bottom {
    @apply flex flex-col gap-2 text-center;
    @apply sm:flex-row sm:justify-between sm:text-left;
    &__copy  { @apply text-xs text-white/30 font-garet; }
    &__built { @apply text-xs text-white/30 font-garet; }
}
</style>
