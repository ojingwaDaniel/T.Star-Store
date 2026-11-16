import { USE_MOCKS, ENDPOINTS } from "@/config/api";
import { http } from "./http";
import { mockBackend } from "./mock";

// items: [{ productId, size, color, quantity }]
// Returns { items: [{ productId, size, color, quantity, unitPrice, originalPrice, maxQuantity, available, issue }] }
export async function validateCart(items) {
  if (USE_MOCKS) return (await mockBackend()).validateCart(items);
  return (await http.post(ENDPOINTS.cartValidate, { items })).data;
}
