// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },

  server: {
    headers: {
      'Content-Type': 'text/css',
    },
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    // '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    // '@nuxt/test-utils',
    '@nuxt/ui'
  ],

  css: ['~/assets/css/main.css']
})