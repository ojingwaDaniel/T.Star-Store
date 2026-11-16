import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { SITE } from "@/config/site";
import { local } from "@/utils/storage";
import { estimateDelivery } from "@/utils/delivery";
import {
  currentPrice,
  findVariant,
  lineKey,
  makeLine,
  selectionError,
} from "@/utils/product";
import { validateCart } from "@/services/cartService";

const CART_KEY = "tstar:cart";
const STATE_KEY = "tstar:delivery-state";

export const useCartStore = defineStore("cart", () => {
  const saved = local.get(CART_KEY, []);
  const items = ref(Array.isArray(saved) ? saved : []);
  const deliveryState = ref(local.get(STATE_KEY, ""));
  const validating = ref(false);

  // Persist between refreshes
  watch(items, (v) => local.set(CART_KEY, v), { deep: true });
  watch(deliveryState, (v) => local.set(STATE_KEY, v));

  const count = computed(() => items.value.reduce((n, l) => n + l.quantity, 0));
  const subtotal = computed(() =>
    items.value.reduce((n, l) => n + l.unitPrice * l.quantity, 0),
  );
  const delivery = computed(() =>
    estimateDelivery(subtotal.value, deliveryState.value),
  );
  const total = computed(() => subtotal.value + delivery.value.fee);
  const isEmpty = computed(() => items.value.length === 0);
  const amountToFreeDelivery = computed(() =>
    Math.max(0, SITE.freeDeliveryThreshold - subtotal.value),
  );
  const hasIssues = computed(() =>
    items.value.some((l) => l.available === false),
  );

  // Returns { ok: true } or { ok: false, error } (the caller shows the toast)
  function add(product, { size, color, quantity = 1 }) {
    const err = selectionError(product, size, color, quantity);
    if (err) return { ok: false, error: err };

    const stock = findVariant(product, size, color).stock;
    const existing = items.value.find(
      (l) => l.key === lineKey(product.id, size, color),
    );
    const next = (existing?.quantity || 0) + quantity;
    if (next > stock) {
      return {
        ok: false,
        error: `You already have ${existing?.quantity || 0} in your cart. Only ${stock} available.`,
      };
    }

    if (existing) {
      existing.quantity = next;
      existing.maxStock = stock;
      existing.unitPrice = currentPrice(product);
    } else {
      items.value.push(makeLine(product, size, color, quantity));
    }
    return { ok: true };
  }

  function setQuantity(key, qty) {
    const line = items.value.find((l) => l.key === key);
    if (!line) return { ok: false };
    const n = Math.floor(Number(qty)) || 1;
    if (n > line.maxStock) {
      line.quantity = Math.max(1, line.maxStock);
      return { ok: false, error: `Only ${line.maxStock} available.` };
    }
    line.quantity = Math.max(1, n);
    return { ok: true };
  }

  const increment = (key) => {
    const line = items.value.find((l) => l.key === key);
    return line ? setQuantity(key, line.quantity + 1) : { ok: false };
  };
  const decrement = (key) => {
    const line = items.value.find((l) => l.key === key);
    return line
      ? setQuantity(key, Math.max(1, line.quantity - 1))
      : { ok: false };
  };

  const remove = (key) => {
    items.value = items.value.filter((l) => l.key !== key);
  };
  const clear = () => {
    items.value = [];
  };

  // Needs the full product (fetch it first) so stock for the new variant is known
  function changeVariant(key, product, { size, color }) {
    const line = items.value.find((l) => l.key === key);
    if (!line) return { ok: false, error: "Item not found." };
    const err = selectionError(product, size, color, 1);
    if (err) return { ok: false, error: err };

    const newKey = lineKey(product.id, size, color);
    if (newKey === key) return { ok: true };

    const stock = findVariant(product, size, color).stock;
    const target = items.value.find((l) => l.key === newKey);
    const wanted = (target?.quantity || 0) + line.quantity;
    const qty = Math.min(wanted, stock);

    if (target) {
      target.quantity = qty;
      target.maxStock = stock;
      remove(key);
    } else {
      const idx = items.value.indexOf(line);
      items.value.splice(idx, 1, makeLine(product, size, color, qty));
    }
    return { ok: true, adjusted: qty < wanted };
  }

  const setDeliveryState = (name) => {
    deliveryState.value = name;
  };

  // Refresh stock and prices from the server. Failure keeps the local snapshot.
  async function revalidate() {
    if (!items.value.length) return;
    validating.value = true;
    try {
      const res = await validateCart(
        items.value.map(({ productId, size, color, quantity }) => ({
          productId,
          size,
          color,
          quantity,
        })),
      );
      for (const r of res.items) {
        const line = items.value.find(
          (l) =>
            l.productId === r.productId &&
            l.size === r.size &&
            l.color === r.color,
        );
        if (!line) continue;
        line.unitPrice = r.unitPrice || line.unitPrice;
        line.originalPrice = r.originalPrice || line.originalPrice;
        line.maxStock = r.maxQuantity;
        line.available = r.available;
        let issue = r.available ? "" : r.issue;
        if (r.available && line.quantity > r.maxQuantity) {
          line.quantity = r.maxQuantity;
          issue = `Quantity reduced to ${r.maxQuantity}, the most available.`;
        }
        line.issue = issue;
      }
    } catch {
      /* checkout validates again on submit */
    } finally {
      validating.value = false;
    }
  }

  return {
    items,
    deliveryState,
    validating,
    count,
    subtotal,
    delivery,
    total,
    isEmpty,
    amountToFreeDelivery,
    hasIssues,
    add,
    setQuantity,
    increment,
    decrement,
    remove,
    clear,
    changeVariant,
    setDeliveryState,
    revalidate,
  };
});
