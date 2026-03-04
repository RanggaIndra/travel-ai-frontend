<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const auth = useAuth();
const api = useApi();
const toast = useToast();

const activeSidebar = ref<"profile" | "history">("profile");

const form = reactive({
  name: "",
  email: "",
});

const loading = ref(false);
const historyLoading = ref(false);
const trips = ref<any[]>([]);

watch(
  () => auth.user.value,
  (u) => {
    if (u) {
      form.name = u.name;
      form.email = u.email;
    }
  },
  { immediate: true },
);

const updateProfile = async () => {
  loading.value = true;
  try {
    const res: any = await api("/user/profile", {
      method: "PUT",
      body: form,
    });
    auth.user.value = res.data;
    toast.add({ title: "Profil berhasil diperbarui", color: "success" });
  } catch (e: any) {
    toast.add({
      title: "Gagal memperbarui",
      description: e?.data?.message || "Terjadi kesalahan",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

const fetchHistory = async () => {
  historyLoading.value = true;
  try {
    const res: any = await api("/trip/history");
    trips.value = res.data ?? res ?? [];
  } catch (e) {
    trips.value = [];
  } finally {
    historyLoading.value = false;
  }
};

const switchTab = (tab: "profile" | "history") => {
  activeSidebar.value = tab;
  if (tab === "history" && trips.value.length === 0) {
    fetchHistory();
  }
};

const formatRupiah = (val: number) => {
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val ?? 0);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const sidebarItems = [
  { key: "profile", label: "Pengaturan Profil", icon: "i-heroicons-user-circle" },
  { key: "history", label: "Riwayat Perjalanan", icon: "i-heroicons-clock" },
];
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight">Akun Saya</h1>
      <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Kelola profil dan riwayat perjalananmu</p>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Sidebar -->
      <aside class="w-full md:w-60 shrink-0">
        <UCard class="border border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
          <!-- User avatar section -->
          <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
              <span class="text-2xl font-bold text-orange-500">
                {{ auth.user.value?.name?.charAt(0)?.toUpperCase() ?? "?" }}
              </span>
            </div>
            <p class="font-semibold text-sm truncate max-w-full">{{ auth.user.value?.name }}</p>
            <p class="text-xs text-zinc-400 truncate max-w-full">{{ auth.user.value?.email }}</p>
          </div>

          <!-- Nav items -->
          <nav class="p-2">
            <button
              v-for="item in sidebarItems"
              :key="item.key"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5"
              :class="activeSidebar === item.key ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
              @click="switchTab(item.key as 'profile' | 'history')"
            >
              <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
              {{ item.label }}
            </button>

            <!-- Divider -->
            <div class="border-t border-zinc-100 dark:border-zinc-800 my-2" />

            <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" @click="auth.logout()">
              <UIcon name="i-heroicons-arrow-right-start-on-rectangle" class="w-4 h-4 shrink-0" />
              Logout
            </button>
          </nav>
        </UCard>
      </aside>

      <!-- Main content -->
      <main class="flex-1 min-w-0">
        <!-- Profile Settings -->
        <div v-if="activeSidebar === 'profile'">
          <UCard class="border border-zinc-200 dark:border-zinc-800">
            <template #header>
              <h2 class="font-semibold text-base flex items-center gap-2">
                <UIcon name="i-heroicons-user-circle" class="text-orange-500" />
                Pengaturan Profil
              </h2>
            </template>

            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"> Nama Lengkap </label>
                <UInput v-model="form.name" placeholder="Nama kamu" icon="i-heroicons-user" size="md" />
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"> Alamat Email </label>
                <UInput v-model="form.email" type="email" placeholder="email@kamu.com" icon="i-heroicons-envelope" size="md" />
              </div>
            </div>

            <template #footer>
              <div class="flex justify-end">
                <UButton color="primary" :loading="loading" icon="i-heroicons-check" @click="updateProfile"> Simpan Perubahan </UButton>
              </div>
            </template>
          </UCard>

          <!-- Account info card -->
          <UCard class="border border-zinc-200 dark:border-zinc-800 mt-4">
            <template #header>
              <h2 class="font-semibold text-base flex items-center gap-2">
                <UIcon name="i-heroicons-information-circle" class="text-orange-500" />
                Informasi Akun
              </h2>
            </template>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800">
                <span class="text-zinc-500">Member sejak</span>
                <span class="font-medium">{{ formatDate(auth.user.value?.created_at) }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-zinc-500">Status akun</span>
                <UBadge color="success" variant="subtle" icon="i-heroicons-check-circle">Aktif</UBadge>
              </div>
            </div>
          </UCard>
        </div>

        <!-- History -->
        <div v-else-if="activeSidebar === 'history'">
          <UCard class="border border-zinc-200 dark:border-zinc-800">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="font-semibold text-base flex items-center gap-2">
                  <UIcon name="i-heroicons-clock" class="text-orange-500" />
                  Riwayat Perjalanan
                </h2>
                <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-path" size="xs" :loading="historyLoading" @click="fetchHistory" />
              </div>
            </template>

            <!-- Loading state -->
            <div v-if="historyLoading" class="flex justify-center py-12">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-orange-400 animate-spin" />
            </div>

            <!-- Empty state -->
            <div v-else-if="trips.length === 0" class="text-center py-16 text-zinc-400">
              <UIcon name="i-heroicons-map" class="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p class="font-medium">Belum ada perjalanan</p>
              <p class="text-sm mt-1">Buat itinerary pertamamu sekarang!</p>
              <UButton to="/" color="primary" variant="soft" class="mt-4" icon="i-heroicons-sparkles"> Buat Perjalanan </UButton>
            </div>

            <!-- Trip list -->
            <div v-else class="space-y-3">
              <div v-for="trip in trips" :key="trip.id" class="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 hover:border-orange-200 dark:hover:border-orange-900 transition-colors">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center shrink-0">
                      <UIcon name="i-heroicons-paper-airplane" class="text-orange-500 w-5 h-5 transform -rotate-45" />
                    </div>
                    <div class="min-w-0">
                      <p class="font-semibold text-sm truncate">
                        {{ trip.origin_city ?? trip.meta?.origin_city_code ?? "?" }}
                        →
                        {{ trip.dest_city ?? trip.meta?.dest_city_code ?? "?" }}
                      </p>
                      <p class="text-xs text-zinc-500 mt-0.5">
                        {{ formatDate(trip.date ?? trip.meta?.date) }}
                        · {{ trip.duration_days ?? trip.meta?.duration_days ?? "?" }} hari · {{ trip.travelers ?? trip.meta?.travelers ?? 1 }} orang
                      </p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-sm font-semibold text-orange-500">
                      {{ trip.total_budget ? formatRupiah(trip.total_budget) : "-" }}
                    </p>
                    <UBadge v-if="trip.source" color="neutral" variant="subtle" class="text-xs mt-1">
                      {{ trip.source === "chat" ? "AI" : "Manual" }}
                    </UBadge>
                  </div>
                </div>

                <p v-if="trip.notes || trip.budget_info?.style_description" class="text-xs text-zinc-400 mt-3 pt-3 border-t border-zinc-50 dark:border-zinc-800 line-clamp-2">
                  {{ trip.notes ?? trip.budget_info?.style_description }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </main>
    </div>
  </div>
</template>
