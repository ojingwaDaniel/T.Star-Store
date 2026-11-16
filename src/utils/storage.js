// Safe wrappers: storage can throw in private mode or when full.
const make = (store) => ({
  get(key, fallback = null) {
    try {
      const raw = store.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      store.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
  remove(key) {
    try {
      store.removeItem(key);
    } catch {
      /* ignore */
    }
  },
});
export const local = make(window.localStorage);
export const session = make(window.sessionStorage);
