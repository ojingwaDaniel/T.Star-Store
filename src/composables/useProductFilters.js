import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProducts } from "@/services/productService";
import { useProductsStore } from "@/stores/products";
import { COLLECTIONS, SORT_OPTIONS, PER_PAGE } from "@/config/shop";

const COLLECTION_VALUES = COLLECTIONS.map((c) => c.value);
const SORT_VALUES = SORT_OPTIONS.map((s) => s.value);

const first = (v) => (Array.isArray(v) ? v[0] : v);
const toList = (v) =>
  typeof v === "string" && v
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
const toPrice = (v) => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export function useProductFilters() {
  const route = useRoute();
  const router = useRouter();
  const store = useProductsStore();

  const onShop = () => route.name === "shop" || route.name === "shop-category";

  // While the page fades out after navigating away, the route has already changed.
  // Keep the last shop filters so nothing refetches or flashes "Shop all".
  let frozen = null;
  const filters = computed(() => {
    if (!onShop() && frozen) return frozen;
    const q = route.query;
    const collection = first(q.collection);
    const sort = first(q.sort);
    const f = {
      category: route.params.category || "",
      collection: COLLECTION_VALUES.includes(collection) ? collection : "",
      search: String(first(q.search) || "").trim(),
      sort: SORT_VALUES.includes(sort) ? sort : "popular",
      minPrice: toPrice(first(q.minPrice)),
      maxPrice: toPrice(first(q.maxPrice)),
      sizes: toList(first(q.sizes)),
      colors: toList(first(q.colors)),
      page: Math.max(1, parseInt(first(q.page), 10) || 1),
    };
    frozen = f;
    return f;
  });

  const products = ref([]);
  const meta = ref({ total: 0, page: 1, perPage: PER_PAGE, lastPage: 1 });
  const facets = ref({ minPrice: 0, maxPrice: 0, sizes: [], colors: [] });
  const loading = ref(true);
  const error = ref("");

  const activeCount = computed(() => {
    const f = filters.value;
    return (
      (f.collection ? 1 : 0) +
      (f.search ? 1 : 0) +
      (f.minPrice != null || f.maxPrice != null ? 1 : 0) +
      f.sizes.length +
      f.colors.length
    );
  });

  // Any filter change resets to page 1 unless a page is given
  function update(patch) {
    const next = { ...filters.value, ...patch };
    if (!("page" in patch)) next.page = 1;
    const query = {};
    if (next.collection) query.collection = next.collection;
    if (next.search) query.search = next.search;
    if (next.sort !== "popular") query.sort = next.sort;
    if (next.minPrice != null) query.minPrice = next.minPrice;
    if (next.maxPrice != null) query.maxPrice = next.maxPrice;
    if (next.sizes.length) query.sizes = next.sizes.join(",");
    if (next.colors.length) query.colors = next.colors.join(",");
    if (next.page > 1) query.page = next.page;
    router.replace({ path: route.path, query });
  }

  const clearAll = () =>
    update({
      collection: "",
      search: "",
      minPrice: null,
      maxPrice: null,
      sizes: [],
      colors: [],
    });

  let seq = 0; // latest request wins
  async function load() {
    const id = ++seq;
    const f = filters.value;
    loading.value = true;
    error.value = "";
    try {
      const res = await getProducts({
        category: f.category,
        collection: f.collection,
        search: f.search,
        sort: f.sort,
        minPrice: f.minPrice,
        maxPrice: f.maxPrice,
        sizes: f.sizes,
        colors: f.colors,
        page: f.page,
        perPage: PER_PAGE,
      });
      if (id !== seq) return;
      // A stale ?page=9 in the URL: jump to the last real page
      if (!res.data.length && f.page > 1 && res.meta.total > 0) {
        update({ page: res.meta.lastPage });
        return;
      }
      products.value = res.data;
      meta.value = res.meta;
      facets.value = res.meta.facets || facets.value;
      store.remember(res.data);
    } catch (e) {
      if (id !== seq) return;
      products.value = [];
      error.value = e.message || "Could not load products.";
    } finally {
      if (id === seq) loading.value = false;
    }
  }

  watch(
    () => (onShop() ? JSON.stringify(filters.value) : null),
    (key) => {
      if (key) load();
    },
    { immediate: true },
  );

  return {
    filters,
    products,
    meta,
    facets,
    loading,
    error,
    activeCount,
    update,
    clearAll,
    reload: load,
  };
}
