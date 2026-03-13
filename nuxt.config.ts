// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@nuxtjs/mdc",
    "nuxt-auth-utils",
    "@nuxthub/core",
  ],
  ui: {
    fonts: false,
  },
  i18n: {
    locales: ["zh"],
  },
});
