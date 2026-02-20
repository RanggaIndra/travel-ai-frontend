<script setup lang="ts">
const colorMode = useColorMode();
const auth = useAuth();

onMounted(() => {
  auth.fetchUser();
});

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
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl tracking-tight text-orange-500">
          <UIcon name="i-heroicons-paper-airplane" class="w-6 h-6 transform -rotate-45" />
          Travel.AI
        </NuxtLink>

        <div class="flex items-center gap-4">
          <ClientOnly>
            <UButton :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="neutral" variant="ghost" aria-label="Theme" @click="isDark = !isDark" />
          </ClientOnly>

          <template v-if="auth.user.value">
            <UButton to="/history" color="neutral" variant="ghost" icon="i-heroicons-clock" label="History" />
            <UButton color="neutral" variant="outline" icon="i-heroicons-user" :label="auth.user.value.name" />
            <UButton color="error" variant="ghost" icon="i-heroicons-arrow-right-start-on-rectangle" @click="auth.logout" />
          </template>
          <template v-else>
            <UButton to="/login" color="primary" variant="solid" label="Sign In" />
          </template>
        </div>
      </div>
    </header>
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"><slot /></main>
  </div>
</template>
