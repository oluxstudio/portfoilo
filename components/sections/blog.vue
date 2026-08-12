<template lang="pug">
div
    div.page-label
        h3.subtitle {{ props.title }}
        h2.header Blog

    //- ── 2 hero cards (full width) ──────────────────────────────────────
    div.hero-grid.mt-20(v-if="heroPost[0] || heroPost[1]")
        div.hero-card(v-for="(post, i) in heroPost" :key="post.id" v-scroll-animate="'slide-up'" :style="`--anim-delay: ${i * 150}ms`" @click="openPost(post.id)" style="cursor:pointer")
            img.hero-card__bg(:src="post.image" :alt="post.title" loading="lazy" decoding="async")
            div.hero-card__overlay
            div.hero-card__content
                h2.hero-card__title {{ post.title }}
                p.hero-card__excerpt {{ post.excerpt }}
            div.hero-card__footer
                div.hero-card__author
                    div.hero-card__avatar {{ post.author[0] }}
                    div
                        span.hero-card__name {{ post.author }}
                        span.hero-card__dot •
                        span.hero-card__date {{ post.date }}
                span.hero-card__badge(:style="{ '--cat-color': getCategoryColor(post.category) }") {{ post.category }}

    //- ── Heading + tabs + grid + sidebar ────────────────────────────────
    div.mt-16.flex.flex-col.gap-12(class="lg:flex-row lg:items-start")

        //- Main
        div(class="flex-1 min-w-0")
            h2.section-header.text-center(v-scroll-animate="'fade'") {{ articlesHeader }}

            //- Filter tabs
            div.filter-tabs(v-scroll-animate="'slide-up'")
                button.filter-tab.text-black(
                    v-for="tab in topics"
                    :key="tab"
                    :class="{ 'filter-tab--active': selectedTopic === tab }"
                    @click="setTopic(tab)"
                ) {{ tab === 'All' ? 'All Articles' : tab }}

            //- 3-col article grid
            div.article-grid.mt-8
                div.article-card(
                    v-for="(post, i) in gridPosts"
                    :key="post.id"
                    v-scroll-animate="'slide-up'"
                    :style="`--anim-delay: ${(i % 3) * 100}ms`"
                    @click="openPost(post.id)"
                    style="cursor:pointer"
                )
                    div.article-card__image
                        img(:src="post.image" :alt="post.title" loading="lazy" decoding="async")
                    div.article-card__body
                        span.article-card__cat(:style="{ color: getCategoryColor(post.category) }") {{ post.category }}
                        h3.article-card__title {{ post.title }}
                        div.post-author.mt-2
                            span.post-author__name {{ post.author }}
                            span.post-author__sep •
                            span.post-author__date {{ post.date }}

        //- Sidebar
        div.sidebar

            //- Topic filter
            div.sidebar-card
                div.sidebar-card__title Topic
                ul.topic-list
                    li(
                        v-for="topic in topics"
                        :key="topic"
                        :class="{ 'topic-list__item--active': selectedTopic === topic }"
                        class="topic-list__item"
                        @click="setTopic(topic)"
                    ) {{ topic }}

            //- Filter by
            div.sidebar-card
                div.sidebar-card__title Filter By
                div.sort-select-wrap
                    select.sort-select(v-model="sortOrder")
                        option(value="newest") Newest
                        option(value="oldest") Oldest

            //- Newsletter
            div.sidebar-card(ref="newsletterRef")
                div.sidebar-card__title Newsletter
                p.sidebar-card__desc {{ sidebarNewsletterDesc }}
                div.mt-4(@click.prevent="scrollToNewsletter" style="cursor:pointer")
                    ButtonsFlipV2(front="Subscribe" back="Stay Informed")
</template>

<script setup lang="ts">
import * as yup from 'yup'

const props = defineProps({
	title: { type: String, required: true },
})

const categoryColors: Record<string, string> = {
	'Design': '#6366f1',
	'Development': '#22c55e',
	'UI/UX': '#a855f7',
	'Business': '#f97316',
	'Tutorial': '#eab308',
}
const getCategoryColor = (cat: string) => categoryColors[cat] ?? '#6366f1'

const openPost = (id: number | string) => window.open(`/blog/${id}`, '_blank')

const fallbackTopics = ['All', 'Design', 'Development', 'UI/UX', 'Business', 'Tutorial']
const selectedTopic = ref('All')
const sortOrder = ref('newest')

const setTopic = (topic: string) => { selectedTopic.value = topic }

interface Post {
	id: number | string; image: string; category: string; date: string
	title: string; excerpt: string; author: string
}

const fallbackPosts: Post[] = [
	{ id: 1, image: '/images/blogs/blog1.png', category: 'Design', date: '12 May 2025', title: 'Why Custom Websites Outperform Templates Every Time', excerpt: 'Templates promise speed, but they trade your brand\'s uniqueness for convenience — businesses that invest in bespoke design consistently see stronger engagement and better conversion rates.', author: 'Oluwaseun' },
	{ id: 2, image: '/images/blogs/blog2.png', category: 'UI/UX', date: '8 May 2025', title: '10 UI Design Trends Shaping the Web in 2025', excerpt: 'From glassmorphism to AI-assisted layouts, the visual web is evolving fast. We break down the ten trends worth paying attention to this year.', author: 'Oluwaseun' },
	{ id: 3, image: '/images/blogs/blog3.png', category: 'Development', date: '3 May 2025', title: 'How Core Web Vitals Directly Affect Your Google Rankings', excerpt: 'Speed, interactivity, and visual stability are now official ranking signals. Here\'s what that means for your site and how to improve your scores.', author: 'Oluwaseun' },
	{ id: 4, image: '/images/blogs/blog4.png', category: 'Development', date: '28 Apr 2025', title: 'The Case for Headless CMS in Modern Web Projects', excerpt: 'Decoupled content management gives your team editorial freedom without locking you into a rigid frontend. Here\'s when it makes sense.', author: 'Oluwaseun' },
	{ id: 5, image: '/images/blogs/blog5.png', category: 'Design', date: '22 Apr 2025', title: 'Mobile-First Design: Why It\'s Non-Negotiable in 2025', excerpt: 'Over 60% of web traffic is mobile. Designing desktop-first and scaling down is no longer good enough — here\'s how to flip the process.', author: 'Oluwaseun' },
	{ id: 6, image: '/images/blogs/blog6.png', category: 'Business', date: '15 Apr 2025', title: 'How to Brief a Web Designer: A Client\'s Complete Guide', excerpt: 'A strong brief is the difference between a project that runs smoothly and one that derails. Here\'s exactly what to include.', author: 'Oluwaseun' },
	{ id: 7, image: '/images/blogs/blog7.png', category: 'UI/UX', date: '9 Apr 2025', title: 'UI vs UX: Understanding the Real Difference', excerpt: 'They\'re often used interchangeably, but UI and UX are distinct disciplines. Understanding the difference helps you hire the right help.', author: 'Oluwaseun' },
	{ id: 8, image: '/images/blogs/blog8.png', category: 'Tutorial', date: '1 Apr 2025', title: 'From Sketch to Code: Our Design-to-Dev Workflow', excerpt: 'A transparent look at how Olux Studio takes a project from initial wireframe to production-ready code in six clear stages.', author: 'Oluwaseun' },
	{ id: 9, image: '/images/blogs/blog9.png', category: 'Business', date: '24 Mar 2025', title: 'Why Page Speed Is Your Best Sales Tool', excerpt: 'A one-second delay in load time can cost you 7% in conversions. Page speed isn\'t a technical detail — it\'s a revenue driver.', author: 'Oluwaseun' },
	{ id: 10, image: '/images/blogs/blog10.png', category: 'Tutorial', date: '17 Mar 2025', title: 'Setting Up a Nuxt 3 Project the Right Way', excerpt: 'Nuxt 3 is a powerful Vue meta-framework, but a poor setup leads to technical debt fast. Here\'s the opinionated starter config we use.', author: 'Oluwaseun' },
	{ id: 11, image: '/images/blogs/blog11.png', category: 'Design', date: '10 Mar 2025', title: 'The Psychology of Colour in Web Design', excerpt: 'Colour choices influence trust, emotion, and action. Here\'s how we use colour theory to make deliberate design decisions for our clients.', author: 'Oluwaseun' },
	{ id: 12, image: '/images/blogs/blog12.png', category: 'Development', date: '3 Mar 2025', title: 'Accessible Websites: Beyond the Basics of WCAG', excerpt: 'Accessibility isn\'t a checklist — it\'s a mindset. We explore how building inclusively benefits all users, not just those with disabilities.', author: 'Oluwaseun' },
	{ id: 13, image: '/images/blogs/blog13.png', category: 'Business', date: '24 Feb 2025', title: 'What to Look for When Hiring a Web Design Agency', excerpt: 'Not all agencies are equal. Here\'s the checklist we\'d use ourselves — covering portfolio quality, process transparency, and post-launch support.', author: 'Oluwaseun' },
]

// CMS posts have no category — it lives in the `post-meta` collection, matched
// by exact title; the fallback data's title map covers posts without meta.
const categoryByTitle = new Map(fallbackPosts.map(p => [p.title, p.category]))

const formatDate = (iso: string | null) => {
	const d = iso ? new Date(iso) : null
	return d && !Number.isNaN(d.getTime())
		? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
		: ''
}

const { posts: cmsPosts, collection, attr } = useCmsContent()
const articlesHeader = attr('blog_articles_header', 'All Articles')
const sidebarNewsletterDesc = attr('blog_sidebar_newsletter_desc', 'Subscribe to get web design insights and studio updates delivered weekly.')
const defaultAuthor = attr('blog_default_author', 'Oluwaseun')

const postMeta = collection('post-meta', [], d => ({
	title: String(d.title ?? ''),
	category: String(d.category ?? ''),
}))
const cmsCategoryByTitle = computed(() => new Map(postMeta.value.map(m => [m.title, m.category])))

const allPosts = computed<Post[]>(() => {
	if (!cmsPosts.value.length) return fallbackPosts
	return cmsPosts.value.map((p, i) => ({
		id: p.slug,
		image: p.cover_image || `/images/blogs/blog${(i % 13) + 1}.png`,
		category: cmsCategoryByTitle.value.get(p.title) || categoryByTitle.get(p.title) || 'Design',
		date: formatDate(p.published_at),
		title: p.title,
		excerpt: p.excerpt ?? '',
		author: p.author || defaultAuthor.value,
	}))
})

// Filter tabs follow the categories actually present in the posts.
const topics = computed(() => {
	const present = [...new Set(allPosts.value.map(p => p.category).filter(Boolean))]
	return present.length ? ['All', ...present] : fallbackTopics
})

const filtered = computed(() => {
	const posts = selectedTopic.value === 'All'
		? allPosts.value
		: allPosts.value.filter(p => p.category === selectedTopic.value)
	return sortOrder.value === 'oldest' ? [...posts].reverse() : posts
})

const heroPost = computed(() => filtered.value.slice(0, 2))
const gridPosts = computed(() => filtered.value.slice(2))

// ── Newsletter scroll ──────────────────────────────────────────────────────
const newsletterRef = ref<HTMLElement | null>(null)
const { scrollToSection } = useScrollToSection()
const scrollToNewsletter = () => scrollToSection('#newsletter')

// ── Newsletter ─────────────────────────────────────────────────────────────
const newsletterDone = ref(false)
const newsletterSchema = yup.object({
	nlName: yup.string().required('Name is required').min(2, 'Too short'),
	nlEmail: yup.string().required('Email is required').email('Enter a valid email'),
})
async function onNewsletterSubmit(values: Record<string, string>) {
	await new Promise(resolve => setTimeout(resolve, 900))
	console.log('Newsletter signup:', values)
	setTimeout(() => { newsletterDone.value = true }, 400)
}
</script>

<style scoped lang="scss">
// ── Hero cards ─────────────────────────────────────────────────────────────
.hero-grid {
    @apply grid grid-cols-1 gap-5;
    @apply md:grid-cols-2;
}
.hero-card {
    @apply relative rounded-2xl overflow-hidden cursor-pointer;
    height: 280px;
    &__bg {
        @apply absolute inset-0 w-full h-full object-cover transition-transform duration-500;
    }
    &:hover &__bg { transform: scale(1.04); }
    &__overlay {
        @apply absolute inset-0;
        background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.3) 55%, rgba(0,0,0,.1) 100%);
    }
    &__content {
        @apply absolute inset-x-5 top-5 flex flex-col gap-2;
    }
    &__title {
        @apply text-white font-extrabold font-junegull text-2xl leading-tight;
        text-shadow: 0 1px 4px rgba(0,0,0,.5);
    }
    &__excerpt {
        @apply text-white/70 text-sm leading-5 line-clamp-2;
    }
    &__footer {
        @apply absolute inset-x-5 bottom-4 flex items-center justify-between;
    }
    &__author {
        @apply flex items-center gap-2;
    }
    &__avatar {
        @apply w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold font-comforta shrink-0;
    }
    &__name { @apply text-white text-sm font-bold font-comforta; }
    &__dot  { @apply text-white/50 text-xs mx-1; }
    &__date { @apply text-white/60 text-xs; }
    &__badge {
        @apply px-3 py-1 rounded-full text-xs font-bold font-comforta uppercase tracking-wide text-white;
        background-color: var(--cat-color);
    }
}

// ── "All Articles" heading ─────────────────────────────────────────────────
.articles-heading {
    @apply text-3xl font-extrabold font-junegull text-foreground text-center mb-6;
}

// ── Filter tabs ────────────────────────────────────────────────────────────
.filter-tabs {
    @apply flex flex-wrap justify-center gap-2;
}
.filter-tab {
    @apply px-4 py-1.5 rounded-full border border-foreground/20 text-sm font-bold font-comforta text-maintext/60 transition-all duration-200;
    &:hover { @apply border-primary/70 text-primary; }
    &--active { @apply bg-primary text-white border-primary; }
}

// ── Article grid ───────────────────────────────────────────────────────────
.article-grid {
    @apply grid grid-cols-1 gap-8;
    @apply sm:grid-cols-2 lg:grid-cols-3;
}
.article-card {
    @apply flex flex-col gap-2 cursor-pointer;
    &__image {
        @apply overflow-hidden rounded-xl;
        img {
            @apply w-full object-cover transition-transform duration-300;
            height: 200px;
        }
    }
    &:hover &__image img { @apply scale-105; }
    &__cat {
        @apply text-xs font-bold font-comforta uppercase tracking-wider mt-1;
    }
    &__title {
        @apply font-bold font-comforta text-maintext leading-snug;
    }
}

// ── Post author (shared) ───────────────────────────────────────────────────
.post-author {
    @apply flex items-center gap-1.5 text-xs;
    &__name { @apply font-bold font-comforta text-maintext/70; }
    &__sep  { @apply text-maintext/30; }text
    &__date { @apply text-maintext/50; }
}

// ── Sidebar ────────────────────────────────────────────────────────────────
.sidebar {
    @apply flex flex-col gap-5;
    @apply lg:w-64 lg:shrink-0;
}
.sidebar-card {
    @apply p-5 rounded-xl border border-foreground/10 bg-foreground/5 flex flex-col gap-2 transition-all duration-300;
    &__title { @apply font-bold font-comforta text-maintext text-base mb-1; }
    &__desc  { @apply text-sm text-maintext leading-6; }
    &--highlight {
        @apply border-primary/60;
        box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.15);
    }
}
.topic-list {
    @apply flex flex-col gap-1;
    &__item {
        @apply px-2 py-1 rounded text-sm text-maintext/90 cursor-pointer transition-colors duration-150 font-garet;
        &:hover { @apply text-tertiary; }
        &--active { @apply text-primary font-bold; }
    }
}
.sort-select-wrap {
    @apply relative;
    &::after {
        content: '';
        @apply pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-4 border-secondary;
        border-top-color: rgba(var(--color-fore), 0.5);
    }
}
.sort-select {
    @apply w-full appearance-none bg-foreground/5 border border-secondary/55 rounded-lg px-3 py-2 text-sm text-maintext font-garet cursor-pointer;
    &:focus { @apply outline-none border-primary/50; }
}
.newsletter-success {
    @apply flex items-center gap-2 text-primary font-bold font-comforta text-sm py-2;
    i { @apply text-lg; }
}
</style>
