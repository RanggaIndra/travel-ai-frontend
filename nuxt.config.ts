// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui"],

  colorMode: {
    preference: "system",
    fallback: "light",
  },

  // future: {
  //   compatibilityVersion: 4,
  // },

  css: ["~/assets/css/main.css"],

  srcDir: "app/",

  runtimeConfig: {
    public: {
      apiBase: "https://ebook-hardcover-cherry-keith.trycloudflare.com/api",
    },
  },
});
