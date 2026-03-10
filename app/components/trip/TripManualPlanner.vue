<script setup lang="ts">
import { reactive, ref, computed } from "vue";

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

// -------------------------------------------------------------------------
// BUG #1 & #2 — Uppercase handler (v-model + CSS class tidak cukup)
// -------------------------------------------------------------------------
const setOrigin = (val: string) => {
  formState.origin_city_code = val
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3);
};
const setDest = (val: string) => {
  formState.dest_city_code = val
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3);
};

// -------------------------------------------------------------------------
// BUG #3 — Validasi frontend
// -------------------------------------------------------------------------
const validationErrors = computed(() => {
  const errs: Record<string, string> = {};

  if (formState.origin_city_code.length > 0 && formState.origin_city_code.length !== 3) errs.origin = "Kode IATA harus tepat 3 huruf (contoh: CGK)";

  if (formState.dest_city_code.length !== 3) errs.dest = "Kode IATA harus tepat 3 huruf (contoh: NRT)";

  if (formState.budget < 500000) errs.budget = "Budget minimal Rp 500.000";

  if (formState.budget > 1000000000) errs.budget = "Budget maksimal Rp 1.000.000.000";

  if (formState.duration < 1 || formState.duration > 30) errs.duration = "Durasi antara 1–30 hari";

  if (formState.travelers < 1 || formState.travelers > 20) errs.travelers = "Jumlah traveler antara 1–20 orang";

  const today = new Date().toISOString().split("T")[0];
  if (formState.date < today) errs.date = "Tanggal harus hari ini atau setelahnya";

  return errs;
});

const isFormValid = computed(() => Object.keys(validationErrors.value).length === 0);

// -------------------------------------------------------------------------
// BUG #4 — Format budget readable
// -------------------------------------------------------------------------
const formatBudgetDisplay = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val || 0);

// Budget presets untuk quick-pick
const budgetPresets = [
  { label: "Rp 3 jt", value: 3_000_000 },
  { label: "Rp 5 jt", value: 5_000_000 },
  { label: "Rp 10 jt", value: 10_000_000 },
  { label: "Rp 20 jt", value: 20_000_000 },
  { label: "Rp 50 jt", value: 50_000_000 },
];

// -------------------------------------------------------------------------
// Options
// -------------------------------------------------------------------------
const travelStyleOptions = [
  { label: "🎒 Backpacker", value: "backpacker" },
  { label: "🛋 Comfort", value: "comfort" },
  { label: "💎 Luxury", value: "luxury" },
];

const interestOptions = [
  { label: "🏛 Budaya", value: "culture" },
  { label: "🌿 Alam", value: "nature" },
  { label: "🍜 Kuliner", value: "culinary" },
  { label: "🧗 Petualangan", value: "adventure" },
  { label: "🛍 Belanja", value: "shopping" },
  { label: "🧘 Wellness", value: "wellness" },
  { label: "🌙 Malam", value: "nightlife" },
];

const toggleInterest = (value: string) => {
  const idx = formState.interests.indexOf(value);
  if (idx === -1) formState.interests.push(value);
  else formState.interests.splice(idx, 1);
};

// -------------------------------------------------------------------------
// Submit
// -------------------------------------------------------------------------
const generateTrip = async () => {
  if (!isFormValid.value) return;

  isGenerating.value = true;
  errorMessage.value = "";

  try {
    const response = await api("/trip/generate", {
      method: "POST",
      body: {
        origin_city_code: formState.origin_city_code,
        dest_city_code: formState.dest_city_code,
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
      <UFormField label="Kota Asal (Kode IATA)">
        <UInput
          :model-value="formState.origin_city_code"
          maxlength="3"
          icon="i-heroicons-paper-airplane"
          placeholder="CGK"
          class="w-full font-mono tracking-widest uppercase"
          :color="validationErrors.origin ? 'error' : undefined"
          @update:model-value="setOrigin"
        />
        <p v-if="validationErrors.origin" class="text-red-500 text-xs mt-1">
          {{ validationErrors.origin }}
        </p>
      </UFormField>

      <UFormField label="Kota Tujuan (Kode IATA)">
        <UInput
          :model-value="formState.dest_city_code"
          maxlength="3"
          icon="i-heroicons-map-pin"
          placeholder="NRT"
          class="w-full font-mono tracking-widest uppercase"
          :color="validationErrors.dest ? 'error' : undefined"
          @update:model-value="setDest"
        />
        <p v-if="validationErrors.dest" class="text-red-500 text-xs mt-1">
          {{ validationErrors.dest }}
        </p>
      </UFormField>
    </div>

    <!-- Row 2: Tanggal & Durasi -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Tanggal Berangkat">
        <UInput v-model="formState.date" type="date" icon="i-heroicons-calendar-days" class="w-full" :color="validationErrors.date ? 'error' : undefined" />
        <p v-if="validationErrors.date" class="text-red-500 text-xs mt-1">
          {{ validationErrors.date }}
        </p>
      </UFormField>

      <UFormField label="Durasi (Hari)">
        <UInput v-model.number="formState.duration" type="number" min="1" max="30" icon="i-heroicons-clock" class="w-full" :color="validationErrors.duration ? 'error' : undefined" />
        <p v-if="validationErrors.duration" class="text-red-500 text-xs mt-1">
          {{ validationErrors.duration }}
        </p>
      </UFormField>
    </div>

    <!-- Row 3: Budget & Travelers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Total Budget (IDR)">
        <UInput v-model.number="formState.budget" type="number" min="500000" max="1000000000" icon="i-heroicons-banknotes" placeholder="5000000" class="w-full" :color="validationErrors.budget ? 'error' : undefined" />
        <!-- BUG #4: Format readable di bawah input -->
        <p class="text-xs mt-1" :class="validationErrors.budget ? 'text-red-500' : 'text-zinc-400'">
          {{ validationErrors.budget || formatBudgetDisplay(formState.budget) }}
        </p>
        <!-- Quick preset buttons -->
        <div class="flex gap-1.5 flex-wrap mt-2">
          <button
            v-for="p in budgetPresets"
            :key="p.value"
            type="button"
            class="text-xs px-2 py-0.5 rounded-full border transition-colors"
            :class="formState.budget === p.value ? 'bg-orange-500 border-orange-500 text-white' : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:border-orange-400 hover:text-orange-500'"
            @click="formState.budget = p.value"
          >
            {{ p.label }}
          </button>
        </div>
      </UFormField>

      <UFormField label="Jumlah Traveler">
        <UInput v-model.number="formState.travelers" type="number" min="1" max="20" icon="i-heroicons-users" class="w-full" :color="validationErrors.travelers ? 'error' : undefined" />
        <p v-if="validationErrors.travelers" class="text-red-500 text-xs mt-1">
          {{ validationErrors.travelers }}
        </p>
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

    <!-- API error -->
    <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

    <div class="flex justify-end pt-2">
      <UButton size="xl" icon="i-heroicons-magnifying-glass" :loading="isGenerating" :disabled="!isFormValid || isGenerating" @click="generateTrip"> Buat Itinerary </UButton>
    </div>
  </div>
</template>
