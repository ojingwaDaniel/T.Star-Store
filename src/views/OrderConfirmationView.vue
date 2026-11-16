<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { CircleCheck, Printer } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import Skeleton from "@/components/ui/Skeleton.vue";
import OrderSummary from "@/components/checkout/OrderSummary.vue";
import { useCheckoutStore } from "@/stores/checkout";
import { getOrder } from "@/services/orderService";
import { USE_MOCKS } from "@/config/api";

const route = useRoute();
const checkout = useCheckoutStore();

const order = ref(null);
const loading = ref(true);
const notFound = ref(false);
const error = ref("");

const PAYMENT_LABELS = {
  paystack: "Card, bank transfer or USSD (Paystack)",
  "bank-transfer": "Direct bank transfer",
  "pay-on-delivery": "Pay on delivery",
};

async function load() {
  const number = route.params.orderNumber;
  error.value = "";
  notFound.value = false;
  if (checkout.lastOrder?.orderNumber === number) {
    order.value = checkout.lastOrder;
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    order.value = await getOrder(number);
  } catch (e) {
    if (e.status === 404) notFound.value = true;
    else error.value = e.message || "Could not load this order.";
  } finally {
    loading.value = false;
  }
}
// The route is already the next one while this page fades out
watch(
  () => route.params.orderNumber,
  (n) => {
    if (n && route.name === "order-confirmation") load();
  },
  { immediate: true },
);

const lines = computed(() =>
  (order.value?.items || []).map((i) => ({
    ...i,
    key: `${i.productId}|${i.size}|${i.color}`,
  })),
);
const paid = computed(() => order.value?.paymentStatus === "paid");
const fmt = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "long",
  timeStyle: "short",
});
</script>

<template>
  <div v-if="loading" class="shell py-14" aria-busy="true">
    <Skeleton class="h-16 w-2/3" /><Skeleton class="mt-6 h-40 w-full" />
  </div>

  <EmptyState
    v-else-if="notFound"
    title="Order not found"
    text="We couldn't find that order. In this demo, orders can only be viewed in the browser they were placed in."
    action-label="Back to shop"
    :action-to="{ name: 'shop' }"
  />

  <div v-else-if="error" class="shell section-y text-center" role="alert">
    <p class="text-error">{{ error }}</p>
    <BaseButton class="mt-6" variant="outline" @click="load"
      >Try again</BaseButton
    >
  </div>

  <div v-else-if="order" class="shell py-10 lg:py-14">
    <div class="max-w-2xl">
      <CircleCheck :size="40" class="text-success" aria-hidden="true" />
      <p class="label-gold mt-5">Order placed</p>
      <h1 class="mt-2 text-6xl md:text-8xl">
        Thank you, {{ order.customer.firstName }}.
      </h1>
      <p class="mt-5 text-[17px] text-graphite">
        Your order number is
        <strong class="text-ink">{{ order.orderNumber }}</strong
        >. Keep it for any questions about your delivery.
      </p>
    </div>

    <div class="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div class="space-y-8 lg:col-span-7">
        <section
          class="border border-line bg-white p-6 md:p-8"
          aria-labelledby="pay-title"
        >
          <h2 id="pay-title" class="text-3xl">Payment</h2>
          <p class="mt-3 text-[14px]">
            <span class="text-graphite">Method:</span>
            {{ PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod
            }}<br />
            <span class="text-graphite">Status:</span>
            <strong :class="paid ? 'text-success' : 'text-gold-dark'">
              {{ paid ? "Paid" : "Not yet paid" }}</strong
            >
          </p>

          <div class="mt-4 text-[15px] leading-relaxed text-graphite">
            <template v-if="paid"><p>We've received your payment.</p></template>
            <template v-else-if="order.paymentMethod === 'paystack'">
              <p v-if="order.payment?.authorizationUrl">
                Your order is saved. Complete your payment to start processing
                it.
              </p>
              <p v-else>
                Your order is saved, but online payment isn't connected yet, so
                nothing has been charged. This order is waiting for payment.
              </p>
              <BaseButton
                v-if="order.payment?.authorizationUrl"
                class="mt-4"
                :href="order.payment.authorizationUrl"
                >Complete payment</BaseButton
              >
            </template>
            <p v-else-if="order.paymentMethod === 'bank-transfer'">
              We'll contact you at {{ order.customer.email }} or
              {{ order.customer.phone }} with our account details. Your order is
              processed once the transfer is confirmed.
            </p>
            <p v-else>
              Pay when your order arrives. Please keep your phone on so the
              rider can reach you.
            </p>
          </div>

          <p
            v-if="USE_MOCKS"
            class="mt-5 border-t border-line pt-4 text-[12px] text-graphite"
          >
            Demo store: this order exists only in your browser. No email was
            sent and no payment was taken.
          </p>
        </section>

        <section
          class="border border-line bg-white p-6 md:p-8"
          aria-labelledby="ship-title"
        >
          <h2 id="ship-title" class="text-3xl">Delivery</h2>
          <address
            class="mt-3 text-[15px] not-italic leading-relaxed text-graphite"
          >
            {{ order.customer.firstName }} {{ order.customer.lastName }}<br />
            {{ order.delivery.address }}<br />
            <template v-if="order.delivery.landmark"
              >Near {{ order.delivery.landmark }}<br
            /></template>
            {{ order.delivery.city }}, {{ order.delivery.state }}<br />
            {{ order.customer.phone }}
          </address>
          <p v-if="order.delivery.notes" class="mt-3 text-[14px] text-graphite">
            Notes: {{ order.delivery.notes }}
          </p>
          <p class="mt-4 text-[12px] text-graphite">
            Placed {{ fmt.format(new Date(order.createdAt)) }}
          </p>
        </section>

        <div class="flex flex-wrap gap-3 print:hidden">
          <BaseButton :to="{ name: 'shop' }">Continue shopping</BaseButton>
          <BaseButton variant="outline" @click="window.print()"
            ><Printer :size="16" /> Print</BaseButton
          >
        </div>
      </div>

      <aside class="lg:col-span-5" aria-label="Order summary">
        <OrderSummary
          :lines="lines"
          :subtotal="order.subtotal"
          :delivery-fee="order.deliveryFee"
          :total="order.total"
          title="Your order"
        />
      </aside>
    </div>
  </div>
</template>
