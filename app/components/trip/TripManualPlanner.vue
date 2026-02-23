<script setup lang="ts">
import { reactive, ref } from "vue";

interface FormState {
  origin_city_code: string;
  dest_city_code: string;
  date: string;
  duration: number;
  budget: number;
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const defaultDate = tomorrow.toISOString().split("T")[0];

const formState = reactive<FormState>({
  origin_city_code: "CGK",
  dest_city_code: "DPS",
  date: defaultDate,
  duration: 3,
  budget: 5000000,
});

const isGenerating = ref<boolean>(false);
const errorMessage = ref<string>("");
const emit = defineEmits(["submit"]);

const generateTrip = async () => {
  isGenerating.value = true;
  errorMessage.value = "";

  try {
    const api = useApi();
    const response = await api("/trip/generate-form", {
      method: "POST",
      body: {
        origin_city_code: formState.origin_city_code.toUpperCase(),
        dest_city_code: formState.dest_city_code.toUpperCase(),
        date: formState.date,
        duration: formState.duration,
        budget: formState.budget,
      },
    });

    emit("submit", { mode: "form", payload: response });
  } catch (error: any) {
    console.error("Generate Form Error:", error);
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat().join(", ");
    } else {
      errorMessage.value = error.data?.message || "Terjadi kesalahan saat membuat itinerary.";
    }
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Kode Kota Asal (3 Huruf IATA)">
        <UInput v-model="formState.origin_city_code" maxlength="3" icon="i-heroicons-paper-airplane" placeholder="Misal: CGK" class="w-full uppercase" />
      </UFormField>

      <UFormField label="Kode Kota Tujuan (3 Huruf IATA)">
        <UInput v-model="formState.dest_city_code" maxlength="3" icon="i-heroicons-map-pin" placeholder="Misal: NRT" class="w-full uppercase" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Tanggal Berangkat">
        <UInput v-model="formState.date" type="date" icon="i-heroicons-calendar-days" class="w-full" />
      </UFormField>

      <UFormField label="Durasi (Hari)">
        <UInput v-model="formState.duration" type="number" min="1" icon="i-heroicons-clock" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="Total Budget (Min. Rp 1.000.000)">
      <UInput v-model="formState.budget" type="number" min="1000000" icon="i-heroicons-banknotes" placeholder="Misal: 5000000" class="w-full" />
    </UFormField>

    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

    <div class="flex justify-end pt-4">
      <UButton size="xl" icon="i-heroicons-magnifying-glass" :loading="isGenerating" @click="generateTrip"> Cari Itinerary </UButton>
    </div>
  </div>
</template>
