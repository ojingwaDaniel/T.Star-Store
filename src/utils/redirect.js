export function safeRedirect(value, fallback = "/") {
  const v = Array.isArray(value) ? value[0] : value;
  if (
    typeof v !== "string" ||
    !v.startsWith("/") ||
    v.startsWith("//") ||
    v.includes("\\")
  )
    return fallback;
  if (v.startsWith("/login") || v.startsWith("/register")) return fallback;
  return v;
}
