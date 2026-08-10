<template lang="pug">
div.bg-foreground.text-maintext(:class="themeClass")
  //- Blog post page (opened in new tab at /blog/:id)
  BlogPost(v-if="blogId !== null" :id="blogId")

  //- Blog listing page (/blog)
  BlogList(v-else-if="isBlogList")

  //- Main single-page app
  template(v-else)
    div#VidBox
      div.overlay
      video(autoplay loop muted style="width:100%;height:100%;display:block;margin:0 auto;object-fit:cover;")
        source(src="~/assets/videos/8303104-hd_1920_1080_24fps.mp4" type="video/mp4")

    div.flex.sticky.top-0.z-50.justify-between.items-center.transition.duration-700.ease-in-out.p-4(ref="navBar")
      div.nav-box
        HeaderLogo
        IconList.icon.text-maintext.w-14.pr-6(code="menu" class="lg:hidden" @click="menuStore.toggleMenu")
        HeaderNav.hidden(class="lg:flex")
        HeaderApps.hidden(class="lg:flex")

    //- Mobile slide-in menu
    MobileMenu

    div#Pages
      div#Home.h-dvh.text-zinc-200.z-20.relative
        SectionsHero
      div#about.page
        SectionsAbout
      div#testimonials.page
        SectionsTestimonials
      div#services.page
        SectionsServices(title="Services")
      div#blog.page
        SectionsBlog(title="our blog")
      div#portfolio.page
        SectionsPortfoilo(title="our work")
      div#newsletter.page
        SectionsNewsletter(title="Newsletter")
      div#contact.page
        SectionsContact

    AppFooter
    SocialMedia
    ScrollToTop
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'

const route = useRoute()
const url = useRequestURL()
const menuStore = useMenuStore()
const { theme } = useTheme()
const themeClass = computed(() => `theme-${theme.value}`)
const blogId = computed(() => {
	// Numeric ids (fallback posts) or CMS slugs
	const m = url.pathname.match(/^\/blog\/([\w-]+)/)
	return m ? m[1] : null
})
const isBlogList = computed(() => /^\/blog\/?$/.test(url.pathname))
const navBar = ref<HTMLElement | null>(null)

const navBarScroll = () => {
	if (!navBar.value) return
	navBar.value.classList.toggle('navbar-scroll', window.scrollY > 50)
}

function scrollToPage() {
	if (route.path === '/') {
		window.scrollTo({ top: 0, behavior: 'smooth' })
		return
	}
	const el = document.getElementById(route.path.slice(1))
	if (el) el.scrollIntoView()
}

const sectionPathMap: Record<string, string> = {
	Home: '/', about: '/about', services: '/services',
	portfolio: '/portfolio', blog: '/blog', contact: '/contact',
	testimonials: '/about',
}

let sectionObserver: IntersectionObserver | null = null

const initSectionObserver = () => {
	const sections = Object.keys(sectionPathMap)
		.map(id => document.getElementById(id))
		.filter(Boolean) as HTMLElement[]

	sectionObserver = new IntersectionObserver((entries) => {
		const visible = entries
			.filter(e => e.isIntersecting)
			.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
		if (visible) {
			const path = sectionPathMap[visible.target.id]
			if (path) menuStore.isActive(path)
		}
	}, { threshold: [0.3], rootMargin: '-10% 0px -10% 0px' })

	sections.forEach(el => sectionObserver!.observe(el))
}

onMounted(() => {
	if (blogId.value !== null || isBlogList.value) return
	navBarScroll()
	scrollToPage()
	initSectionObserver()
	window.navigation?.addEventListener('navigate', scrollToPage)
	window.addEventListener('scroll', navBarScroll)
})

onUnmounted(() => {
	window.removeEventListener('scroll', navBarScroll)
	sectionObserver?.disconnect()
})
</script>

<style scoped lang="scss">
</style>
