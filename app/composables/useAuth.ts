export const useAuth = () => {
  const api = useApi();
  const token = useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7 });
  const user = useState<any>("user", () => null);

  const fetchUser = async () => {
    if (!token.value) return;
    try {
      const res: any = await api("/user");
      user.value = res;
    } catch (err) {
      token.value = null;
      user.value = null;
    }
  };

  const logout = async () => {
    try {
      await api("/logout", { method: "POST" });
    } catch (e) {}
    token.value = null;
    user.value = null;
    navigateTo("/login");
  };

  return { user, token, fetchUser, logout };
};
