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
  hub: {
    db: "postgresql",
  },
  i18n: {
    defaultLocale: "zh_cn",
    locales: [{ code: "zh_cn", file: "zh_cn.json" }],
  },
  routeRules: {
    "/console/**": { appLayout: "console" },
  },
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD!,
      cookie: {
        secure: process.env.NUXT_SESSION_COOKIE_SECURE !== "false",
      },
    },
    public: {
      casBaseUrl: "https://sso.dlut.edu.cn/cas",
      casServiceUrl:
        "https%3A%2F%2Fwebvpn.dlut.edu.cn%2Fhttp-3000%2F57787a7876706e323032336b6579402474170119f00b9c5dbe%2Fapi%2Fauth%2Fcas",
    },
  },
});
