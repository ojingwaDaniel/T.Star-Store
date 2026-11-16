import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as authApi from "@/services/authService";
import { TOKEN_KEY } from "@/services/http";
import { local } from "@/utils/storage";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(local.get(TOKEN_KEY, null));
  const ready = ref(false); // true once the initial session check has finished
  const loading = ref(false);
  const isAuthenticated = computed(() => !!user.value);

  function setSession(u, t) {
    user.value = u;
    token.value = t;
    local.set(TOKEN_KEY, t);
  }
  function clearSession() {
    user.value = null;
    token.value = null;
    local.remove(TOKEN_KEY);
  }

  // The http client fires this on any 401 response
  window.addEventListener("tstar:unauthorized", clearSession);

  async function init() {
    if (!token.value) {
      ready.value = true;
      return;
    }
    try {
      user.value = await authApi.me();
    } catch (e) {
      if (e.status === 401) clearSession();
    } finally {
      ready.value = true;
    }
  }

  // login/register throw ApiError; the form reads error.errors for field messages
  async function login(credentials) {
    loading.value = true;
    try {
      const res = await authApi.login(credentials);
      setSession(res.user, res.token);
      return res.user;
    } finally {
      loading.value = false;
    }
  }

  async function register(data) {
    loading.value = true;
    try {
      const res = await authApi.register(data);
      setSession(res.user, res.token);
      return res.user;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {
      /* clear locally regardless */
    }
    clearSession();
  }

  return {
    user,
    token,
    ready,
    loading,
    isAuthenticated,
    init,
    login,
    register,
    logout,
  };
});
