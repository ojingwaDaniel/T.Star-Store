import { USE_MOCKS, ENDPOINTS } from "@/config/api";
import { http } from "./http";
import { mockBackend } from "./mock";

export async function subscribe(email) {
  if (USE_MOCKS) return (await mockBackend()).subscribe(email);
  return http.post(ENDPOINTS.newsletter, { email });
}
