// Loaded only when VITE_USE_MOCKS=true, so mock data stays out of the way otherwise.
export const mockBackend = () => import("@/mock/backend");
