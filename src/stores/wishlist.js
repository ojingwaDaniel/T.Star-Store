import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { local } from "@/utils/storage";

const KEY = "tstar:wishlist";

// Stores product ids only. WishlistView fetches the products with getProducts({ ids }).
// When customers are logged in, this can later sync to a Laravel wishlist endpoint.
export const useWishlistStore = defineStore("wishlist", () => {
  const saved = local.get(KEY, []);
  const ids = ref(Array.isArray(saved) ? saved : []);
  watch(ids, (v) => local.set(KEY, v), { deep: true });

  const count = computed(() => ids.value.length);
  const has = (id) => ids.value.includes(id);

  // Returns true if added, false if removed
  function toggle(id) {
    const i = ids.value.indexOf(id);
    if (i === -1) {
      ids.value.push(id);
      return true;
    }
    ids.value.splice(i, 1);
    return false;
  }
  const remove = (id) => {
    ids.value = ids.value.filter((x) => x !== id);
  };
  const clear = () => {
    ids.value = [];
  };

  return { ids, count, has, toggle, remove, clear };
});
