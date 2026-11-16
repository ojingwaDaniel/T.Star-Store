<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/ui/BaseButton.vue";
import QuantityStepper from "@/components/ui/QuantityStepper.vue";
import VariantSelector from "./VariantSelector.vue";
import SizeGuideModal from "./SizeGuideModal.vue";
import { useCartStore } from "@/stores/cart";
import { useCheckoutStore } from "@/stores/checkout";
import { useUiStore } from "@/stores/ui";
import { useToast } from "@/composables/useToast";
import {
  findVariant,
  isInStock,
  selectionError,
  stockLabel,
  LOW_STOCK,
} from "@/utils/product";

const props = defineProps({ product: { type: Object, required: true } });

const router = useRouter();
const cart = useCartStore();
const checkout = useCheckoutStore();
const ui = useUiStore();
const toast = useToast();

const size = ref("");
const color = ref("");
const qty = ref(1);
const showErrors = ref(false);
const guideOpen = ref(false);

// Start fresh per product. A product with a single size or colour is pre-selected.
function init() {
  size.value = props.product.sizes.length === 1 ? props.product.sizes[0] : "";
  color.value =
    props.product.colors.length === 1 ? props.product.colors[0].name : "";
  qty.value = 1;
  showErrors.value = false;
}
watch(() => props.product.id, init, { immediate: true });

const hasStock = computed(() => isInStock(props.product));
const variant = computed(() =>
  size.value && color.value
    ? findVariant(props.product, size.value, color.value)
    : null,
);
const stock = computed(() => variant.value?.stock ?? 0);
const maxQty = computed(() => (variant.value ? Math.max(1, stock.value) : 99));
const error = computed(() =>
  selectionError(props.product, size.value, color.value, qty.value),
);

watch(stock, (s) => {
  if (variant.value && qty.value > s) qty.value = Math.max(1, s);
});

function validate() {
  if (!error.value) return true;
  showErrors.value = true;
  toast.error(error.value);
  return false;
}

function addToCart() {
  if (!validate()) return;
  const res = cart.add(props.product, {
    size: size.value,
    color: color.value,
    quantity: qty.value,
  });
  if (!res.ok) {
    toast.error(res.error);
    return;
  }
  toast.success(`${props.product.name} added to your cart.`);
  ui.closeQuickView();
  ui.openCart();
}

// Skips the cart entirely: one validated item goes to the checkout store.
function buyNow() {
  if (!validate()) return;
  const res = checkout.startBuyNow(props.product, {
    size: size.value,
    color: color.value,
    quantity: qty.value,
  });
  if (!res.ok) {
    toast.error(res.error);
    return;
  }
  ui.closeQuickView();
  router.push({ name: "checkout", query: { mode: "buy-now" } });
}
</script>

<template>
  <div>
    <VariantSelector
      v-model:size="size"
      v-model:color="color"
      :product="product"
      :show-errors="showErrors"
      @size-guide="guideOpen = true"
    />

    <div class="mt-7 flex flex-wrap items-end gap-x-6 gap-y-3">
      <div>
        <p class="label mb-2 text-ink">Quantity</p>
        <QuantityStepper
          v-model="qty"
          :max="maxQty"
          @limit="
            toast.info(
              variant
                ? `Only ${stock} available in this size and colour.`
                : 'Quantity limit reached.',
            )
          "
        />
      </div>
      <p class="min-w-[10rem] flex-1 pb-3 text-[14px]" aria-live="polite">
        <template v-if="!hasStock"
          ><span class="font-semibold text-error">Out of stock</span></template
        >
        <template v-else-if="variant">
          <span
            class="mr-2 inline-block h-2 w-2 rounded-full align-middle"
            :class="stock <= LOW_STOCK ? 'bg-gold' : 'bg-success'"
            aria-hidden="true"
          />
          <span class="font-semibold">{{ stockLabel(stock) }}</span>
        </template>
        <template v-else
          ><span class="text-graphite"
            >Select a size and colour to see stock.</span
          ></template
        >
      </p>
    </div>

    <p
      v-if="showErrors && error"
      class="mt-4 text-[14px] font-medium text-error"
      role="alert"
    >
      {{ error }}
    </p>

    <div class="mt-6 grid gap-3">
      <template v-if="hasStock">
        <BaseButton block size="lg" @click="addToCart">Add to cart</BaseButton>
        <BaseButton block size="lg" variant="outline" @click="buyNow"
          >Buy now</BaseButton
        >
      </template>
      <BaseButton v-else block size="lg" disabled>Sold out</BaseButton>
    </div>
    <p v-if="hasStock" class="mt-3 text-[12px] leading-relaxed text-graphite">
      Buy now goes straight to checkout with only this item. Your cart stays as
      it is.
    </p>

    <SizeGuideModal
      :open="guideOpen"
      :product="product"
      @close="guideOpen = false"
    />
  </div>
</template>
