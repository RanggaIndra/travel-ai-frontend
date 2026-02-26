<script setup lang="ts">
import { ref } from "vue";

const promptText = ref<string>("");
const isGenerating = ref<boolean>(false);
const errorMessage = ref<string>("");
const api = useApi();

const emit = defineEmits<{
  (e: "submit", value: { mode: string; payload: any }): void;
}>();

const generateTrip = async () => {
  if (!promptText.value.trim()) return;

  isGenerating.value = true;
  errorMessage.value = "";

  try {
    // ✅ Unified endpoint — matches backend POST /api/trip/generate
    const response = await api("/trip/generate", {
      method: "POST",
      body: { prompt: promptText.value.trim() },
    });

    emit("submit", { mode: "chat", payload: response });
  } catch (error: any) {
    console.error("Generate Chat Error:", error);
    errorMessage.value = error.data?.message || error.data?.error || "Gagal membuat itinerary. Coba tulis tujuan, tanggal, dan budget dengan lebih jelas.";
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Ceritakan liburan impianmu. Sertakan asal, tujuan, tanggal, durasi, dan budget agar AI bisa menyusun itinerary terbaik!</p>

    <UTextarea v-model="promptText" autoresize :maxrows="6" placeholder="Contoh: Saya mau dari CGK ke Tokyo (TYO) 5 hari, berangkat 2026-04-10, budget 8 juta, suka kuliner dan budaya." size="xl" class="w-full" />

    <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

    <div class="flex justify-end mt-4">
      <UButton size="xl" icon="i-heroicons-sparkles" :loading="isGenerating" :disabled="!promptText.trim() || isGenerating" @click="generateTrip"> Generate AI Trip </UButton>
    </div>
  </div>
</template>
