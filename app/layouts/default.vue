<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (val) => {
    colorMode.preference = val ? "dark" : "light";
  },
});
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2 font-bold text-xl tracking-tight text-orange-500">
          <UIcon name="i-heroicons-paper-airplane" class="w-6 h-6 transform -rotate-45" />
          Travel.AI
        </div>

        <div class="flex items-center gap-4">
          <ClientOnly>
            <UButton :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="neutral" variant="ghost" aria-label="Theme" @click="isDark = !isDark" />
            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>

          <UButton color="primary" variant="solid" label="Sign In" />
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <slot />
    </main>
  </div>
</template>
