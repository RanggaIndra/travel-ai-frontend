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

  srcDir: "app/",

  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8000/api",
    },
  },
});
