<script setup>
import { ref, watch } from "vue";
import ProductGrid from "./ProductGrid.vue";
import { getRelatedProducts } from "@/services/productService";
import { useProductsStore } from "@/stores/products";

const props = defineProps({ slug: { type: String, required: true } });
const store = useProductsStore();
const products = ref([]);
const loading = ref(true);
const error = ref("");

async function load() {
  loading.value = true;
  error.value = "";
  try {
    products.value = await getRelatedProducts(props.slug, 4);
    store.remember(products.value);
  } catch (e) {
    error.value = e.message || "Could not load related products.";
  } finally {
    loading.value = false;
  }
}
watch(() => props.slug, load, { immediate: true });
</script>

<template>
  <section
    v-if="loading || error || products.length"
    class="section-y"
    aria-labelledby="related-title"
  >
    <div class="shell">
      <h2 id="related-title" v-reveal class="mb-10 text-5xl md:text-6xl">
        You may also like
      </h2>
      <ProductGrid
        :products="products"
        :loading="loading"
        :error="error"
        :skeletons="4"
        cols="grid-cols-2 md:grid-cols-4"
        @retry="load"
      />
    </div>
  </section>
</template>
