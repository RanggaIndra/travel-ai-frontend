<script setup lang="ts">
interface FormState {
  origin: string;
  destination: string;
  duration: number;
  budget: "Hemat" | "Standar" | "Mewah";
  interests: string;
}

const formState = reactive<FormState>({
  origin: "Bali",
  destination: "",
  duration: 3,
  budget: "Standar",
  interests: "",
});

const budgetOptions = ["Hemat", "Standar", "Mewah"];
const isGenerating = ref<boolean>(false);
const emit = defineEmits(["submit"]);

const generateTrip = () => {
  isGenerating.value = true;
  setTimeout(() => {
    isGenerating.value = false;
    emit("submit", { mode: "form", payload: formState });
  }, 1000);
};
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Kota Asal">
        <UInput v-model="formState.origin" icon="i-heroicons-paper-airplane" placeholder="Misal: Jakarta" class="w-full" />
      </UFormField>

      <UFormField label="Kota Tujuan">
        <UInput v-model="formState.destination" icon="i-heroicons-map-pin" placeholder="Misal: Kyoto" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Durasi (Hari)">
        <UInput v-model="formState.duration" type="number" min="1" icon="i-heroicons-calendar" class="w-full" />
      </UFormField>

      <UFormField label="Tingkat Budget">
        <USelect v-model="formState.budget" :items="budgetOptions" icon="i-heroicons-banknotes" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="Minat / Aktivitas Kesukaan">
      <UInput v-model="formState.interests" icon="i-heroicons-heart" placeholder="Misal: Kuliner, Pantai, Belanja, Sejarah..." class="w-full" />
    </UFormField>

    <div class="flex justify-end pt-4">
      <UButton size="xl" icon="i-heroicons-magnifying-glass" :loading="isGenerating" @click="generateTrip"> Cari Itinerary </UButton>
    </div>
  </div>
</template>
