export default defineAppConfig({
  ui: {
    primary: "orange",
    gray: "zinc",
    button: {
      default: {
        size: "lg",
      },
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