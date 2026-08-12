// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      cmsBase: 'https://cms.oluxstudio.com', // override: NUXT_PUBLIC_CMS_BASE
      cmsSite: 'studio', // override: NUXT_PUBLIC_CMS_SITE
    },
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2' }],
    },
  },
  css: ['@/assets/styles/main.css'],
  modules: ['@pinia/nuxt'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/_variables" as *;\n`,
        },
      },
    },
  },
})
