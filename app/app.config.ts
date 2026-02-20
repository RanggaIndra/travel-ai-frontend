export default defineAppConfig({
  ui: {
    colors: {
      primary: "orange",
      neutral: "zinc",
    },
  },

  tabs: {
    list: {
      tab: {
        active: "bg-orange-500 text-white dark:bg-orange-500",
        inactive: "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200",
      },
    },
  },
});
