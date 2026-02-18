<script setup lang="ts">
// 💡 BELAJAR TYPESCRIPT: INTERFACE
// Interface adalah "Cetakan" atau "Kontrak" bentuk data.
// Kita memaksa formState untuk HANYA boleh berisi data di bawah ini.
interface FormState {
  destination: string;
  pax: number;
  budget: "Hemat" | "Standar" | "Mewah"; // Hanya boleh 3 teks ini, selain itu TS akan Error!
}

// Menerapkan interface ke dalam reactive state Vue
const formState = reactive<FormState>({
  destination: "",
  pax: 1,
  budget: "Standar", // Coba kamu ganti jadi 'Miskin', garis merah akan muncul di VS Code!
});

const budgetOptions = ["Hemat", "Standar", "Mewah"];

// State untuk UI
const promptText = ref<string>("");
const isGenerating = ref<boolean>(false);

// Fungsi Generate
const generateItinerary = async (mode: "chat" | "form") => {
  isGenerating.value = true;
  setTimeout(() => {
    isGenerating.value = false;
    alert(`Data siap dikirim ke Laravel via mode: ${mode}`);
  }, 1500);
};

// Konfigurasi Tab UI
const tabItems = [
  { key: "chat", label: "AI Assistant", icon: "i-heroicons-sparkles" },
  { key: "form", label: "Manual Planner", icon: "i-heroicons-adjustments-horizontal" },
];
</script>

<template>
  <div class="max-w-3xl mx-auto mt-10">
    <div class="text-center mb-10">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
        Rencanakan Perjalananmu <br class="hidden sm:block" />
        dalam <span class="text-orange-500">Hitungan Detik</span>
      </h1>
    </div>

    <UCard class="shadow-xl dark:shadow-none border border-zinc-200 dark:border-zinc-800">
      <UTabs :items="tabItems" class="w-full">
        <template #item="{ item }">
          <div class="pt-6">
            <div v-if="item.key === 'chat'" class="space-y-4">
              <UTextarea v-model="promptText" autoresize :maxrows="6" placeholder="Contoh: Buatkan saya itinerary 3 hari di Tokyo..." size="xl" />
              <div class="flex justify-end">
                <UButton size="xl" icon="i-heroicons-paper-airplane" :loading="isGenerating" @click="generateItinerary('chat')"> Generate AI Trip </UButton>
              </div>
            </div>

            <div v-else-if="item.key === 'form'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Kota Tujuan">
                  <UInput v-model="formState.destination" icon="i-heroicons-map-pin" placeholder="Misal: Kyoto" />
                </UFormGroup>

                <UFormGroup label="Jumlah Peserta">
                  <UInput v-model="formState.pax" type="number" min="1" icon="i-heroicons-user-group" />
                </UFormGroup>
              </div>

              <UFormGroup label="Tingkat Budget">
                <USelect v-model="formState.budget" :options="budgetOptions" icon="i-heroicons-banknotes" />
              </UFormGroup>

              <div class="flex justify-end pt-2">
                <UButton size="xl" icon="i-heroicons-magifying-glass" :loading="isGenerating" @click="generateItinerary('form')"> Cari Itinerary </UButton>
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </UCard>
  </div>
</template>
