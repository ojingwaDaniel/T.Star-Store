<script setup>
import { ref, computed, watch } from "vue";
import Modal from "@/components/ui/Modal.vue";
import Skeleton from "@/components/ui/Skeleton.vue";
import Badge from "@/components/ui/Badge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ProductGallery from "./ProductGallery.vue";
import ProductPrice from "./ProductPrice.vue";
import ProductPurchase from "./ProductPurchase.vue";
import { useUiStore } from "@/stores/ui";
import { useProductsStore } from "@/stores/products";
import { badgesFor, BADGE_LABELS } from "@/utils/product";

const ui = useUiStore();
const store = useProductsStore();

const product = ref(null);
const loading = ref(false);
const error = ref("");
const open = computed(() => !!ui.quickViewSlug);

// Show the cached product instantly, then refresh stock in the background
watch(
  () => ui.quickViewSlug,
  async (slug) => {
    if (!slug) return;
    error.value = "";
    product.value = store.getCached(slug);
    loading.value = !product.value;
    try {
      const fresh = await store.fetchProduct(slug, { force: true });
      if (ui.quickViewSlug === slug) product.value = fresh;
    } catch (e) {
      if (ui.quickViewSlug === slug && !product.value)
        error.value = e.message || "Could not load this product.";
    } finally {
      if (ui.quickViewSlug === slug) loading.value = false;
    }
  },
  { immediate: true },
);
</script>

<template>
  <Modal
    :open="open"
    :label="product ? `Quick view: ${product.name}` : 'Quick view'"
    size="xl"
    @close="ui.closeQuickView()"
  >
    <div
      v-if="loading"
      class="grid gap-8 p-6 pt-14 md:grid-cols-2 md:p-8"
      aria-busy="true"
    >
      <Skeleton class="aspect-square w-full" />
      <div class="space-y-4">
        <Skeleton class="h-4 w-20" /><Skeleton class="h-10 w-3/4" /><Skeleton
          class="h-6 w-32"
        /><Skeleton class="h-24 w-full" /><Skeleton class="h-12 w-full" />
      </div>
    </div>

    <div v-else-if="error" class="p-10 pt-16 text-center" role="alert">
      <p class="text-error">{{ error }}</p>
      <BaseButton class="mt-6" variant="outline" @click="ui.closeQuickView()"
        >Close</BaseButton
      >
    </div>

    <div v-else-if="product" class="grid md:grid-cols-2">
      <ProductGallery
        :key="product.slug"
        :images="product.images"
        :name="product.name"
        :thumbs="false"
        ratio="1/1"
      />

      <div class="p-6 md:p-9">
        <div class="flex items-center gap-2">
          <p class="label">{{ product.type }}</p>
          <Badge
            v-for="b in badgesFor(product).slice(0, 2)"
            :key="b"
            :variant="b"
            >{{ BADGE_LABELS[b] }}</Badge
          >
        </div>
        <h2 class="mt-2 text-4xl md:text-5xl">{{ product.name }}</h2>
        <ProductPrice :product="product" class="mt-3" />
        <p class="mt-4 line-clamp-3 text-[15px] leading-relaxed text-graphite">
          {{ product.description }}
        </p>

        <div class="mt-6">
          <ProductPurchase :key="product.id" :product="product" />
        </div>

        <RouterLink
          :to="{ name: 'product', params: { slug: product.slug } }"
          class="streak mt-6 inline-block text-[12px] font-semibold uppercase tracking-label"
        >
          View full details
        </RouterLink>
      </div>
    </div>
  </Modal>
</template>
