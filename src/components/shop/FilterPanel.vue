<script setup>
import { ref, watch, computed, useId } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { COLLECTIONS, PRICE_PRESETS } from "@/config/shop";
import { formatNaira } from "@/utils/currency";

const props = defineProps({
  filters: { type: Object, required: true },
  facets: { type: Object, required: true }, // { minPrice, maxPrice, sizes: [], colors: [{ name, hex }] }
  categories: { type: Array, default: () => [] },
  activeCount: { type: Number, default: 0 },
});
const emit = defineEmits(["update", "clear"]);
const uid = useId();

/* price */
const minInput = ref("");
const maxInput = ref("");
watch(
  () => [props.filters.minPrice, props.filters.maxPrice],
  ([a, b]) => {
    minInput.value = a ?? "";
    maxInput.value = b ?? "";
  },
  { immediate: true },
);

const toNum = (v) => {
  if (v === "" || v == null) return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : null;
};
function commitPrice() {
  let min = toNum(minInput.value);
  let max = toNum(maxInput.value);
  if (min != null && max != null && min > max) [min, max] = [max, min];
  emit("update", { minPrice: min, maxPrice: max });
}
const presetActive = (p) =>
  props.filters.minPrice === p.min && props.filters.maxPrice === p.max;
const presetLabel = (p) =>
  p.min == null
    ? `Under ${formatNaira(p.max)}`
    : p.max == null
      ? `Over ${formatNaira(p.min)}`
      : `${formatNaira(p.min)} – ${formatNaira(p.max)}`;
function togglePreset(p) {
  emit(
    "update",
    presetActive(p)
      ? { minPrice: null, maxPrice: null }
      : { minPrice: p.min, maxPrice: p.max },
  );
}

/* arrays */
const toggleIn = (arr, v) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

/* category links keep search, collection and sort, and drop the rest */
const carryQuery = computed(() => {
  const f = props.filters;
  const q = {};
  if (f.collection) q.collection = f.collection;
  if (f.search) q.search = f.search;
  if (f.sort !== "popular") q.sort = f.sort;
  return q;
});

const section = "group border-b border-line py-5";
const summary =
  "flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden";
</script>

<template>
  <div>
    <div v-if="activeCount" class="flex justify-end pb-1">
      <button
        type="button"
        class="text-[12px] underline underline-offset-4 hover:text-gold-dark"
        @click="emit('clear')"
      >
        Clear all
      </button>
    </div>

    <details open :class="section">
      <summary :class="summary">
        <span class="label text-ink">Category</span
        ><ChevronDown
          :size="16"
          class="transition-transform group-open:rotate-180"
        />
      </summary>
      <ul class="mt-4 space-y-1">
        <li>
          <RouterLink
            :to="{ path: '/shop', query: carryQuery }"
            class="block py-1.5 text-[15px] transition-colors hover:text-gold-dark"
            :class="!filters.category && 'font-semibold'"
            :aria-current="!filters.category ? 'page' : undefined"
            >All products</RouterLink
          >
        </li>
        <li v-for="c in categories" :key="c.slug">
          <RouterLink
            :to="{ path: `/shop/${c.slug}`, query: carryQuery }"
            class="flex justify-between py-1.5 text-[15px] transition-colors hover:text-gold-dark"
            :class="filters.category === c.slug && 'font-semibold'"
            :aria-current="filters.category === c.slug ? 'page' : undefined"
          >
            {{ c.name }} <span class="text-graphite">{{ c.productCount }}</span>
          </RouterLink>
        </li>
      </ul>
    </details>

    <details open :class="section">
      <summary :class="summary">
        <span class="label text-ink">Collection</span
        ><ChevronDown
          :size="16"
          class="transition-transform group-open:rotate-180"
        />
      </summary>
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="c in COLLECTIONS"
          :key="c.value"
          type="button"
          :aria-pressed="filters.collection === c.value"
          class="border px-3 py-2 text-[13px] transition-colors"
          :class="
            filters.collection === c.value
              ? 'border-ink bg-ink text-bone'
              : 'border-line bg-white hover:border-ink'
          "
          @click="
            emit('update', {
              collection: filters.collection === c.value ? '' : c.value,
            })
          "
        >
          {{ c.label }}
        </button>
      </div>
    </details>

    <details open :class="section">
      <summary :class="summary">
        <span class="label text-ink">Price</span
        ><ChevronDown
          :size="16"
          class="transition-transform group-open:rotate-180"
        />
      </summary>
      <div class="mt-4">
        <div class="flex items-end gap-2">
          <div class="flex-1">
            <label
              :for="`${uid}-min`"
              class="mb-1.5 block text-[12px] text-graphite"
              >Min (₦)</label
            >
            <input
              :id="`${uid}-min`"
              v-model="minInput"
              type="number"
              inputmode="numeric"
              min="0"
              step="1000"
              :placeholder="String(facets.minPrice || 0)"
              class="w-full border border-line bg-white px-3 py-2.5 text-[14px] focus:border-ink focus:outline-none"
              @change="commitPrice"
              @keydown.enter="commitPrice"
            />
          </div>
          <span class="pb-3 text-graphite" aria-hidden="true">–</span>
          <div class="flex-1">
            <label
              :for="`${uid}-max`"
              class="mb-1.5 block text-[12px] text-graphite"
              >Max (₦)</label
            >
            <input
              :id="`${uid}-max`"
              v-model="maxInput"
              type="number"
              inputmode="numeric"
              min="0"
              step="1000"
              :placeholder="String(facets.maxPrice || 0)"
              class="w-full border border-line bg-white px-3 py-2.5 text-[14px] focus:border-ink focus:outline-none"
              @change="commitPrice"
              @keydown.enter="commitPrice"
            />
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="p in PRICE_PRESETS"
            :key="presetLabel(p)"
            type="button"
            :aria-pressed="presetActive(p)"
            class="border px-3 py-1.5 text-[12px] transition-colors"
            :class="
              presetActive(p)
                ? 'border-ink bg-ink text-bone'
                : 'border-line bg-white hover:border-ink'
            "
            @click="togglePreset(p)"
          >
            {{ presetLabel(p) }}
          </button>
        </div>
      </div>
    </details>

    <details v-if="facets.sizes.length" open :class="section">
      <summary :class="summary">
        <span class="label text-ink">Size</span
        ><ChevronDown
          :size="16"
          class="transition-transform group-open:rotate-180"
        />
      </summary>
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="s in facets.sizes"
          :key="s"
          type="button"
          :aria-pressed="filters.sizes.includes(s)"
          class="h-10 min-w-[2.75rem] border px-3 text-[13px] font-semibold transition-colors"
          :class="
            filters.sizes.includes(s)
              ? 'border-ink bg-ink text-bone'
              : 'border-line bg-white hover:border-ink'
          "
          @click="emit('update', { sizes: toggleIn(filters.sizes, s) })"
        >
          {{ s }}
        </button>
      </div>
    </details>

    <details v-if="facets.colors.length" open :class="section">
      <summary :class="summary">
        <span class="label text-ink">Colour</span
        ><ChevronDown
          :size="16"
          class="transition-transform group-open:rotate-180"
        />
      </summary>
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="c in facets.colors"
          :key="c.name"
          type="button"
          :aria-pressed="filters.colors.includes(c.name)"
          class="inline-flex items-center gap-2 border px-3 py-2 text-[13px] transition-colors"
          :class="
            filters.colors.includes(c.name)
              ? 'border-ink bg-ink text-bone'
              : 'border-line bg-white hover:border-ink'
          "
          @click="emit('update', { colors: toggleIn(filters.colors, c.name) })"
        >
          <span
            class="h-3.5 w-3.5 border border-ink/20"
            :style="{ background: c.hex }"
            aria-hidden="true"
          />{{ c.name }}
        </button>
      </div>
    </details>
  </div>
</template>
