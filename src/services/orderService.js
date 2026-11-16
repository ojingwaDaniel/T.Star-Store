import { USE_MOCKS, ENDPOINTS } from "@/config/api";
import { http } from "./http";
import { mockBackend } from "./mock";

// The backend must compute prices and totals itself. The client only sends what was chosen.
export async function createOrder(payload) {
  if (USE_MOCKS) return (await mockBackend()).createOrder(payload);
  return (await http.post(ENDPOINTS.orders, payload)).data;
}

export async function getOrder(orderNumber, { email } = {}) {
  if (USE_MOCKS) return (await mockBackend()).findOrder(orderNumber);
  return (await http.get(ENDPOINTS.order(orderNumber), { params: { email } }))
    .data;
}
