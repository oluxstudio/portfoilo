<template lang="pug">
div.blog-page
    //- Header — logo centered
    header.blog-page__header
        a.blog-page__back(href="/blog")
            i.bi.bi-arrow-left
            span Back to blog
        span.blog-page__logo
            HeaderLogo2
        span.blog-page__spacer

    //- Not found
    div.blog-page__notfound(v-if="!post")
        h1 Post not found
        a(href="/") Return home

    //- Article + sidebar
    div.blog-page__layout(v-else)
        article.blog-page__article
            div.blog-page__hero
                img(:src="post.image" :alt="post.title")
                div.blog-page__hero-tint
                    span.blog-page__cat {{ post.category }}
            h1.blog-page__title {{ post.title }}
            div.blog-page__meta
                span {{ post.author }}
                span •
                span {{ post.date }}
            div.blog-page__body
                p(v-for="(para, i) in post.body" :key="i") {{ para }}

        //- ── Sidebar ───────────────────────────────────────────────────────
        aside.blog-page__sidebar
            //- Comments panel
            div.comments(v-if="showComments")
                div.comments__head
                    h3.comments__title Comments ({{ comments.length }})
                    button.comments__close(@click="showComments = false" aria-label="Close comments")
                        i.bi.bi-x-lg

                //- List (top)
                div.comments__list
                    div.comments__empty(v-if="!comments.length") Be the first to comment.
                    div.comment(v-for="(c, i) in comments" :key="i")
                        div.comment__avatar {{ c.name[0]?.toUpperCase() || '?' }}
                        div.comment__body
                            div.comment__name {{ c.name }}
                            div.comment__text {{ c.text }}

                //- Entry form (bottom)
                form.comments__form(@submit.prevent="addComment")
                    input.comments__input(v-model="form.name" type="text" placeholder="Your name" required)
                    textarea.comments__input.comments__input--area(v-model="form.text" rows="3" placeholder="Write a comment…" required)
                    button.comments__submit(type="submit")
                        i.bi.bi-send
                        |  Post comment

            //- Default sidebar cards
            template(v-else)
                //- Category
                div.side-card
                    h3.side-card__title Category
                    a.side-card__cat(href="/blog") {{ post.category }}

                //- Tags
                div.side-card
                    h3.side-card__title Tags
                    div.side-card__tags
                        a.side-card__tag(v-for="tag in tags" :key="tag" href="/blog") \#{{ tag }}

                //- Related articles
                div.side-card(v-if="related.length")
                    h3.side-card__title Related Articles
                    a.side-item(v-for="r in related" :key="r.id" :href="`/blog/${r.id}`")
                        div.side-item__thumb
                            img(:src="r.image" :alt="r.title" loading="lazy")
                        div.side-item__info
                            span.side-item__cat {{ r.category }}
                            span.side-item__title {{ r.title }}

                //- Latest articles
                div.side-card(v-if="latest.length")
                    h3.side-card__title Latest Articles
                    a.side-item(v-for="l in latest" :key="l.id" :href="`/blog/${l.id}`")
                        div.side-item__thumb
                            img(:src="l.image" :alt="l.title" loading="lazy")
                        div.side-item__info
                            span.side-item__date {{ l.date }}
                            span.side-item__title {{ l.title }}

    //- ── Fixed action dock (bottom right) ──────────────────────────────────
    div.dock
        button.dock__btn(@click="toggleTheme" title="Switch theme")
            i.bi.bi-circle-half
        div.dock__sep
        div.dock__group
            button.dock__btn(:class="{ 'dock__btn--active': vote === 'up' }" @click="thumbUp" title="Thumbs up")
                i.bi.bi-hand-thumbs-up
            span.dock__count {{ likes }}
        button.dock__btn(:class="{ 'dock__btn--active': vote === 'down' }" @click="thumbDown" title="Thumbs down")
            i.bi.bi-hand-thumbs-down
        button.dock__btn(@click="onComment" title="Comments")
            i.bi.bi-chat-dots
        div.dock__sep
        div.dock__avatar(v-if="post" :title="post.author") {{ post.author[0] }}
        button.dock__btn(@click="onMore" title="More options")
            i.bi.bi-three-dots
</template>

<script setup lang="ts">
const props = defineProps<{ id: number }>()
const { toggleTheme } = useTheme()

interface Post {
	id: number; image: string; category: string; date: string
	title: string; author: string; body: string[]
}

const posts: Post[] = [
	{ id: 1, image: '/images/blogs/blog1.png', category: 'Design', date: '12 May 2025', author: 'Oluwaseun', title: 'Why Custom Websites Outperform Templates Every Time', body: ['Templates promise speed, but they trade your brand’s uniqueness for convenience — businesses that invest in bespoke design consistently see stronger engagement and better conversion rates.', 'When you use a template, you start with someone else’s idea of what your site should look like. You inherit their assumptions, their layout decisions, and their structural limitations. Custom websites start with you — your brand, your goals, your users.', 'The data backs this up. Studies consistently show that purpose-built sites outperform template sites on key metrics including time on page, bounce rate, and conversion.', 'At Olux Studio, every project begins with discovery — understanding your business, your audience, and what success looks like for you.'] },
	{ id: 2, image: '/images/blogs/blog2.png', category: 'UI/UX', date: '8 May 2025', author: 'Oluwaseun', title: '10 UI Design Trends Shaping the Web in 2025', body: ['From glassmorphism to AI-assisted layouts, the visual web is evolving fast. We break down the ten trends worth paying attention to this year.', 'Bold typography is back — large, expressive type is being used as a primary visual element rather than just a content carrier.', 'Dark mode is now table stakes. Users expect it, and designers are embracing the creative freedom it offers.', 'Micro-interactions are becoming more sophisticated. Done well, they make an interface feel alive and responsive.'] },
	{ id: 3, image: '/images/blogs/blog3.png', category: 'Development', date: '3 May 2025', author: 'Oluwaseun', title: 'How Core Web Vitals Directly Affect Your Google Rankings', body: ['Speed, interactivity, and visual stability are now official ranking signals. Here’s what that means for your site and how to improve your scores.', 'Google’s Core Web Vitals measure three things: Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.', 'A poor score doesn’t just affect user experience — it directly impacts your position in search results.', 'The good news is that most issues are fixable with the right technical approach.'] },
	{ id: 4, image: '/images/blogs/blog4.png', category: 'Development', date: '28 Apr 2025', author: 'Oluwaseun', title: 'The Case for Headless CMS in Modern Web Projects', body: ['Decoupled content management gives your team editorial freedom without locking you into a rigid frontend.', 'A headless CMS stores your content and exposes it via an API. Your frontend fetches and displays that content.', 'This separation brings real advantages for both content teams and developers.', 'Popular options we work with include Sanity, Contentful, and Directus.'] },
	{ id: 5, image: '/images/blogs/blog5.png', category: 'Design', date: '22 Apr 2025', author: 'Oluwaseun', title: 'Mobile-First Design: Why It’s Non-Negotiable in 2025', body: ['Over 60% of web traffic is mobile. Designing desktop-first and scaling down is no longer good enough.', 'Mobile-first design means starting with the smallest screen and progressively enhancing for larger viewports.', 'The benefits ripple outward — faster sites, better Core Web Vitals, higher rankings.', 'In practice, it means designing the mobile layout first and testing on real devices throughout.'] },
	{ id: 6, image: '/images/blogs/blog6.png', category: 'Business', date: '15 Apr 2025', author: 'Oluwaseun', title: 'How to Brief a Web Designer: A Client’s Complete Guide', body: ['A strong brief is the difference between a project that runs smoothly and one that derails.', 'The most important thing in any brief is clarity about goals.', 'Include examples of sites you admire — and explain what you like about them.', 'Budget and timeline matter, even if you’re not sure exactly.'] },
	{ id: 7, image: '/images/blogs/blog7.png', category: 'UI/UX', date: '9 Apr 2025', author: 'Oluwaseun', title: 'UI vs UX: Understanding the Real Difference', body: ['They’re often used interchangeably, but UI and UX are distinct disciplines.', 'UX is about the overall journey — flows, architecture, and research.', 'UI is about the presentation layer — visual systems, typography, colour, spacing.', 'Many designers do both, but the skills and mindsets are different.'] },
	{ id: 8, image: '/images/blogs/blog8.png', category: 'Tutorial', date: '1 Apr 2025', author: 'Oluwaseun', title: 'From Sketch to Code: Our Design-to-Dev Workflow', body: ['A transparent look at how Olux Studio takes a project from wireframe to production-ready code in six clear stages.', 'Discovery, architecture, and wireframing establish the foundation.', 'Visual design applies the brand; development builds it in code.', 'QA and launch close out the process with testing and monitoring.'] },
	{ id: 9, image: '/images/blogs/blog9.png', category: 'Business', date: '24 Mar 2025', author: 'Oluwaseun', title: 'Why Page Speed Is Your Best Sales Tool', body: ['A one-second delay in load time can cost you 7% in conversions.', 'The research is unambiguous — Amazon, Google, and Walmart have all quantified the impact.', 'Speed affects how users perceive your brand.', 'Speed is an engineering problem with known solutions.', 'A one-second delay in load time can cost you 7% in conversions.', 'The research is unambiguous — Amazon, Google, and Walmart have all quantified the impact.', 'Speed affects how users perceive your brand.', 'Speed is an engineering problem with known solutions.', 'A one-second delay in load time can cost you 7% in conversions.', 'The research is unambiguous — Amazon, Google, and Walmart have all quantified the impact.', 'Speed affects how users perceive your brand.', 'Speed is an engineering problem with known solutions.'] },
	{ id: 10, image: '/images/blogs/blog10.png', category: 'Tutorial', date: '17 Mar 2025', author: 'Oluwaseun', title: 'Setting Up a Nuxt 3 Project the Right Way', body: ['Nuxt 3 is powerful, but a poor setup leads to technical debt fast.', 'Start with TypeScript enabled from day one.', 'Choose your CSS approach early and stick to it.', 'Set up state management and linting before you need them.'] },
	{ id: 11, image: '/images/blogs/blog11.png', category: 'Design', date: '10 Mar 2025', author: 'Oluwaseun', title: 'The Psychology of Colour in Web Design', body: ['Colour isn’t decoration — it’s communication.', 'Different colours carry different associations, and these vary by culture.', 'Colour theory is more nuanced than colour associations.', 'Choose your brand colours for what they communicate, not just what you like.'] },
	{ id: 12, image: '/images/blogs/blog12.png', category: 'Development', date: '3 Mar 2025', author: 'Oluwaseun', title: 'Accessibility Is Not Optional', body: ['Building accessible websites is both the right thing to do and good for business.', 'Accessibility starts with semantic HTML.', 'Colour contrast is a common failure and an easy fix.', 'Keyboard navigation is a foundational requirement.'] },
	{ id: 13, image: '/images/blogs/blog13.png', category: 'Business', date: '24 Feb 2025', author: 'Oluwaseun', title: 'When to Rebuild vs When to Redesign Your Website', body: ['Knowing the difference can save you significant time and money.', 'A redesign changes the look and feel while keeping the structure intact.', 'A rebuild starts from scratch when technical debt is limiting you.', 'The only way to know which you need is an honest technical audit.'] },
]

const post = computed(() => posts.find(p => p.id === props.id))

// ── Tags per category ───────────────────────────────────────────────────────
const categoryTags: Record<string, string[]> = {
	'Design': ['webdesign', 'branding', 'ux', 'creative'],
	'Development': ['nuxt', 'vue', 'performance', 'frontend'],
	'UI/UX': ['ui', 'ux', 'prototyping', 'usability'],
	'Business': ['strategy', 'growth', 'clients', 'conversion'],
	'Tutorial': ['howto', 'guide', 'workflow', 'tips'],
}
const tags = computed(() => categoryTags[post.value?.category ?? ''] ?? ['web', 'design', 'studio'])

// ── Related (same category) & latest articles ───────────────────────────────
const related = computed(() =>
	posts.filter(p => p.id !== props.id && p.category === post.value?.category).slice(0, 4),
)
const latest = computed(() =>
	posts.filter(p => p.id !== props.id).slice(-5).reverse(),
)

// ── Vote state ──────────────────────────────────────────────────────────────
const vote = ref<'up' | 'down' | null>(null)
const likes = ref(0)

const thumbUp = () => {
	if (vote.value === 'up') { vote.value = null; likes.value--; return }
	if (vote.value === 'down') vote.value = null
	vote.value = 'up'; likes.value++
}
const thumbDown = () => {
	if (vote.value === 'up') likes.value--
	vote.value = vote.value === 'down' ? null : 'down'
}
// ── Comments ────────────────────────────────────────────────────────────────
const showComments = ref(false)
const comments = ref<{ name: string, text: string }[]>([
	{ name: 'Sarah', text: 'Really insightful read — the point about discovery resonates.' },
	{ name: 'James', text: 'Bookmarking this. Sharing with my team.' },
])
const form = reactive({ name: '', text: '' })

const onComment = () => { showComments.value = true }
const addComment = () => {
	if (!form.name.trim() || !form.text.trim()) return
	comments.value.push({ name: form.name.trim(), text: form.text.trim() })
	form.name = ''
	form.text = ''
}

const onMore = () => alert('Share, save, report…')

// ── SEO / social meta (server-rendered) ─────────────────────────────────────
const url = useRequestURL()
watchEffect(() => {
	const p = post.value
	if (!p) {
		useSeoMeta({ title: 'Post not found — Olux Studio' })
		return
	}
	const absImage = url.origin + p.image
	const pageUrl = `${url.origin}/blog/${p.id}`
	const desc = p.body[0]

	useSeoMeta({
		title: `${p.title} — Olux Studio`,
		description: desc,
		ogTitle: p.title,
		ogDescription: desc,
		ogImage: absImage,
		ogType: 'article',
		ogUrl: pageUrl,
		ogSiteName: 'Olux Studio',
		twitterCard: 'summary_large_image',
		twitterTitle: p.title,
		twitterDescription: desc,
		twitterImage: absImage,
	})
	useHead({
		link: [{ rel: 'canonical', href: pageUrl }],
		script: [{
			type: 'application/ld+json',
			innerHTML: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'Article',
				'headline': p.title,
				'image': absImage,
				'datePublished': p.date,
				'author': { '@type': 'Person', 'name': p.author },
				'publisher': { '@type': 'Organization', 'name': 'Olux Studio' },
				'articleSection': p.category,
				'mainEntityOfPage': pageUrl,
			}),
		}],
	})
})
</script>

<style scoped lang="scss">
.blog-page {
    min-height: 100vh;
    background-color: rgba(var(--color-fore));
    color: rgba(var(--color-back));

    &__header {
        @apply grid items-center px-6 py-4 sticky top-0 z-10;
        grid-template-columns: 1fr auto 1fr;
        background-color: rgba(var(--color-back), 0.92);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(var(--color-fore), 0.1);

        // Mobile: flex space-between (back left, logo right)
        @media (max-width: 640px) {
            @apply flex justify-between px-4 py-3;
        }
    }
    &__back {
        @apply inline-flex items-center gap-2 text-sm font-bold font-comforta uppercase tracking-wider px-4 py-2 rounded-full no-underline transition-all duration-200 justify-self-start text-white;
        border: 2px solid rgba(var(--color-primary));
        &:hover { background-color: rgba(var(--color-primary)); color: #fff; }
        i { @apply text-base; }

        // Mobile: keep the label visible but compact
        @media (max-width: 640px) {
            @apply gap-1.5 px-3 py-1.5 text-xs;
            span { @apply inline; }
        }
    }
    &__logo {
        @apply font-junegull font-extrabold text-xl justify-self-center;
        color: rgba(var(--color-primary));

        // Mobile: shrink the logo so the header fits on one row
        @media (max-width: 640px) {
            :deep(svg), :deep(img) { @apply h-12 w-auto; }
            @apply text-base w-[8rem];
        }
    }
    &__spacer {
        @apply justify-self-end;
        @media (max-width: 640px) { @apply hidden; }
    }
    &__notfound {
        @apply flex flex-col items-center justify-center gap-4 text-center;
        min-height: 60vh;
        h1 { @apply text-3xl font-bold; }
        a { color: rgba(var(--color-primary)); @apply underline; }
    }
    &__layout {
        @apply grid grid-cols-1 gap-12 mx-auto px-6 pb-24;
        max-width: 1180px;
        @apply lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14;
    }
    &__article {
        @apply min-w-0;
    }
    &__sidebar {
        @apply flex flex-col gap-8;
        @apply lg:sticky lg:top-24 lg:self-start lg:pl-4;
        @media (min-width: 1024px) {
            border-left: 2px solid rgba(var(--color-primary));
        }
    }
    &__hero {
        @apply relative w-full rounded-2xl overflow-hidden mt-8;
        aspect-ratio: 16 / 7;
        img { @apply w-full h-full object-cover; }
    }
    &__hero-tint {
        @apply absolute inset-0 flex items-end p-6;
        background: linear-gradient(to top, rgba(0,0,0,.6), transparent 60%);
    }
    &__cat {
        @apply text-xs font-extrabold font-comforta uppercase tracking-widest px-3 py-1 rounded-full;
        background-color: rgba(var(--color-primary));
        color: #fff;
    }
    &__title {
        @apply font-junegull font-extrabold leading-tight mt-10 text-3xl;
        @apply md:text-4xl;
    }
    &__meta {
        @apply flex items-center gap-2 text-sm mt-3;
        color: rgba(var(--color-back), 0.65);
    }
    &__body {
        @apply flex flex-col gap-5 mt-8 mr-16 lg:mr-0;
        p {
            @apply text-base leading-8;
            color: rgba(var(--color-text), 1);
        }
    }
}

// ── Sidebar cards ───────────────────────────────────────────────────────────
.side-card {
    @apply rounded-2xl p-5;
    background-color: rgba(var(--color-fore), 0.04);
    border: 1px solid rgba(var(--color-fore), 0.1);

    &__title {
        @apply text-xs font-extrabold font-comforta uppercase tracking-widest mb-4;
        color: rgba(var(--color-primary));
		// color: color-mix(in hsl, rgb(var(--color-primary)), rgb(53, 24, 87) 30%);
    }
    &__cat {
        @apply inline-block text-sm font-bold font-comforta px-4 py-2 rounded-full no-underline transition-all duration-200;
        color: rgba(var(--color-secondary));
        border: 2px solid rgba(var(--color-primary), 0.5);
        &:hover { background-color: rgba(var(--color-primary)); color: #fff; }
    }
    &__tags {
        @apply flex flex-wrap gap-2;
    }
    &__tag {
        @apply text-xs font-bold font-comforta px-3 py-1.5 rounded-full no-underline transition-all duration-200;
        color: rgba(var(--color-back), 0.7);
        background-color: rgba(var(--color-fore), 0.06);
        border: 1px solid rgba(var(--color-tertiary), 1);
        &:hover {
            color: #fff;
            background-color: rgba(var(--color-primary));
            border-color: rgba(var(--color-primary));
        }
    }
}

.side-item {
    @apply flex items-center gap-3 no-underline py-2.5;
    border-top: 1px solid rgba(var(--color-fore), 0.08);
    &:first-of-type { border-top: 0; padding-top: 0; }

    &__thumb {
        @apply w-16 h-16 rounded-lg overflow-hidden shrink-0;
        img { @apply w-full h-full object-cover transition-transform duration-300; }
    }
    &:hover &__thumb img { transform: scale(1.08); }

    &__info { @apply flex flex-col gap-1 min-w-0; }
    &__cat, &__date {
        @apply text-[10px] font-extrabold font-comforta uppercase tracking-wider;
        color: rgba(var(--color-primary));
    }
    &__title {
        @apply text-sm font-bold font-comforta leading-snug;
        color: rgba(var(--color-text), 0.85);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    &:hover &__title { color: rgba(var(--color-primary)); }
}

// ── Comments panel ──────────────────────────────────────────────────────────
// Mobile-first: full-screen drawer. Desktop: full-height panel in the sidebar.
.comments {
    @apply flex flex-col;
    background-color: rgba(var(--color-back));

    // ── Mobile (default): fixed full-screen overlay ──
    position: fixed;
    inset: 0;
    z-index: 60;
    height: 100dvh;

    // ── Desktop: full-viewport-height panel inside the sidebar column ──
    @media (min-width: 1024px) {
        position: sticky;
        inset: auto;
        top: 24px;
        z-index: auto;
        height: calc(100vh - 48px);
        border-radius: 1rem;
        overflow: hidden;
        border: 1px solid rgba(var(--color-fore), 0.1);
    }

    &__head {
        @apply flex items-center justify-between px-5 py-4 shrink-0;
        background-color: rgba(var(--color-back));
        border-bottom: 1px solid rgba(var(--color-fore), 0.1);
    }
    &__title {
        @apply text-sm font-extrabold font-comforta uppercase tracking-widest;
        color: rgba(var(--color-primary));
    }
    &__close {
        @apply flex items-center justify-center rounded-full transition-all duration-200 shrink-0;
        width: 40px; height: 40px;
        color: rgba(var(--color-primary));
        border: 2px solid rgba(var(--color-primary), 0.5);
        &:hover { background-color: rgba(var(--color-primary)); color: #fff; }
        i { @apply text-sm; }
    }
    // List grows and scrolls; form stays pinned at the bottom
    &__list {
        @apply flex flex-col gap-4 px-5 py-4 overflow-y-auto;
        flex: 1 1 auto;
        min-height: 0;
        -webkit-overflow-scrolling: touch;
    }
    &__empty {
        @apply text-sm text-center py-6;
        color: rgba(var(--color-text), 0.5);
    }
    &__form {
        @apply flex flex-col gap-2.5 px-5 pt-4 shrink-0;
        padding-bottom: max(1rem, env(safe-area-inset-bottom));
        background-color: rgba(var(--color-back));
        border-top: 1px solid rgba(var(--color-fore), 0.1);
    }
    &__input {
        @apply w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200;
        background-color: rgba(var(--color-fore), 0.05);
        color: rgba(var(--color-text));
        border: 1px solid rgba(var(--color-fore), 0.15);
        &::placeholder { color: rgba(var(--color-text), 0.4); }
        &:focus { border-color: rgba(var(--color-primary), 0.6); }
        &--area { @apply resize-none; }
    }
    &__submit {
        @apply flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold font-comforta uppercase tracking-wider transition-all duration-200;
        background-color: rgba(var(--color-primary));
        color: #fff;
        &:active { transform: scale(0.98); }
        &:hover { opacity: 0.85; }
        i { @apply text-sm; }
    }
}

.comment {
    @apply flex gap-3;
    &__avatar {
        @apply flex items-center justify-center rounded-full font-extrabold text-xs shrink-0;
        width: 38px; height: 38px;
        color: #fff;
        background-color: rgba(var(--color-primary));
    }
    &__body { @apply flex flex-col gap-1 min-w-0; }
    &__name {
        @apply text-sm font-bold font-comforta;
        color: rgba(var(--color-fore));
    }
    &__text {
        @apply text-sm leading-6 break-words;
        color: rgba(var(--color-fore), 1);
    }
}

// ── Action dock ─────────────────────────────────────────────────────────────
.dock {
    @apply fixed z-50 flex flex-col items-center gap-2 lg:gap-3 px-1.5 lg:px-2.5 py-3.5 rounded-full;
    bottom: 24px;
    right: 15px;
    background-color: rgba(var(--color-back), 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(var(--color-fore), 0.12);
    box-shadow: 0 8px 30px rgba(0,0,0,0.18);

    &__btn {
        @apply flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 w-8 lg:w-10 h-8 lg:h-10;
        background: transparent;
        color: rgba(var(--color-primary));
        border: 2px solid rgba(var(--color-primary), 0.55);
        i { @apply text-lg leading-none; }
        &:hover, &--active {
            background-color: rgba(var(--color-primary));
            color: #fff;
            border-color: rgba(var(--color-primary));
        }
    }
    &__count {
        @apply text-[10px] font-extrabold;
        color: rgba(var(--color-fore), 0.6);
    }
    &__group {
        @apply flex flex-col items-center gap-0.5;
    }
    &__avatar {
        @apply flex items-center justify-center rounded-full font-extrabold text-sm;
        width: 44px;
        height: 44px;
        color: #fff;
        background-color: rgba(var(--color-primary));
        border: 2px solid rgba(var(--color-fore), 0.12);
    }
    &__sep {
        width: 24px;
        height: 1px;
        background-color: rgba(var(--color-fore), 0.15);
    }
}
</style>
