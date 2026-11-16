// The only place API settings are read. Never hardcode URLs elsewhere.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
export const USE_MOCKS =
  String(import.meta.env.VITE_USE_MOCKS ?? "true") === "true";
export const MOCK_LATENCY_MS = 450;

export const ENDPOINTS = {
  products: "/products",
  product: (slug) => `/products/${slug}`,
  related: (slug) => `/products/${slug}/related`,
  reviews: (slug) => `/products/${slug}/reviews`,
  categories: "/categories",
  cartValidate: "/cart/validate",
  deliveryQuote: "/shipping/quote",
  paymentMethods: "/checkout/payment-methods",
  orders: "/orders",
  order: (number) => `/orders/${number}`,
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  me: "/auth/me",
  newsletter: "/newsletter",
  contact: "/contact",
};
