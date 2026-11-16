import { USE_MOCKS, ENDPOINTS } from "@/config/api";
import { http } from "./http";
import { mockBackend } from "./mock";

export async function sendMessage(payload) {
  if (USE_MOCKS) return (await mockBackend()).sendContact(payload);
  return http.post(ENDPOINTS.contact, payload);
}
