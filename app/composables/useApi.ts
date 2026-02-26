export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie("auth_token");

  return $fetch.create({
    baseURL: config.public.apiBase as string,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null;
      }
    },
  });
};
