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
      apiBase: "https://dui-shed-attributes-active.trycloudflare.com/api",
    },
  },
});
