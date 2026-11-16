<script setup>
import { ref, onMounted } from "vue";
import { ArrowUpRight } from "lucide-vue-next";
import AppImage from "@/components/ui/AppImage.vue";
import Skeleton from "@/components/ui/Skeleton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useProductsStore } from "@/stores/products";

const store = useProductsStore();
const categories = ref([]);
const loading = ref(true);
const error = ref("");

// Staggered editorial grid: column spans, offsets and image ratios per tile
const SPAN = [
  "md:col-span-5",
  "md:col-span-4 md:mt-20",
  "md:col-span-3 md:mt-8",
  "md:col-span-6",
  "md:col-span-6 md:mt-12",
];
const RATIO = ["4/5", "4/5", "3/4", "16/10", "16/10"];

async function load() {
  loading.value = true;
  error.value = "";
  try {
    categories.value = await store.fetchCategories();
  } catch (e) {
    error.value = e.message || "Could not load collections.";
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>

<template>
  <section class="section-y" aria-labelledby="collections-title">
    <div class="shell">
      <div v-reveal class="mb-10 max-w-xl md:mb-14">
        <p class="label-gold">Shop by category</p>
        <h2 id="collections-title" class="mt-3 text-5xl md:text-7xl">
          The collections
        </h2>
      </div>

      <div
        v-if="loading"
        class="grid gap-5 md:grid-cols-12"
        aria-label="Loading collections"
      >
        <Skeleton v-for="n in 3" :key="n" class="aspect-[4/5] md:col-span-4" />
      </div>

      <div v-else-if="error" class="py-10" role="alert">
        <p class="mb-4 text-error">{{ error }}</p>
        <BaseButton variant="outline" @click="load">Try again</BaseButton>
      </div>

      <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
        <RouterLink
          v-for="(c, i) in categories"
          :key="c.id"
          v-reveal="{ delay: i * 90 }"
          :to="`/shop/${c.slug}`"
          class="group relative block overflow-hidden"
          :class="SPAN[i]"
        >
          <div
            class="transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.05]"
          >
            <AppImage
              :src="c.image"
              :alt="`${c.name} collection`"
              :ratio="RATIO[i] || '4/5'"
            />
          </div>
          <div class="absolute inset-0 bg-fade-ink" aria-hidden="true" />
          <div
            class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-bone md:p-7"
          >
            <div>
              <p
                class="text-[11px] font-semibold uppercase tracking-label text-bone/80"
              >
                {{ c.productCount }} pieces
              </p>
              <h3 class="mt-1 text-5xl italic md:text-6xl">{{ c.name }}</h3>
              <p class="mt-2 hidden text-sm text-bone/80 sm:block">
                {{ c.tagline }}
              </p>
            </div>
            <span
              class="grid h-11 w-11 shrink-0 place-items-center bg-gold text-ink transition-transform duration-500 ease-brand group-hover:-translate-y-1 group-hover:translate-x-1"
            >
              <ArrowUpRight :size="20" />
            </span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
