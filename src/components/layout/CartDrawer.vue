<script setup>
import { watch } from "vue";
import { Trash2, ArrowRight } from "lucide-vue-next";
import Drawer from "@/components/ui/Drawer.vue";
import AppImage from "@/components/ui/AppImage.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import QuantityStepper from "@/components/ui/QuantityStepper.vue";
import { useUiStore } from "@/stores/ui";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/composables/useToast";
import { formatNaira } from "@/utils/currency";
import { SITE } from "@/config/site";

const ui = useUiStore();
const cart = useCartStore();
const toast = useToast();

// Re-check stock and prices every time the drawer opens
watch(
  () => ui.cartDrawerOpen,
  (open) => {
    if (open) cart.revalidate();
  },
);

function setQty(key, q) {
  const r = cart.setQuantity(key, q);
  if (!r.ok && r.error) toast.info(r.error);
}
function remove(line) {
  cart.remove(line.key);
  toast.info(`${line.name} removed from your cart.`);
}
const progress = () =>
  Math.min(100, Math.round((cart.subtotal / SITE.freeDeliveryThreshold) * 100));
</script>

<template>
  <Drawer
    :open="ui.cartDrawerOpen"
    side="right"
    label="Your cart"
    @close="ui.closeCart()"
  >
    <template #header>
      <h2 class="text-2xl">
        Your Cart <span class="text-graphite">({{ cart.count }})</span>
      </h2>
    </template>

    <EmptyState
      v-if="cart.isEmpty"
      class="flex-1"
      title="Your cart is empty"
      text="Add something you love and it will show up here."
      action-label="Start shopping"
      :action-to="{ name: 'shop' }"
      @action="ui.closeCart()"
    />

    <template v-else>
      <div class="border-b border-line bg-white px-5 py-4">
        <p class="text-[13px]" aria-live="polite">
          <template v-if="cart.amountToFreeDelivery > 0">
            Add
            <strong>{{ formatNaira(cart.amountToFreeDelivery) }}</strong> more
            for free delivery.
          </template>
          <template v-else
            ><strong>You've unlocked free delivery.</strong></template
          >
        </p>
        <div
          class="mt-2.5 h-1 bg-line"
          role="progressbar"
          :aria-valuenow="progress()"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Progress to free delivery"
        >
          <div
            class="h-full bg-gold transition-[width] duration-500 ease-brand"
            :style="{ width: `${progress()}%` }"
          />
        </div>
      </div>

      <ul class="flex-1 divide-y divide-line overflow-y-auto px-5">
        <li v-for="line in cart.items" :key="line.key" class="flex gap-4 py-5">
          <RouterLink
            :to="{ name: 'product', params: { slug: line.slug } }"
            class="block w-24 shrink-0"
            tabindex="-1"
            aria-hidden="true"
            :class="line.available === false && 'opacity-50'"
          >
            <AppImage
              :src="line.image"
              :alt="line.name"
              ratio="3/4"
              sizes="96px"
            />
          </RouterLink>

          <div class="flex min-w-0 flex-1 flex-col">
            <div class="flex items-start justify-between gap-3">
              <RouterLink
                :to="{ name: 'product', params: { slug: line.slug } }"
                class="font-display text-xl font-bold uppercase leading-none hover:text-gold-dark"
                >{{ line.name }}</RouterLink
              >
              <button
                type="button"
                class="-mr-1 p-1 text-graphite transition-colors hover:text-error"
                :aria-label="`Remove ${line.name}, ${line.color}, size ${line.size}`"
                @click="remove(line)"
              >
                <Trash2 :size="16" />
              </button>
            </div>

            <p class="mt-1.5 flex items-center gap-2 text-[13px] text-graphite">
              <span
                class="h-3 w-3 border border-ink/20"
                :style="{ background: line.colorHex }"
                aria-hidden="true"
              />
              {{ line.color }} · {{ line.size }}
            </p>
            <p
              v-if="line.issue"
              class="mt-1.5 text-[12px] font-medium text-error"
              role="alert"
            >
              {{ line.issue }}
            </p>

            <div class="mt-auto flex items-end justify-between gap-3 pt-3">
              <QuantityStepper
                size="sm"
                :model-value="line.quantity"
                :max="line.maxStock"
                :label="`Quantity for ${line.name}`"
                @update:model-value="(q) => setQty(line.key, q)"
                @limit="toast.info(`Only ${line.maxStock} available.`)"
              />
              <p class="text-right text-[15px] font-semibold">
                {{ formatNaira(line.unitPrice * line.quantity) }}
                <s
                  v-if="line.originalPrice > line.unitPrice"
                  class="block text-[12px] font-normal text-graphite"
                  >{{ formatNaira(line.originalPrice * line.quantity) }}</s
                >
              </p>
            </div>
          </div>
        </li>
      </ul>

      <div class="shrink-0 border-t border-line bg-white px-5 py-5">
        <div class="flex items-baseline justify-between">
          <span class="label text-ink">Subtotal</span>
          <span class="text-xl font-semibold">{{
            formatNaira(cart.subtotal)
          }}</span>
        </div>
        <p class="mt-1 text-[12px] text-graphite">
          Delivery is calculated at checkout.
        </p>

        <div class="mt-4 grid gap-3">
          <BaseButton
            v-if="!cart.hasIssues"
            :to="{ name: 'checkout' }"
            block
            size="lg"
            >Checkout <ArrowRight :size="16"
          /></BaseButton>
          <template v-else>
            <BaseButton block size="lg" disabled>Checkout</BaseButton>
            <p class="text-center text-[12px] text-error" role="alert">
              Remove unavailable items to continue.
            </p>
          </template>
          <BaseButton :to="{ name: 'cart' }" variant="outline" block
            >View cart</BaseButton
          >
        </div>
      </div>
    </template>
  </Drawer>
</template>
