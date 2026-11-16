import { API_BASE_URL } from "@/config/api";
import { local } from "@/utils/storage";

export const TOKEN_KEY = "tstar:token";

export class ApiError extends Error {
  constructor(message, status = 0, errors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status; // 0 = network or timeout
    this.errors = errors || {}; // Laravel 422 field errors
  }
}

function buildUrl(path, params) {
  const url = new URL(
    API_BASE_URL.replace(/\/$/, "") + path,
    window.location.origin,
  );
  Object.entries(params || {}).forEach(([key, val]) => {
    if (val === undefined || val === null || val === "") return;
    if (Array.isArray(val))
      val.forEach((v) => url.searchParams.append(`${key}[]`, v)); // Laravel array style
    else url.searchParams.set(key, val);
  });
  return url.toString();
}

async function request(
  method,
  path,
  { params, body, signal, timeout = 15000 } = {},
) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  if (signal) signal.addEventListener("abort", () => ctrl.abort());
  const token = local.get(TOKEN_KEY);

  let res;
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    if (signal?.aborted) throw e; // cancelled by the caller, not a failure
    if (e.name === "AbortError")
      throw new ApiError("The request timed out. Please try again.");
    throw new ApiError("Network error. Check your connection and try again.");
  } finally {
    clearTimeout(timer);
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) {
      local.remove(TOKEN_KEY);
      window.dispatchEvent(new Event("tstar:unauthorized"));
    }
    throw new ApiError(
      data?.message || `Request failed (${res.status}).`,
      res.status,
      data?.errors,
    );
  }
  return data;
}

export const http = {
  get: (path, opts) => request("GET", path, opts),
  post: (path, body, opts) => request("POST", path, { ...opts, body }),
  put: (path, body, opts) => request("PUT", path, { ...opts, body }),
  patch: (path, body, opts) => request("PATCH", path, { ...opts, body }),
  delete: (path, opts) => request("DELETE", path, opts),
};
