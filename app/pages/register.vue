<script setup lang="ts">
const api = useApi();
const auth = useAuth();
const form = reactive({ name: "", email: "", password: "", password_confirmation: "" });
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;
  try {
    const res: any = await api("/register", { method: "POST", body: form });
    auth.token.value = res.token;
    await auth.fetchUser();
    navigateTo("/");
  } catch (err) {
    alert("Gagal mendaftar. Pastikan email belum dipakai dan password cocok.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg bg-white dark:bg-zinc-900 dark:border-zinc-800">
    <h2 class="text-2xl font-bold text-center mb-6">Daftar Akun Baru</h2>
    <div class="space-y-4">
      <UFormField label="Nama"><UInput v-model="form.name" class="w-full" /></UFormField>
      <UFormField label="Email"><UInput v-model="form.email" type="email" class="w-full" /></UFormField>
      <UFormField label="Password"><UInput v-model="form.password" type="password" class="w-full" /></UFormField>
      <UFormField label="Konfirmasi Password"><UInput v-model="form.password_confirmation" type="password" class="w-full" /></UFormField>
      <UButton class="w-full justify-center" @click="handleRegister" :loading="loading">Daftar</UButton>
    </div>
  </div>
</template>
