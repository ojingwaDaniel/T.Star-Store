export const isEmail = (v = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
// Nigerian mobile: 0803..., +234803..., 234803...
export const isNgPhone = (v = "") =>
  /^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/[\s-]/g, ""));
export const required = (v) =>
  typeof v === "string"
    ? v.trim().length > 0
    : v !== null && v !== undefined && v !== "";
export const minLen =
  (n) =>
  (v = "") =>
    v.length >= n;
