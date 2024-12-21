export default defineNuxtConfig({
  typescript: {
    strict: true,  // Enable TypeScript strict mode
  },

  modules: [ '@nuxt/ui','@pinia/nuxt', '@nuxtjs/tailwindcss'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-12-20',
});