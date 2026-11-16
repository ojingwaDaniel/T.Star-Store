<script setup>
import { ref, onMounted } from "vue";
import { ArrowRight } from "lucide-vue-next";
import ProductCard from "@/components/product/ProductCard.vue";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { getProducts } from "@/services/productService";
import { useProductsStore } from "@/stores/products";

const props = defineProps({
  title: { type: String, required: true },
  label: { type: String, default: "" },
  collection: { type: String, default: "" }, // new-arrivals | best-sellers | trending | sale
  category: { type: String, default: "" },
  sort: { type: String, default: "popular" },
  limit: { type: Number, default: 4 },
  viewAllTo: { type: [String, Object], default: null },
  tone: { type: String, default: "light" }, // light (bone) | white
});

const store = useProductsStore();
const products = ref([]);
const loading = ref(true);
const error = ref("");

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const res = await getProducts({
      collection: props.collection,
      category: props.category,
      sort: props.sort,
      perPage: props.limit,
    });
    products.value = res.data;
    store.remember(res.data); // lets quick view and wishlist open instantly
  } catch (e) {
    error.value = e.message || "Could not load products.";
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>

<template>
  <!-- hidden entirely when a shelf has nothing to show (e.g. no sale items) -->
  <section
    v-if="loading || error || products.length"
    class="section-y"
    :class="tone === 'white' ? 'bg-white' : ''"
    :aria-labelledby="`shelf-${collection || category}`"
  >
    <div class="shell">
      <div v-reveal class="mb-8 flex items-end justify-between gap-6 md:mb-12">
        <div>
          <p v-if="label" class="label-gold">{{ label }}</p>
          <h2
            :id="`shelf-${collection || category}`"
            class="mt-3 text-5xl md:text-7xl"
          >
            {{ title }}
          </h2>
        </div>
        <RouterLink
          v-if="viewAllTo"
          :to="viewAllTo"
          class="streak hidden shrink-0 items-center gap-2 pb-1 text-[12px] font-semibold uppercase tracking-label sm:inline-flex"
        >
          View all <ArrowRight :size="16" />
        </RouterLink>
      </div>

      <ul
        v-if="loading"
        class="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4"
        aria-label="Loading products"
      >
        <li v-for="n in limit" :key="n"><ProductCardSkeleton /></li>
      </ul>

      <div v-else-if="error" class="py-6" role="alert">
        <p class="mb-4 text-error">{{ error }}</p>
        <BaseButton variant="outline" @click="load">Try again</BaseButton>
      </div>

      <!-- phones: swipeable row; tablets and up: grid -->
      <ul
        v-else
        class="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 no-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-0 lg:grid-cols-4"
      >
        <li
          v-for="(p, i) in products"
          :key="p.id"
          v-reveal="{ delay: i * 80 }"
          class="w-[68%] shrink-0 snap-start sm:w-[44%] md:w-auto"
        >
          <ProductCard :product="p" />
        </li>
      </ul>

      <div v-if="viewAllTo && !loading" class="mt-10 sm:hidden">
        <BaseButton :to="viewAllTo" variant="outline" block
          >View all</BaseButton
        >
      </div>
    </div>
  </section>
</template>
