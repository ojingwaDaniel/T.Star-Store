import { USE_MOCKS, ENDPOINTS } from "@/config/api";
import { http, TOKEN_KEY } from "./http";
import { mockBackend } from "./mock";
import { local } from "@/utils/storage";

// Each of login/register returns { user, token } (Laravel Sanctum personal access token)
export async function login(credentials) {
  if (USE_MOCKS) return (await mockBackend()).login(credentials);
  return (await http.post(ENDPOINTS.login, credentials)).data;
}

export async function register(data) {
  if (USE_MOCKS) return (await mockBackend()).register(data);
  return (await http.post(ENDPOINTS.register, data)).data;
}

export async function me() {
  if (USE_MOCKS) return (await mockBackend()).me(local.get(TOKEN_KEY));
  return (await http.get(ENDPOINTS.me)).data;
}

export async function logout() {
  if (USE_MOCKS) return;
  await http.post(ENDPOINTS.logout);
}
