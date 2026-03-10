<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  middleware: "auth",
});

const tabItems = [
  { label: "AI Assistant", icon: "i-heroicons-sparkles", slot: "chat" },
  { label: "Manual Planner", icon: "i-heroicons-adjustments-horizontal", slot: "form" },
];

const tripResult = ref<any>(null);
const errorBanner = ref<string>("");

const handleTripSubmission = (eventData: { mode: string; payload: any }) => {
  const res = eventData.payload;
  if (res?.status === "success") {
    tripResult.value = res;
    errorBanner.value = "";
  } else {
    errorBanner.value = res?.message || "Gagal memproses respons dari server.";
  }
};

const resetPlanner = () => {
  tripResult.value = null;
  errorBanner.value = "";
};

const formatRupiah = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val ?? 0);

const formatFlightTime = (isoStr: string) => (isoStr ? isoStr.replace("T", " ").substring(0, 16) : "-");

// Convert Amadeus ISO duration "PT7H5M" → "7j 5m"
const formatDuration = (iso: string) => {
  if (!iso) return "";
  const h = iso.match(/(\d+)H/)?.[1];
  const m = iso.match(/(\d+)M/)?.[1];
  return [h ? `${h}j` : "", m ? `${m}m` : ""].filter(Boolean).join(" ");
};
</script>

<template>
  <div class="max-w-3xl mx-auto mt-10 pb-16 px-4">
    <!-- Hero -->
    <div class="text-center mb-10">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
        Rencanakan Perjalananmu <br class="hidden sm:block" />
        dalam <span class="text-orange-500">Hitungan Detik</span>
      </h1>
      <p class="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">Gunakan asisten AI cerdas kami atau isi form manual untuk mendapatkan itinerary lengkap beserta tiket dan hotel.</p>
    </div>

    <!-- Error banner -->
    <UAlert v-if="errorBanner" color="error" icon="i-heroicons-exclamation-triangle" :description="errorBanner" class="mb-6" />

    <!-- ===== PLANNER TABS ===== -->
    <UCard v-if="!tripResult" class="shadow-xl border border-zinc-200 dark:border-zinc-800">
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

    <!-- ===== RESULT VIEW ===== -->
    <div v-else class="space-y-5">
      <!-- Success header -->
      <UCard class="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
        <div class="flex items-center gap-4">
          <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-500 shrink-0" />
          <div>
            <h2 class="text-xl font-bold text-green-700 dark:text-green-400">Itinerary Berhasil Dibuat!</h2>
            <p class="text-sm text-zinc-500">
              Via <strong>{{ tripResult.source === "chat" ? "AI Assistant" : "Manual Planner" }}</strong> · Trip #{{ tripResult.trip_id }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Meta -->
      <UCard class="border border-zinc-200 dark:border-zinc-800">
        <h3 class="font-semibold text-base mb-3 flex items-center gap-2">
          <UIcon name="i-heroicons-information-circle" class="text-orange-500" />
          Ringkasan Perjalanan
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p class="text-zinc-500">Asal</p>
            <p class="font-semibold">{{ tripResult.meta?.origin_city_code }}</p>
          </div>
          <div>
            <p class="text-zinc-500">Tujuan</p>
            <p class="font-semibold">{{ tripResult.meta?.dest_city_code }}</p>
          </div>
          <div>
            <p class="text-zinc-500">Tanggal</p>
            <p class="font-semibold">{{ tripResult.meta?.date }}</p>
          </div>
          <div>
            <p class="text-zinc-500">Durasi</p>
            <p class="font-semibold">{{ tripResult.meta?.duration_days }} Hari</p>
          </div>
          <div>
            <p class="text-zinc-500">Traveler</p>
            <p class="font-semibold">{{ tripResult.meta?.travelers ?? 1 }} Orang</p>
          </div>
          <div>
            <p class="text-zinc-500">Kelayakan Budget</p>
            <p class="font-semibold">{{ tripResult.budget_info?.budget_feasibility ?? "-" }}</p>
          </div>
        </div>
      </UCard>

      <!-- Budget Analysis -->
      <UCard class="border border-zinc-200 dark:border-zinc-800">
        <h3 class="font-semibold text-base mb-3 flex items-center gap-2">
          <UIcon name="i-heroicons-banknotes" class="text-orange-500" />
          Analisis Budget
        </h3>
        <div class="space-y-1.5 text-sm">
          <div class="flex justify-between">
            <span class="text-zinc-500">Total Budget</span>
            <span class="font-semibold">{{ formatRupiah(tripResult.budget_info?.total_budget) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-500">Kategori</span>
            <UBadge color="primary" variant="subtle">{{ tripResult.budget_info?.category }}</UBadge>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-zinc-500 shrink-0">Gaya Perjalanan</span>
            <span class="text-right">{{ tripResult.budget_info?.style_description }}</span>
          </div>
          <div v-if="tripResult.budget_info?.estimated_breakdown" class="pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
            <p class="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Rincian Estimasi</p>
            <div v-for="(val, key) in tripResult.budget_info.estimated_breakdown" :key="key" class="flex justify-between">
              <span class="text-zinc-500 capitalize">{{ String(key).replaceAll("_", " ") }}</span>
              <span>{{ formatRupiah(val) }}</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- ===== FLIGHT LIVE ===== -->
      <UCard v-if="tripResult.flight_live" class="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
        <h3 class="font-semibold text-base mb-3 flex items-center gap-2">
          <UIcon name="i-heroicons-paper-airplane" class="text-blue-500" />
          Penerbangan Tersedia (Live Amadeus)
        </h3>

        <div class="text-sm space-y-3">
          <div v-for="(itin, i) in tripResult.flight_live?.itineraries" :key="i">
            <div v-for="(seg, si) in itin.segments" :key="seg.id ?? si" class="space-y-2">
              <!-- Segment row -->
              <div class="flex flex-wrap justify-between items-center py-1.5 gap-2 border-b border-blue-100 dark:border-blue-900 last:border-0">
                <span class="font-semibold min-w-[60px]">{{ seg.carrierCode }}{{ seg.number }}</span>
                <span class="text-zinc-600 dark:text-zinc-300"> {{ seg.departure?.iataCode }} → {{ seg.arrival?.iataCode }} </span>
                <span class="text-zinc-500 text-xs">{{ formatFlightTime(seg.departure?.at) }}</span>
                <span v-if="seg.duration" class="text-zinc-400 text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  {{ formatDuration(seg.duration) }}
                </span>
              </div>

              <!-- Transit layover alert (injected by backend) -->
              <div
                v-if="seg.transit_tips?.length"
                class="rounded-lg p-3 space-y-1.5"
                :class="seg.needs_transit_hotel ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800' : 'bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800'"
              >
                <div class="flex items-center gap-2 font-semibold text-xs uppercase tracking-wide" :class="seg.needs_transit_hotel ? 'text-amber-700 dark:text-amber-400' : 'text-sky-700 dark:text-sky-400'">
                  <UIcon :name="seg.needs_transit_hotel ? 'i-heroicons-moon' : 'i-heroicons-clock'" class="w-4 h-4 shrink-0" />
                  {{ seg.needs_transit_hotel ? `Transit Panjang — Disarankan Menginap (${seg.transit_layover_hours} jam)` : `Transit ${seg.transit_layover_hours} Jam — Tips Singkat` }}
                </div>
                <ul class="space-y-1">
                  <li v-for="(tip, ti) in seg.transit_tips" :key="ti" class="text-xs text-zinc-600 dark:text-zinc-400">
                    {{ tip }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Total price -->
          <div class="flex justify-between pt-2 font-semibold border-t border-blue-100 dark:border-blue-900">
            <span>Estimasi Harga</span>
            <span>{{ tripResult.flight_live?.price?.grandTotal ? formatRupiah(Number(tripResult.flight_live.price.grandTotal)) : "-" }}</span>
          </div>

          <!-- Flight booking buttons -->
          <div class="flex flex-wrap gap-2 pt-1">
            <UButton v-if="tripResult.traveloka_url" :to="tripResult.traveloka_url" target="_blank" size="sm" color="primary" icon="i-heroicons-ticket"> Pesan di Traveloka </UButton>
            <UButton v-if="tripResult.booking_url" :to="tripResult.booking_url" target="_blank" size="sm" color="neutral" variant="soft" icon="i-heroicons-globe-alt"> Cari di Booking.com </UButton>
          </div>
        </div>
      </UCard>

      <!-- No flight fallback — still show search buttons -->
      <div v-else class="space-y-3">
        <UAlert color="neutral" icon="i-heroicons-information-circle" title="Data penerbangan live tidak tersedia" description="Gunakan tombol di bawah untuk mencari tiket secara manual." />
        <div class="flex flex-wrap gap-2">
          <UButton v-if="tripResult.traveloka_url" :to="tripResult.traveloka_url" target="_blank" size="sm" color="primary" icon="i-heroicons-ticket"> Cari di Traveloka </UButton>
          <UButton v-if="tripResult.booking_url" :to="tripResult.booking_url" target="_blank" size="sm" color="neutral" variant="soft" icon="i-heroicons-globe-alt"> Cari di Booking.com </UButton>
        </div>
      </div>

      <!-- ===== ITINERARY ===== -->
      <UCard class="border border-zinc-200 dark:border-zinc-800">
        <h3 class="font-semibold text-base mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-map" class="text-orange-500" />
          Itinerary Harian
        </h3>
        <div class="space-y-6">
          <div v-for="day in tripResult.itinerary" :key="day.day">
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                {{ day.day }}
              </span>
              <h4 class="font-semibold">Hari {{ day.day }}{{ day.theme ? ` — ${day.theme}` : "" }}</h4>
            </div>
            <div class="space-y-3 pl-8">
              <div v-for="(act, ai) in day.activities" :key="ai" class="flex gap-3 text-sm">
                <span class="text-zinc-400 w-14 shrink-0 pt-0.5">{{ act.time }}</span>
                <div class="space-y-0.5">
                  <p class="font-medium">{{ act.activity }}</p>
                  <p v-if="act.location" class="text-zinc-500 text-xs">📍 {{ act.location }}</p>
                  <p v-if="act.estimated_cost" class="text-orange-500 text-xs">~{{ formatRupiah(act.estimated_cost) }}</p>
                  <p v-if="act.notes" class="text-zinc-400 italic text-xs">{{ act.notes }}</p>
                </div>
              </div>
            </div>
            <p v-if="day.daily_total_estimated" class="text-right text-xs text-zinc-400 mt-2">Total hari ini: ~{{ formatRupiah(day.daily_total_estimated) }}</p>
          </div>
        </div>
      </UCard>

      <!-- ===== HOTELS ===== -->
      <UCard v-if="tripResult.tips?.hotels?.length" class="border border-zinc-200 dark:border-zinc-800">
        <h3 class="font-semibold text-base mb-3 flex items-center gap-2">
          <UIcon name="i-heroicons-building-office-2" class="text-orange-500" />
          Rekomendasi Hotel
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="(hotel, i) in tripResult.tips.hotels" :key="i" class="border border-zinc-100 dark:border-zinc-800 rounded-lg p-3 text-sm">
            <p class="font-semibold">{{ hotel.name }}</p>
            <p class="text-zinc-500 text-xs">{{ hotel.area }}</p>
            <UBadge color="neutral" variant="subtle" class="mt-1 text-xs">{{ hotel.category }}</UBadge>
            <p class="text-orange-500 mt-1">{{ formatRupiah(hotel.estimated_price_per_night) }} / malam</p>

            <div class="flex flex-wrap gap-2 mt-3">
              <!-- Traveloka — primary -->
              <UButton v-if="hotel.traveloka_search_url" :to="hotel.traveloka_search_url" target="_blank" size="xs" color="primary" variant="soft" icon="i-heroicons-building-office-2"> Traveloka </UButton>
              <!-- Booking.com -->
              <UButton v-if="hotel.booking_search_url" :to="hotel.booking_search_url" target="_blank" size="xs" color="neutral" variant="soft" icon="i-heroicons-building-office-2"> Booking.com </UButton>
              <!-- Agoda -->
              <UButton v-if="hotel.agoda_search_url" :to="hotel.agoda_search_url" target="_blank" size="xs" color="neutral" variant="soft" icon="i-heroicons-globe-alt"> Agoda </UButton>
            </div>
          </div>
        </div>
      </UCard>

      <!-- ===== MUST EAT ===== -->
      <UCard v-if="tripResult.tips?.must_eat?.length" class="border border-zinc-200 dark:border-zinc-800">
        <h3 class="font-semibold text-base mb-3 flex items-center gap-2">
          <UIcon name="i-heroicons-cake" class="text-orange-500" />
          Kuliner Wajib Coba
        </h3>
        <div class="space-y-1 text-sm">
          <div v-for="(eat, i) in tripResult.tips.must_eat" :key="i" class="flex justify-between items-start border-b border-zinc-50 dark:border-zinc-800 py-1.5 last:border-0">
            <div>
              <p class="font-medium">{{ eat.name }}</p>
              <p class="text-zinc-400 text-xs">{{ eat.type }}</p>
            </div>
            <p class="text-orange-500 shrink-0 ml-4">~{{ formatRupiah(eat.approx_price) }}</p>
          </div>
        </div>
      </UCard>

      <!-- ===== LOCAL TIPS ===== -->
      <UCard v-if="tripResult.tips?.local_tips?.length" class="border border-zinc-200 dark:border-zinc-800">
        <h3 class="font-semibold text-base mb-3 flex items-center gap-2">
          <UIcon name="i-heroicons-light-bulb" class="text-orange-500" />
          Tips Lokal
        </h3>
        <ul class="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li v-for="(tip, i) in tripResult.tips.local_tips" :key="i" class="flex gap-2">
            <UIcon name="i-heroicons-check-circle" class="text-orange-400 mt-0.5 shrink-0 w-4 h-4" />
            {{ tip }}
          </li>
        </ul>
        <p v-if="tripResult.tips?.best_time_to_visit" class="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500">🗓 <strong>Waktu terbaik:</strong> {{ tripResult.tips.best_time_to_visit }}</p>
      </UCard>

      <!-- ===== BOTTOM CTA ===== -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <UButton v-if="tripResult.traveloka_url" :to="tripResult.traveloka_url" target="_blank" color="primary" size="lg" icon="i-heroicons-ticket"> Cari Tiket di Traveloka </UButton>
        <UButton v-if="tripResult.booking_url" :to="tripResult.booking_url" target="_blank" color="neutral" variant="soft" size="lg" icon="i-heroicons-globe-alt"> Cari di Booking.com </UButton>
        <UButton color="neutral" variant="outline" size="lg" icon="i-heroicons-arrow-path" @click="resetPlanner"> Buat Perjalanan Baru </UButton>
      </div>
    </div>
  </div>
</template>
