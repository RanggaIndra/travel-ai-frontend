<script setup lang="ts">
const promptText = ref<string>("");
const isGenerating = ref<boolean>(false);

const emit = defineEmits(["submit"]);

const generateTrip = () => {
  if (!promptText.value) return;
  isGenerating.value = true;

  // Simulate API Delay
  setTimeout(() => {
    isGenerating.value = false;
    emit("submit", { mode: "chat", payload: promptText.value });
  }, 1000);
};
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Ceritakan liburan impianmu. AI kami akan menyusun jadwalnya untukmu!</p>
    <UTextarea v-model="promptText" autoresize :maxrows="6" placeholder="Contoh: Saya mau ke Tokyo 5 hari bulan depan, budget 10 juta, suka anime dan kuliner lokal..." size="xl" class="w-full" />
    <div class="flex justify-end mt-4">
      <UButton size="xl" icon="i-heroicons-sparkles" :loading="isGenerating" :disabled="!promptText" @click="generateTrip"> Generate AI Trip </UButton>
    </div>
  </div>
</template>
