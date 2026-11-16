<script setup>
import { computed } from "vue";
import { Eye } from "lucide-vue-next";
import AppImage from "@/components/ui/AppImage.vue";
import Badge from "@/components/ui/Badge.vue";
import StarIcon from "@/components/ui/StarIcon.vue";
import { useWishlistStore } from "@/stores/wishlist";
import { useUiStore } from "@/stores/ui";
import { useToast } from "@/composables/useToast";
import { formatNaira } from "@/utils/currency";
import { BADGE_LABELS } from "../../utils/product";
import {
  badgesFor,
  currentPrice,
  isOnSale,
  isInStock,
  discountPercent,
} from "@/utils/product";

const props = defineProps({
  product: { type: Object, required: true },
  eager: Boolean,
});

const wishlist = useWishlistStore();
const ui = useUiStore();
const toast = useToast();

const badges = computed(() => badgesFor(props.product).slice(0, 2));
const wished = computed(() => wishlist.has(props.product.id));
const inStock = computed(() => isInStock(props.product));
const onSale = computed(() => isOnSale(props.product));
const first = computed(() => props.product.images?.[0]);
const second = computed(() => props.product.images?.[1]?.url || "");
const extraColors = computed(() =>
  Math.max(0, props.product.colors.length - 4),
);
const colorNames = computed(() =>
  props.product.colors.map((c) => c.name).join(", "),
);
const to = computed(() => ({
  name: "product",
  params: { slug: props.product.slug },
}));

function toggleWish() {
  const added = wishlist.toggle(props.product.id);
  toast.info(
    added
      ? `${props.product.name} saved to your wishlist.`
      : "Removed from your wishlist.",
  );
}
</script>

<template>
  <article class="group relative">
    <div class="relative overflow-hidden bg-line">
      <!-- image link is skipped by keyboard and screen readers; the name link below is the real one -->
      <RouterLink :to="to" class="block" tabindex="-1" aria-hidden="true">
        <div
          class="relative transition-transform duration-[1100ms] ease-brand group-hover:scale-[1.04]"
          :class="!inStock && 'opacity-60'"
        >
          <AppImage
            :src="first?.url"
            :alt="first?.alt || product.name"
            ratio="4/5"
            :eager="eager"
          />
          <div
            v-if="second"
            class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          >
            <AppImage :src="second" alt="" ratio="auto" class="h-full" />
          </div>
        </div>
      </RouterLink>

      <div
        class="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5"
      >
        <Badge v-for="b in badges" :key="b" :variant="b">{{ BADGE_LABELS[b] }}</Badge>
      </div>

      <button
        type="button"
        class="absolute right-3 top-3 grid h-10 w-10 place-items-center bg-bone/90 transition-colors hover:bg-white"
        :class="wished ? 'text-gold-dark' : 'text-ink'"
        :aria-pressed="wished"
        :aria-label="
          wished
            ? `Remove ${product.name} from wishlist`
            : `Save ${product.name} to wishlist`
        "
        @click="toggleWish"
      >
        <StarIcon :size="18" :filled="wished" />
      </button>

      <button
        type="button"
        class="absolute inset-x-0 bottom-0 hidden h-11 translate-y-full items-center justify-center gap-2 bg-ink text-[11px] font-semibold uppercase tracking-label text-bone transition-transform duration-300 ease-brand hover:bg-gold hover:text-ink focus-visible:translate-y-0 group-focus-within:translate-y-0 group-hover:translate-y-0 md:flex"
        :aria-label="`Quick view ${product.name}`"
        @click="ui.openQuickView(product.slug)"
      >
        <Eye :size="15" /> Quick view
      </button>
    </div>

    <div class="mt-4">
      <p class="label">{{ product.type }}</p>
      <h3 class="mt-1.5 text-[22px] leading-none">
        <RouterLink :to="to" class="streak">{{ product.name }}</RouterLink>
      </h3>
      <p class="mt-2 flex flex-wrap items-baseline gap-x-2.5 text-[15px]">
        <span class="font-semibold" :class="onSale && 'text-sale'">{{
          formatNaira(currentPrice(product))
        }}</span>
        <s v-if="onSale" class="text-graphite">{{
          formatNaira(product.price)
        }}</s>
        <span v-if="onSale" class="text-[12px] font-semibold text-sale"
          >-{{ discountPercent(product) }}%</span
        >
      </p>
      <div class="mt-3 flex items-center gap-1.5">
        <span class="sr-only">Colours: {{ colorNames }}</span>
        <span
          v-for="c in product.colors.slice(0, 4)"
          :key="c.name"
          aria-hidden="true"
          :title="c.name"
          class="h-3.5 w-3.5 border border-ink/20"
          :style="{ background: c.hex }"
        />
        <span
          v-if="extraColors"
          class="text-[12px] text-graphite"
          aria-hidden="true"
          >+{{ extraColors }}</span
        >
      </div>
    </div>
  </article>
</template>
