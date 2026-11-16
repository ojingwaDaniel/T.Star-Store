import { USE_MOCKS, ENDPOINTS } from "@/config/api";
import { http } from "./http";
import { mockBackend } from "./mock";

export async function getCategories() {
  if (USE_MOCKS) return (await mockBackend()).listCategories();
  return (await http.get(ENDPOINTS.categories)).data;
}
