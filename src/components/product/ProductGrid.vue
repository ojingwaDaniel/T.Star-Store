<script setup>
import ProductCard from "./ProductCard.vue";
import ProductCardSkeleton from "./ProductCardSkeleton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps({
  products: { type: Array, default: () => [] },
  loading: Boolean,
  error: { type: String, default: "" },
  skeletons: { type: Number, default: 6 },
  cols: { type: String, default: "grid-cols-2 lg:grid-cols-3" },
});
defineEmits(["retry"]);
</script>

<template>
  <div v-if="error" class="py-16 text-center" role="alert">
    <p class="text-error">{{ error }}</p>
    <BaseButton class="mt-6" variant="outline" @click="$emit('retry')"
      >Try again</BaseButton
    >
  </div>

  <ul
    v-else-if="loading && !products.length"
    class="grid gap-x-4 gap-y-10 md:gap-x-6"
    :class="cols"
    aria-label="Loading products"
  >
    <li v-for="n in skeletons" :key="n"><ProductCardSkeleton /></li>
  </ul>

  <!-- on refetch (filters, page) the old results stay, dimmed, so the layout doesn't jump -->
  <ul
    v-else
    class="grid gap-x-4 gap-y-10 transition-opacity duration-200 md:gap-x-6 md:gap-y-12"
    :class="[cols, loading && 'opacity-50']"
    :aria-busy="loading"
  >
    <li
      v-for="(p, i) in products"
      :key="p.id"
      v-reveal="{ delay: (i % 4) * 60 }"
    >
      <ProductCard :product="p" />
    </li>
  </ul>
</template>
