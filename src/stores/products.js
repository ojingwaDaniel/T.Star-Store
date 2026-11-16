import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { getProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";

export const useProductsStore = defineStore("products", () => {
  const cache = reactive({}); // slug -> product
  const categories = ref([]);
  const categoriesLoaded = ref(false);

  // Call with any list result so quick view and wishlist can open instantly
  const remember = (list) =>
    list.forEach((p) => {
      cache[p.slug] = p;
    });
  const getCached = (slug) => cache[slug] || null;

  // The product page passes { force: true } so stock is always fresh
  async function fetchProduct(slug, { force = false } = {}) {
    if (!force && cache[slug]) return cache[slug];
    const p = await getProduct(slug);
    cache[slug] = p;
    return p;
  }

  async function fetchCategories() {
    if (!categoriesLoaded.value) {
      categories.value = await getCategories();
      categoriesLoaded.value = true;
    }
    return categories.value;
  }

  return { categories, remember, getCached, fetchProduct, fetchCategories };
});
