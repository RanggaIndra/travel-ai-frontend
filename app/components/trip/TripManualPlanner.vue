<script setup lang="ts">
import { reactive, ref } from "vue";

interface FormState {
  origin_city_code: string;
  dest_city_code: string;
  date: string;
  duration: number;
  budget: number;
  travel_style: "backpacker" | "comfort" | "luxury" | "";
  travelers: number;
  interests: string[];
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const defaultDate = tomorrow.toISOString().split("T")[0];

const api = useApi();

const formState = reactive<FormState>({
  origin_city_code: "CGK",
  dest_city_code: "DPS",
  date: defaultDate,
  duration: 3,
  budget: 5000000,
  travel_style: "comfort",
  travelers: 1,
  interests: [],
});

const isGenerating = ref<boolean>(false);
const errorMessage = ref<string>("");

const emit = defineEmits<{
  (e: "submit", value: { mode: string; payload: any }): void;
}>();

const travelStyleOptions = [
  { label: "Backpacker", value: "backpacker" },
  { label: "Comfort", value: "comfort" },
  { label: "Luxury", value: "luxury" },
];

const interestOptions = [
  { label: "Budaya", value: "culture" },
  { label: "Alam", value: "nature" },
  { label: "Kuliner", value: "culinary" },
  { label: "Petualangan", value: "adventure" },
  { label: "Belanja", value: "shopping" },
  { label: "Wellness", value: "wellness" },
  { label: "Malam", value: "nightlife" },
];

const toggleInterest = (value: string) => {
  const idx = formState.interests.indexOf(value);
  if (idx === -1) formState.interests.push(value);
  else formState.interests.splice(idx, 1);
};

const generateTrip = async () => {
  isGenerating.value = true;
  errorMessage.value = "";

  try {
    // ✅ Unified endpoint — backend detects form mode via presence of dest_city_code
    const response = await api("/trip/generate", {
      method: "POST",
      body: {
        origin_city_code: formState.origin_city_code.toUpperCase(),
        dest_city_code: formState.dest_city_code.toUpperCase(),
        date: formState.date,
        duration: formState.duration,
        budget: formState.budget,
        travel_style: formState.travel_style || undefined,
        travelers: formState.travelers,
        interests: formState.interests.length ? formState.interests : undefined,
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
  <div class="space-y-5">
    <!-- Row 1: Asal & Tujuan -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Kode Kota Asal (IATA)">
        <UInput v-model="formState.origin_city_code" maxlength="3" icon="i-heroicons-paper-airplane" placeholder="CGK" class="w-full uppercase" />
      </UFormField>

      <UFormField label="Kode Kota Tujuan (IATA)">
        <UInput v-model="formState.dest_city_code" maxlength="3" icon="i-heroicons-map-pin" placeholder="NRT" class="w-full uppercase" />
      </UFormField>
    </div>

    <!-- Row 2: Tanggal & Durasi -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Tanggal Berangkat">
        <UInput v-model="formState.date" type="date" icon="i-heroicons-calendar-days" class="w-full" />
      </UFormField>

      <UFormField label="Durasi (Hari)">
        <UInput v-model.number="formState.duration" type="number" min="1" max="30" icon="i-heroicons-clock" class="w-full" />
      </UFormField>
    </div>

    <!-- Row 3: Budget & Travelers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Total Budget (IDR)">
        <UInput v-model.number="formState.budget" type="number" min="500000" icon="i-heroicons-banknotes" placeholder="5000000" class="w-full" />
      </UFormField>

      <UFormField label="Jumlah Traveler">
        <UInput v-model.number="formState.travelers" type="number" min="1" max="20" icon="i-heroicons-users" class="w-full" />
      </UFormField>
    </div>

    <!-- Row 4: Travel Style -->
    <UFormField label="Gaya Perjalanan">
      <div class="flex gap-2 flex-wrap">
        <UButton
          v-for="s in travelStyleOptions"
          :key="s.value"
          size="sm"
          :variant="formState.travel_style === s.value ? 'solid' : 'outline'"
          :color="formState.travel_style === s.value ? 'primary' : 'neutral'"
          @click="formState.travel_style = s.value as any"
        >
          {{ s.label }}
        </UButton>
      </div>
    </UFormField>

    <!-- Row 5: Interests -->
    <UFormField label="Minat (Opsional)">
      <div class="flex gap-2 flex-wrap">
        <UButton
          v-for="i in interestOptions"
          :key="i.value"
          size="sm"
          :variant="formState.interests.includes(i.value) ? 'solid' : 'outline'"
          :color="formState.interests.includes(i.value) ? 'primary' : 'neutral'"
          @click="toggleInterest(i.value)"
        >
          {{ i.label }}
        </UButton>
      </div>
    </UFormField>

    <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

    <div class="flex justify-end pt-2">
      <UButton size="xl" icon="i-heroicons-magnifying-glass" :loading="isGenerating" :disabled="!formState.dest_city_code || isGenerating" @click="generateTrip"> Buat Itinerary </UButton>
    </div>
  </div>
</template>
