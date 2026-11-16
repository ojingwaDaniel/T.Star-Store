<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { Search, X } from "lucide-vue-next";
import AppImage from "@/components/ui/AppImage.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import Skeleton from "@/components/ui/Skeleton.vue";
import { useUiStore } from "@/stores/ui";
import { useProductsStore } from "@/stores/products";
import { useScrollLock } from "@/composables/useScrollLock";
import { useFocusTrap } from "@/composables/useFocusTrap";
import { getProducts } from "@/services/productService";
import { formatNaira } from "@/utils/currency";
import { currentPrice } from "@/utils/product";

const ui = useUiStore();
const store = useProductsStore();
const router = useRouter();

const panel = ref(null);
const open = computed(() => ui.searchOpen);
useScrollLock(open);
useFocusTrap(panel, open);

const SUGGESTIONS = ["Hoodie", "Joggers", "Tee", "Cargo", "Jacket", "Leggings"];
const query = ref("");
const results = ref([]);
const total = ref(0);
const status = ref("idle"); // idle | loading | results | empty | error

let timer;
let seq = 0;

watch(query, (q) => {
  clearTimeout(timer);
  const term = q.trim();
  if (term.length < 2) {
    seq++;
    results.value = [];
    total.value = 0;
    status.value = "idle";
    return;
  }
  status.value = "loading";
  timer = setTimeout(() => run(term), 300);
});

async function run(term) {
  const id = ++seq; // only the latest request may update the screen
  try {
    const res = await getProducts({
      search: term,
      perPage: 6,
      sort: "popular",
    });
    if (id !== seq) return;
    results.value = res.data;
    total.value = res.meta.total;
    store.remember(res.data);
    status.value = res.data.length ? "results" : "empty";
  } catch {
    if (id === seq) status.value = "error";
  }
}

function submit() {
  const term = query.value.trim();
  if (!term) return;
  ui.closeSearch();
  router.push({ path: "/shop", query: { search: term } });
}

watch(open, (o) => {
  if (!o) {
    query.value = "";
    results.value = [];
    status.value = "idle";
  }
});

const onKey = (e) => {
  if (e.key === "Escape" && ui.searchOpen) ui.closeSearch();
};
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKey);
  clearTimeout(timer);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="search">
      <div
        v-if="ui.searchOpen"
        ref="panel"
        class="fixed inset-0 z-[70] bg-bone"
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        tabindex="-1"
      >
        <div class="shell flex h-full flex-col py-5 md:py-8">
          <div
            class="flex items-center gap-3 border-b-2 border-ink pb-3 md:gap-5"
          >
            <Search :size="24" class="shrink-0" aria-hidden="true" />
            <form class="flex-1" role="search" @submit.prevent="submit">
              <label for="site-search" class="sr-only">Search T.STAR</label>
              <input
                id="site-search"
                v-model="query"
                data-autofocus
                type="search"
                autocomplete="off"
                placeholder="Search hoodies, joggers…"
                class="w-full bg-transparent font-display text-3xl font-bold uppercase placeholder:text-ink/25 focus:outline-none md:text-5xl"
              />
            </form>
            <button
              type="button"
              class="icon-btn"
              aria-label="Close search"
              @click="ui.closeSearch()"
            >
              <X :size="24" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto py-8" aria-live="polite">
            <div v-if="status === 'idle'">
              <p class="label mb-4">Popular searches</p>
              <div class="flex flex-wrap gap-2.5">
                <button
                  v-for="s in SUGGESTIONS"
                  :key="s"
                  type="button"
                  class="border border-ink px-4 py-2 text-[12px] font-semibold uppercase tracking-label transition-colors hover:bg-ink hover:text-bone"
                  @click="query = s"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <ul
              v-else-if="status === 'loading'"
              class="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Loading results"
            >
              <li v-for="n in 6" :key="n" class="flex gap-4">
                <Skeleton class="h-24 w-[4.5rem]" />
                <div class="flex-1 space-y-3 pt-2">
                  <Skeleton class="h-5 w-3/4" /><Skeleton class="h-4 w-1/3" />
                </div>
              </li>
            </ul>

            <div v-else-if="status === 'results'">
              <ul class="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                <li v-for="p in results" :key="p.id">
                  <RouterLink
                    :to="{ name: 'product', params: { slug: p.slug } }"
                    class="group flex gap-4"
                    @click="ui.closeSearch()"
                  >
                    <div class="w-[4.5rem] shrink-0">
                      <AppImage
                        :src="p.images[0]?.url"
                        :alt="p.name"
                        ratio="3/4"
                        sizes="72px"
                      />
                    </div>
                    <div class="min-w-0 self-center">
                      <p class="label">{{ p.type }}</p>
                      <p
                        class="font-display text-2xl font-bold uppercase leading-none group-hover:text-gold-dark"
                      >
                        {{ p.name }}
                      </p>
                      <p class="mt-1.5 text-[14px] font-semibold">
                        {{ formatNaira(currentPrice(p)) }}
                      </p>
                    </div>
                  </RouterLink>
                </li>
              </ul>
              <div class="mt-10">
                <BaseButton variant="outline" @click="submit"
                  >View all {{ total }} result{{
                    total === 1 ? "" : "s"
                  }}</BaseButton
                >
              </div>
            </div>

            <p v-else-if="status === 'empty'" class="max-w-md text-lg">
              No results for <strong>"{{ query.trim() }}"</strong>. Try a
              different word, like "hoodie" or "joggers".
            </p>
            <p v-else class="max-w-md text-lg text-error" role="alert">
              Search is unavailable right now. Please try again in a moment.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
