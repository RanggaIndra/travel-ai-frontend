<script setup lang="ts">
// Konfigurasi Tab UI
const tabItems = [
  { label: "AI Assistant", icon: "i-heroicons-sparkles", slot: "chat" },
  { label: "Manual Planner", icon: "i-heroicons-adjustments-horizontal", slot: "form" },
];

// Menangkap data dari komponen anak
const handleTripSubmission = (eventData: { mode: string; payload: any }) => {
  console.log("Data diterima dari komponen:", eventData);

  if (eventData.mode === "chat") {
    // Nanti kirim ke: POST /api/trip/generate-chat
    alert(`Mengirim Prompt ke API Laravel:\n${eventData.payload}`);
  } else {
    // Nanti kirim ke: POST /api/trip/generate-form
    alert(`Mengirim Form ke API Laravel untuk tujuan: ${eventData.payload.destination}`);
  }
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

    <UCard class="shadow-xl dark:shadow-none border border-zinc-200 dark:border-zinc-800">
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
  </div>
</template>
