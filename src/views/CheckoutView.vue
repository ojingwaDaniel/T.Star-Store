<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import OrderSummary from "@/components/checkout/OrderSummary.vue";
import PaymentMethods from "@/components/checkout/PaymentMethods.vue";
import { useCheckoutStore } from "@/stores/checkout";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";
import { useFormValidation } from "@/composables/useFormValidation";
import { req, email, phone } from "@/utils/rules";
import { STATES, findState } from "@/config/locations";
import { USE_MOCKS } from "@/config/api";
import { formatNaira } from "@/utils/currency";

const route = useRoute();
const router = useRouter();
const checkout = useCheckoutStore();
const cart = useCartStore();
const auth = useAuthStore();
const toast = useToast();

const form = checkout.form;
const placed = ref(false); // keeps the page stable while it fades out after success
const formError = ref("");
const itemErrors = ref([]);
const errorBox = ref(null);

const { errors, validate, validateField, setServerErrors } = useFormValidation({
  firstName: [req("Enter your first name.")],
  lastName: [req("Enter your last name.")],
  email: [req("Enter your email address."), email()],
  phone: [req("Enter your phone number."), phone()],
  address: [req("Enter your delivery address.")],
  state: [req("Select your state.")],
  city: [req("Select your city.")],
  paymentMethod: [req("Select a payment method.")],
});

const stateOptions = STATES.map((s) => ({ value: s.name, label: s.name }));
const cityOptions = computed(() =>
  (findState(form.state)?.cities || []).map((c) => ({ value: c, label: c })),
);

// A city belongs to one state, so clear it when the state changes
watch(
  () => form.state,
  () => {
    if (form.city && !cityOptions.value.some((c) => c.value === form.city))
      form.city = "";
  },
);

const isBuyNow = computed(() => checkout.source === "buy-now");
const editTo = computed(() =>
  isBuyNow.value && checkout.buyNowLine
    ? { name: "product", params: { slug: checkout.buyNowLine.slug } }
    : { name: "cart" },
);
const stateChosen = computed(() => !!form.state);
const summaryTotal = computed(() =>
  stateChosen.value ? checkout.total : checkout.subtotal,
);
const showEmpty = computed(() => !placed.value && checkout.lines.length === 0);

function applyMode() {
  const mode = route.query.mode === "buy-now" ? "buy-now" : "cart";
  if (!checkout.setSource(mode)) {
    toast.info(
      "Your Buy Now selection has expired. Please choose your options again.",
    );
    router.replace({ name: "shop" });
    return false;
  }
  return true;
}

onMounted(() => {
  if (!applyMode()) return;
  if (checkout.source === "cart") cart.revalidate();
  if (!form.state && cart.deliveryState) form.state = cart.deliveryState;
  const u = auth.user;
  if (u) {
    if (!form.email) form.email = u.email || "";
    if (!form.firstName && u.name) {
      const [first, ...rest] = u.name.split(" ");
      form.firstName = first;
      form.lastName = form.lastName || rest.join(" ");
    }
    if (!form.phone) form.phone = u.phone || "";
  }
});

// Switching between /checkout and /checkout?mode=buy-now while on this page
watch(
  () => route.query.mode,
  () => {
    if (route.name === "checkout" && !placed.value) applyMode();
  },
);

async function focusFirstError() {
  await nextTick();
  const bad = document.querySelector('[aria-invalid="true"]');
  if (bad) bad.focus();
  else errorBox.value?.focus();
}

async function submit() {
  if (checkout.submitting) return;
  formError.value = "";
  itemErrors.value = [];
  if (!validate(form)) {
    focusFirstError();
    return;
  }
  if (!checkout.canCheckout) return;
  try {
    const order = await checkout.placeOrder();
    placed.value = true;
    router.replace({
      name: "order-confirmation",
      params: { orderNumber: order.orderNumber },
    });
  } catch (e) {
    if (e.status === 422) {
      setServerErrors(e);
      itemErrors.value = Array.isArray(e.errors?.items) ? e.errors.items : [];
      formError.value = e.message || "Please check your details and try again.";
    } else {
      formError.value = e.message || "Something went wrong. Please try again.";
    }
    focusFirstError();
  }
}
</script>

<template>
  <div v-if="placed" class="shell section-y text-center" role="status">
    <p class="font-display text-4xl font-bold uppercase">Placing your order…</p>
  </div>

  <EmptyState
    v-else-if="showEmpty"
    title="Nothing to check out"
    text="Your cart is empty. Add a piece you love to continue."
    action-label="Start shopping"
    :action-to="{ name: 'shop' }"
  />

  <div v-else class="shell py-8 lg:py-12">
    <h1 class="text-5xl md:text-7xl">Checkout</h1>
    <p v-if="isBuyNow" class="mt-3 text-[14px] text-graphite">
      Buying this item directly. Your cart is untouched.
    </p>

    <!-- mobile: collapsible summary above the form -->
    <details class="group mt-8 border border-line bg-white lg:hidden">
      <summary
        class="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden"
      >
        <span class="label text-ink"
          >Order summary ({{ checkout.lines.length }} item{{
            checkout.lines.length === 1 ? "" : "s"
          }})</span
        >
        <span class="font-semibold">{{ formatNaira(summaryTotal) }}</span>
      </summary>
      <div class="border-t border-line">
        <OrderSummary
          :lines="checkout.lines"
          :subtotal="checkout.subtotal"
          :delivery-fee="checkout.deliveryFee"
          :total="summaryTotal"
          :state-chosen="stateChosen"
          :quoting="checkout.quoting"
          :edit-to="editTo"
          :edit-label="isBuyNow ? 'Change' : 'Edit cart'"
          title="Summary"
          class="!border-0"
        />
      </div>
    </details>

    <div class="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-14">
      <form
        class="space-y-12 lg:col-span-7"
        novalidate
        @submit.prevent="submit"
      >
        <div
          v-if="formError"
          ref="errorBox"
          tabindex="-1"
          role="alert"
          class="border border-error bg-white p-4 text-[14px] text-error focus:outline-none"
        >
          <p class="font-semibold">{{ formError }}</p>
          <ul v-if="itemErrors.length" class="mt-2 list-disc pl-5">
            <li v-for="m in itemErrors" :key="m">{{ m }}</li>
          </ul>
          <RouterLink
            v-if="itemErrors.length"
            :to="editTo"
            class="mt-3 inline-block underline underline-offset-4"
            >Review your items</RouterLink
          >
        </div>

        <section aria-labelledby="co-contact">
          <h2 id="co-contact" class="text-3xl">
            <span class="text-gold-dark">1.</span> Contact
          </h2>
          <div class="mt-6 grid gap-5 sm:grid-cols-2">
            <BaseInput
              v-model="form.firstName"
              label="First name"
              autocomplete="given-name"
              required
              :error="errors.firstName"
              @blur="validateField('firstName', form)"
            />
            <BaseInput
              v-model="form.lastName"
              label="Last name"
              autocomplete="family-name"
              required
              :error="errors.lastName"
              @blur="validateField('lastName', form)"
            />
            <BaseInput
              v-model="form.email"
              label="Email address"
              type="email"
              autocomplete="email"
              required
              :error="errors.email"
              @blur="validateField('email', form)"
            />
            <BaseInput
              v-model="form.phone"
              label="Phone number"
              type="tel"
              autocomplete="tel"
              required
              placeholder="0803 123 4567"
              hint="We call this number to confirm delivery."
              :error="errors.phone"
              @blur="validateField('phone', form)"
            />
          </div>
        </section>

        <section aria-labelledby="co-delivery">
          <h2 id="co-delivery" class="text-3xl">
            <span class="text-gold-dark">2.</span> Delivery
          </h2>
          <div class="mt-6 grid gap-5 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <BaseInput
                v-model="form.address"
                label="Street address"
                autocomplete="street-address"
                required
                :error="errors.address"
                @blur="validateField('address', form)"
              />
            </div>
            <BaseSelect
              v-model="form.state"
              label="State"
              placeholder="Select your state"
              :options="stateOptions"
              required
              :error="errors.state"
            />
            <BaseSelect
              v-model="form.city"
              label="City / area"
              :placeholder="
                form.state ? 'Select your city' : 'Choose a state first'
              "
              :options="cityOptions"
              :disabled="!form.state"
              required
              :error="errors.city"
            />
            <div class="sm:col-span-2">
              <BaseInput
                v-model="form.landmark"
                label="Landmark (optional)"
                hint="A nearby place that helps the rider find you."
              />
            </div>
            <div class="sm:col-span-2">
              <BaseInput
                v-model="form.notes"
                label="Delivery notes (optional)"
                textarea
                :rows="3"
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="co-payment">
          <h2 id="co-payment" class="mb-6 text-3xl">
            <span class="text-gold-dark">3.</span> Payment
          </h2>
          <PaymentMethods
            v-model="form.paymentMethod"
            :error="errors.paymentMethod"
          />
        </section>

        <div>
          <p
            v-if="checkout.hasIssues"
            class="mb-4 text-[14px] text-error"
            role="alert"
          >
            Some items are unavailable.
            <RouterLink :to="editTo" class="underline underline-offset-4"
              >Review your items</RouterLink
            >
            to continue.
          </p>
          <BaseButton
            type="submit"
            block
            size="lg"
            :loading="checkout.submitting"
            :disabled="!checkout.canCheckout"
          >
            Place order · {{ formatNaira(summaryTotal) }}
          </BaseButton>
          <p
            v-if="USE_MOCKS"
            class="mt-3 text-[12px] leading-relaxed text-graphite"
          >
            Demo store: no payment is taken and no email is sent. The order is
            saved in this browser only.
          </p>
          <p class="mt-3 text-[12px] leading-relaxed text-graphite">
            By placing your order you agree to our
            <RouterLink
              to="/terms"
              class="underline underline-offset-4 hover:text-ink"
              >Terms</RouterLink
            >
            and
            <RouterLink
              to="/shipping-returns"
              class="underline underline-offset-4 hover:text-ink"
              >Shipping &amp; Returns</RouterLink
            >
            policy.
          </p>
        </div>
      </form>

      <aside class="hidden lg:col-span-5 lg:block" aria-label="Order summary">
        <div class="sticky top-8">
          <OrderSummary
            :lines="checkout.lines"
            :subtotal="checkout.subtotal"
            :delivery-fee="checkout.deliveryFee"
            :total="summaryTotal"
            :state-chosen="stateChosen"
            :quoting="checkout.quoting"
            :edit-to="editTo"
            :edit-label="isBuyNow ? 'Change' : 'Edit cart'"
          />
        </div>
      </aside>
    </div>
  </div>
</template>
