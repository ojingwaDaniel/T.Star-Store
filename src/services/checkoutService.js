import { USE_MOCKS, ENDPOINTS } from "@/config/api";
import { http } from "./http";
import { mockBackend } from "./mock";
import { createOrder } from "./orderService";

// Returns { fee, zone, freeDeliveryApplied, estimatedDays: [min, max] }
export async function getDeliveryQuote({ state, city, subtotal }) {
  if (USE_MOCKS)
    return (await mockBackend()).quoteDelivery({ state, city, subtotal });
  return (await http.post(ENDPOINTS.deliveryQuote, { state, city, subtotal }))
    .data;
}

// Returns [{ id, label, description, enabled, integrationStatus? }]
export async function getPaymentMethods() {
  if (USE_MOCKS) return (await mockBackend()).listPaymentMethods();
  return (await http.get(ENDPOINTS.paymentMethods)).data;
}

// Creates an order in "pending / unpaid" state. No payment is taken here.
export const placeOrder = (payload) => createOrder(payload);
