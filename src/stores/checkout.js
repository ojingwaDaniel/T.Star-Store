import { defineStore } from "pinia";
import { ref, reactive, computed, watch } from "vue";
import { session } from "@/utils/storage";
import { estimateDelivery } from "@/utils/delivery";
import { makeLine, selectionError } from "@/utils/product";
import {
  getDeliveryQuote,
  placeOrder as submitOrder,
} from "@/services/checkoutService";
import { useCartStore } from "./cart";

const BUY_NOW_KEY = "tstar:buy-now";
const DRAFT_KEY = "tstar:checkout-draft";
const LAST_ORDER_KEY = "tstar:last-order";

const emptyForm = () => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  landmark: "",
  state: "",
  city: "",
  notes: "",
  paymentMethod: "",
});

export const useCheckoutStore = defineStore("checkout", () => {
  const cart = useCartStore();

  // Buy Now item is kept apart from the cart and survives a page refresh (session only)
  const buyNowLine = ref(session.get(BUY_NOW_KEY, null));
  const source = ref("cart"); // 'cart' | 'buy-now', set by the route (?mode=buy-now)
  const form = reactive({ ...emptyForm(), ...session.get(DRAFT_KEY, {}) });
  const submitting = ref(false);
  const quoting = ref(false);
  const lastOrder = ref(session.get(LAST_ORDER_KEY, null));

  watch(form, (v) => session.set(DRAFT_KEY, v), { deep: true });

  const lines = computed(() =>
    source.value === "buy-now" && buyNowLine.value
      ? [buyNowLine.value]
      : cart.items,
  );
  const subtotal = computed(() =>
    lines.value.reduce((n, l) => n + l.unitPrice * l.quantity, 0),
  );
  const hasIssues = computed(() =>
    lines.value.some((l) => l.available === false),
  );
  const canCheckout = computed(
    () => lines.value.length > 0 && !hasIssues.value,
  );

  const quote = ref(estimateDelivery(0, ""));
  const deliveryFee = computed(() => quote.value.fee);
  const total = computed(() => subtotal.value + deliveryFee.value);

  // Latest request wins, so fast state changes never show a stale fee
  let quoteSeq = 0;
  async function refreshQuote() {
    const seq = ++quoteSeq;
    if (!form.state) {
      quote.value = estimateDelivery(subtotal.value, "");
      return;
    }
    quoting.value = true;
    try {
      const q = await getDeliveryQuote({
        state: form.state,
        city: form.city,
        subtotal: subtotal.value,
      });
      if (seq === quoteSeq) quote.value = { ...q, exact: true };
    } catch {
      if (seq === quoteSeq)
        quote.value = estimateDelivery(subtotal.value, form.state);
    } finally {
      if (seq === quoteSeq) quoting.value = false;
    }
  }
  watch([() => form.state, subtotal], refreshQuote, { immediate: true });

  // Returns false when asking for buy-now but there is no Buy Now item (e.g. a bare URL)
  function setSource(mode) {
    if (mode === "buy-now") {
      if (!buyNowLine.value) return false;
      source.value = "buy-now";
      return true;
    }
    source.value = "cart";
    return true;
  }

  // Validates, stores one item and never touches the cart
  function startBuyNow(product, { size, color, quantity = 1 }) {
    const err = selectionError(product, size, color, quantity);
    if (err) return { ok: false, error: err };
    buyNowLine.value = makeLine(product, size, color, quantity);
    session.set(BUY_NOW_KEY, buyNowLine.value);
    source.value = "buy-now";
    return { ok: true };
  }

  function clearBuyNow() {
    buyNowLine.value = null;
    session.remove(BUY_NOW_KEY);
  }

  function resetForm() {
    Object.assign(form, emptyForm());
    session.remove(DRAFT_KEY);
  }

  // Throws ApiError on failure (422 carries field errors). No payment is taken here.
  async function placeOrder() {
    submitting.value = true;
    try {
      const trim = (v) => String(v || "").trim();
      const order = await submitOrder({
        source: source.value,
        customer: {
          firstName: trim(form.firstName),
          lastName: trim(form.lastName),
          email: trim(form.email),
          phone: trim(form.phone),
        },
        delivery: {
          address: trim(form.address),
          landmark: trim(form.landmark),
          state: form.state,
          city: form.city,
          notes: trim(form.notes),
        },
        items: lines.value.map(({ productId, size, color, quantity }) => ({
          productId,
          size,
          color,
          quantity,
        })),
        paymentMethod: form.paymentMethod,
      });
      if (source.value === "cart") cart.clear();
      else clearBuyNow();
      lastOrder.value = order;
      session.set(LAST_ORDER_KEY, order);
      resetForm();
      return order;
    } finally {
      submitting.value = false;
    }
  }

  return {
    source,
    form,
    lines,
    subtotal,
    quote,
    quoting,
    deliveryFee,
    total,
    submitting,
    lastOrder,
    hasIssues,
    canCheckout,
    buyNowLine,
    setSource,
    startBuyNow,
    clearBuyNow,
    refreshQuote,
    resetForm,
    placeOrder,
  };
});
