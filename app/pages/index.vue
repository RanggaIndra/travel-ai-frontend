<script setup lang="ts">
import { ref } from "vue";

const tabItems = [
  { label: "AI Assistant", icon: "i-heroicons-sparkles", slot: "chat" },
  { label: "Manual Planner", icon: "i-heroicons-adjustments-horizontal", slot: "form" },
];

const tripResult = ref<any>(null);

const handleTripSubmission = (eventData: { mode: string; payload: any }) => {
  console.log("Data diterima dari komponen:", eventData);

  const apiResponse = eventData.payload;

  if (apiResponse && apiResponse.status === "success") {
    tripResult.value = apiResponse;
  } else {
    alert("Gagal memproses respons dari server.");
  }
};

const resetPlanner = () => {
  tripResult.value = null;
};
</script>

<template>
  <div class="max-w-3xl mx-auto mt-10">
    <div class="text-center mb-10">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
        Rencanakan Perjalananmu <br class="hidden sm:block" />
        dalam <span class="text-orange-500">Hitungan Detik</span>
      </h1>
      <p class="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mt-4">Gunakan asisten AI cerdas kami atau isi form manual untuk mendapatkan itinerary lengkap beserta tiket dan hotel.</p>
    </div>

    <UCard v-if="!tripResult" class="shadow-xl dark:shadow-none border border-zinc-200 dark:border-zinc-800">
      <UTabs :items="tabItems" class="w-full">
        <template #chat>
          <div class="pt-6">
            <TripChatPlanner @submit="handleTripSubmission" />
          </div>
        </template>

        <template #form>
          <div class="pt-6">
            <TripManualPlanner @submit="handleTripSubmission" />
          </div>
        </template>
      </UTabs>
    </UCard>

    <UCard v-else class="shadow-xl dark:shadow-none border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
      <div class="text-center space-y-4">
        <UIcon name="i-heroicons-check-circle" class="w-16 h-16 text-green-500 mx-auto" />
        <h2 class="text-2xl font-bold text-green-700 dark:text-green-400">Itinerary Berhasil Dibuat!</h2>

        <div class="text-left bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 mt-4">
          <p><strong>Tujuan:</strong> {{ tripResult.data.destination }}</p>
          <p><strong>Durasi:</strong> {{ tripResult.data.duration_days }} Hari</p>
          <p><strong>Gaya Liburan:</strong> {{ tripResult.budget_info.category }} - {{ tripResult.budget_info.style }}</p>
        </div>

        <div class="flex gap-4 justify-center mt-6">
          <UButton v-if="tripResult.booking_url" :to="tripResult.booking_url" target="_blank" color="primary" icon="i-heroicons-ticket"> Cek Tiket Pesawat </UButton>

          <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-path" @click="resetPlanner"> Buat Perjalanan Baru </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
