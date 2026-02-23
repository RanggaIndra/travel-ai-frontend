<script setup lang="ts">
import { error } from "#build/ui";
import { ref } from "vue";

const promptText = ref<string>("");
const isGenerating = ref<boolean>(false);
const errorMessage = ref<string>("");

const emit = defineEmits(["submit"]);

const generateTrip = async () => {
  if (!promptText.value) return;

  isGenerating.value = true;
  errorMessage.value = "";

  try {
    const api = useApi();
    const response = await api("/trip/generate-chat", {
      method: "POST",
      body: {
        prompt: promptText.value,
      },
    });

    emit("submit", { mode: "chat", payload: response });
  } catch (error: any) {
    console.error("Generate Chat Error:", error);
    errorMessage.value = error.data?.message || error.data?.error || "Gagal membuat itinerary. Pastikan prompt mencakup asal, tujuan, tanggal, dan budget.";
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Ceritakan liburan impianmu. AI kami akan menyusun jadwalnya untukmu!</p>

    <UTextarea v-model="promptText" autoresize :maxrows="6" placeholder="Contoh: Saya mau dari CGK ke DPS 5 hari besok, budget 5000000..." size="xl" class="w-full" />

    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

    <div class="flex justify-end mt-4">
      <UButton size="xl" icon="i-heroicons-sparkles" :loading="isGenerating" :disabled="!promptText" @click="generateTrip"> Generate AI Trip </UButton>
    </div>
  </div>
</template>
