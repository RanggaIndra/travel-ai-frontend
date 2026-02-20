<script setup lang="ts">
import { error } from "#build/ui";

const api = useApi();
const auth = useAuth();
const form = reactive({ email: "", password: "" });
const errorMsg = ref("");
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    const res: any = await api("/login", { method: "POST", body: form });
    auth.token.value = res.token;
    auth.user.value = res.user;
    navigateTo("/");
  } catch (err: any) {
    errorMsg.value = err.response?._data?.message || "Login Gagal";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg bg-white dark:bg-zinc-900 dark:border-zinc-800">
    <h2 class="text-2xl font-bold text-center mb-6">Masuk ke Travel.AI</h2>
    <p v-if="errorMsg" class="text-red-500 text-sm mb-4 text-center">{{ errorMsg }}</p>

    <div class="space-y-4">
      <UFormField label="Email">
        <UInput v-model="form.email" type="email" class="w-full" />
      </UFormField>
      <UFormField label="Password">
        <UInput v-model="form.password" type="password" class="w-full" />
      </UFormField>
      <UButton class="w-full justify-center" @click="handleLogin" :loading="loading">Login</UButton>
      <p class="text-center text-sm">Belum punya akun? <NuxtLink to="/register" class="text-orange-500">Daftar</NuxtLink></p>
    </div>
  </div>
</template>
