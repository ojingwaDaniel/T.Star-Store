<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { SlidersHorizontal } from "lucide-vue-next";
import Drawer from "@/components/ui/Drawer.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";
import ProductGrid from "@/components/product/ProductGrid.vue";
import FilterPanel from "@/components/shop/FilterPanel.vue";
import SortSelect from "@/components/shop/SortSelect.vue";
import ActiveFilters from "@/components/shop/ActiveFilters.vue";
import { useProductFilters } from "@/composables/useProductFilters";
import { useProductsStore } from "@/stores/products";
import { useSeo } from "@/composables/useSeo";
import { COLLECTION_LABELS, COLLECTION_BLURBS } from "@/config/shop";

const store = useProductsStore();
const {
  filters,
  products,
  meta,
  facets,
  loading,
  error,
  activeCount,
  update,
  clearAll,
  reload,
} = useProductFilters();

const filtersOpen = ref(false);
const resultsTop = ref(null);

onMounted(() => {
  store.fetchCategories().catch(() => {});
});

const category = computed(
  () => store.categories.find((c) => c.slug === filters.value.category) || null,
);
const unknownCategory = computed(
  () =>
    !!filters.value.category && store.categories.length > 0 && !category.value,
);

const title = computed(() => {
  const f = filters.value;
  if (f.search) return `Results for “${f.search}”`;
  if (f.collection) return COLLECTION_LABELS[f.collection];
  if (unknownCategory.value) return "Category not found";
  return category.value?.name || "Shop all";
});
const eyebrow = computed(() =>
  category.value && (filters.value.collection || filters.value.search)
    ? category.value.name
    : "Shop",
);
const blurb = computed(() => {
  const f = filters.value;
  if (f.search) return "";
  if (f.collection) return COLLECTION_BLURBS[f.collection];
  return category.value?.tagline || "The full T.STAR collection.";
});

useSeo(
  computed(() => ({
    title: title.value,
    description:
      blurb.value ||
      "Browse the T.STAR collection of premium streetwear and sportswear.",
  })),
);

const showEmpty = computed(
  () => !loading.value && !error.value && !products.value.length,
);
const countText = computed(() => {
  if (loading.value && !products.value.length) return "Loading…";
  return `${meta.value.total} piece${meta.value.total === 1 ? "" : "s"}`;
});

function goPage(p) {
  update({ page: p });
  nextTick(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    resultsTop.value?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  });
}
</script>

<template>
  <div>
    <header class="border-b border-line bg-white">
      <div class="shell py-10 md:py-14">
        <p class="label-gold">{{ eyebrow }}</p>
        <h1 class="mt-3 text-6xl md:text-8xl">{{ title }}</h1>
        <p v-if="blurb" class="mt-4 max-w-lg text-graphite">{{ blurb }}</p>
      </div>
    </header>

    <div
      class="shell py-8 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 lg:py-12"
    >
      <aside
        class="hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto"
        aria-label="Filters"
      >
        <FilterPanel
          :filters="filters"
          :facets="facets"
          :categories="store.categories"
          :active-count="activeCount"
          @update="update"
          @clear="clearAll"
        />
      </aside>

      <section
        ref="resultsTop"
        class="min-w-0 scroll-mt-24"
        aria-label="Products"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="inline-flex h-11 items-center gap-2 border border-ink px-4 text-[12px] font-semibold uppercase tracking-label transition-colors hover:bg-ink hover:text-bone lg:hidden"
              aria-haspopup="dialog"
              @click="filtersOpen = true"
            >
              <SlidersHorizontal :size="16" /> Filters
              <span
                v-if="activeCount"
                class="grid h-5 min-w-[1.25rem] place-items-center bg-gold px-1 text-[11px] text-ink"
                >{{ activeCount }}</span
              >
            </button>
            <p class="text-[14px] text-graphite" aria-live="polite">
              {{ countText }}
            </p>
          </div>
          <SortSelect
            :model-value="filters.sort"
            @update:model-value="(v) => update({ sort: v })"
          />
        </div>

        <ActiveFilters
          class="mt-5"
          :filters="filters"
          @update="update"
          @clear="clearAll"
        />

        <div class="mt-8">
          <EmptyState
            v-if="unknownCategory"
            title="We couldn't find that category"
            text="It may have been renamed or removed."
            action-label="Browse all products"
            :action-to="{ name: 'shop' }"
          />
          <EmptyState
            v-else-if="showEmpty"
            :title="
              activeCount ? 'Nothing matches those filters' : 'Nothing here yet'
            "
            :text="
              activeCount
                ? 'Try removing a filter or searching for something else.'
                : 'New pieces are on the way. Take a look at the rest of the collection.'
            "
            :action-label="
              activeCount ? 'Clear filters' : 'Browse all products'
            "
            :action-to="activeCount ? null : { name: 'shop' }"
            @action="activeCount && clearAll()"
          />
          <ProductGrid
            v-else
            :products="products"
            :loading="loading"
            :error="error"
            @retry="reload"
          />
        </div>

        <Pagination
          v-if="!error && products.length"
          :page="meta.page"
          :last-page="meta.lastPage"
          @change="goPage"
        />
      </section>
    </div>

    <Drawer
      :open="filtersOpen"
      side="left"
      label="Filters"
      @close="filtersOpen = false"
    >
      <div class="flex-1 overflow-y-auto px-5 pb-6">
        <FilterPanel
          :filters="filters"
          :facets="facets"
          :categories="store.categories"
          :active-count="activeCount"
          @update="update"
          @clear="clearAll"
        />
      </div>
      <div class="flex shrink-0 gap-3 border-t border-line bg-white p-5">
        <BaseButton v-if="activeCount" variant="outline" @click="clearAll"
          >Clear</BaseButton
        >
        <BaseButton block @click="filtersOpen = false"
          >Show {{ meta.total }} result{{
            meta.total === 1 ? "" : "s"
          }}</BaseButton
        >
      </div>
    </Drawer>
  </div>
</template>
