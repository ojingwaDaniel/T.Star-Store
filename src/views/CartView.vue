<script setup>
import { computed, onMounted } from "vue";
import { ArrowRight } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import CartLine from "@/components/cart/CartLine.vue";
import { useCartStore } from "@/stores/cart";
import { STATES } from "@/config/locations";
import { SITE } from "@/config/site";
import { formatNaira } from "@/utils/currency";

const cart = useCartStore();
const stateOptions = STATES.map((s) => ({ value: s.name, label: s.name }));

// Re-check stock and prices whenever the page opens
onMounted(() => cart.revalidate());

const progress = computed(() =>
  Math.min(100, Math.round((cart.subtotal / SITE.freeDeliveryThreshold) * 100)),
);
const deliveryText = computed(() => {
  const d = cart.delivery;
  if (d.freeDeliveryApplied) return "Free";
  return cart.deliveryState ? formatNaira(d.fee) : `From ${formatNaira(d.fee)}`;
});
const daysText = computed(() => {
  const [a, b] = cart.delivery.estimatedDays;
  return `${a} to ${b} working days`;
});
</script>

<template>
  <div>
    <header class="border-b border-line bg-white">
      <div class="shell py-10 md:py-14">
        <p class="label-gold">Bag</p>
        <h1 class="mt-3 text-6xl md:text-8xl">Your cart</h1>
      </div>
    </header>

    <EmptyState
      v-if="cart.isEmpty"
      title="Your cart is empty"
      text="Add something you love and it will show up here."
      action-label="Start shopping"
      :action-to="{ name: 'shop' }"
    />

    <div
      v-else
      class="shell grid gap-12 py-10 lg:grid-cols-12 lg:gap-14 lg:py-14"
    >
      <section class="lg:col-span-8" aria-label="Items in your cart">
        <p
          v-if="cart.hasIssues"
          class="mb-6 border border-error bg-white px-4 py-3 text-[14px] text-error"
          role="alert"
        >
          Some items are no longer available. Remove them to continue to
          checkout.
        </p>
        <ul class="divide-y divide-line">
          <CartLine v-for="line in cart.items" :key="line.key" :line="line" />
        </ul>
        <div class="mt-8">
          <RouterLink
            :to="{ name: 'shop' }"
            class="streak text-[12px] font-semibold uppercase tracking-label"
            >Continue shopping</RouterLink
          >
        </div>
      </section>

      <aside class="lg:col-span-4" aria-label="Order summary">
        <div class="border border-line bg-white p-6 md:p-7 lg:sticky lg:top-24">
          <h2 class="text-3xl">Summary</h2>

          <div class="mt-5">
            <p class="text-[13px]" aria-live="polite">
              <template v-if="cart.amountToFreeDelivery > 0"
                >Add
                <strong>{{ formatNaira(cart.amountToFreeDelivery) }}</strong>
                more for free delivery.</template
              >
              <template v-else
                ><strong>You've unlocked free delivery.</strong></template
              >
            </p>
            <div
              class="mt-2.5 h-1 bg-line"
              role="progressbar"
              :aria-valuenow="progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Progress to free delivery"
            >
              <div
                class="h-full bg-gold transition-[width] duration-500 ease-brand"
                :style="{ width: `${progress}%` }"
              />
            </div>
          </div>

          <div class="mt-6">
            <BaseSelect
              label="Delivery state (estimate)"
              placeholder="Select your state"
              :options="stateOptions"
              :model-value="cart.deliveryState"
              @update:model-value="cart.setDeliveryState"
            />
          </div>

          <dl class="mt-6 space-y-3 text-[14px]">
            <div class="flex justify-between">
              <dt class="text-graphite">Subtotal</dt>
              <dd class="font-semibold">{{ formatNaira(cart.subtotal) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-graphite">Delivery</dt>
              <dd class="text-right font-semibold">
                {{ deliveryText }}
                <span
                  v-if="cart.deliveryState"
                  class="block text-[12px] font-normal text-graphite"
                  >{{ daysText }}</span
                >
              </dd>
            </div>
            <div
              class="flex items-baseline justify-between border-t border-line pt-4"
            >
              <dt class="label text-ink">
                {{
                  cart.deliveryState || cart.delivery.freeDeliveryApplied
                    ? "Total"
                    : "Estimated total"
                }}
              </dt>
              <dd class="text-2xl font-semibold">
                {{ formatNaira(cart.total) }}
              </dd>
            </div>
          </dl>
          <p class="mt-3 text-[12px] leading-relaxed text-graphite">
            The final delivery fee is confirmed at checkout once you enter your
            address.
          </p>

          <div class="mt-6 grid gap-3">
            <BaseButton
              v-if="!cart.hasIssues"
              :to="{ name: 'checkout' }"
              block
              size="lg"
              >Checkout <ArrowRight :size="16"
            /></BaseButton>
            <BaseButton v-else block size="lg" disabled>Checkout</BaseButton>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
