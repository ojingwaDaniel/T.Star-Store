// A fake Laravel API. It mirrors the real endpoints, validation rules and response shapes
// so services behave identically whether USE_MOCKS is true or false.
// Not mocked: emails, real payments, and stock reduction after an order.
import { PRODUCTS } from "./products";
import { CATEGORIES } from "./categories";
import { REVIEWS } from "./reviews";
import { findState } from "@/config/locations";
import { MOCK_LATENCY_MS } from "@/config/api";
import { ApiError } from "@/services/http";
import { local } from "@/utils/storage";
import { isEmail, isNgPhone } from "@/utils/validators";
import {
  currentPrice,
  findVariant,
  availableSizes,
  selectionError,
} from "@/utils/product";
import { estimateDelivery } from "@/utils/delivery";

const wait = (ms = MOCK_LATENCY_MS) => new Promise((r) => setTimeout(r, ms));
const clone = (v) => JSON.parse(JSON.stringify(v));
const reply = async (value, ms) => {
  await wait(ms);
  return clone(value);
};
const fail = async (status, message, errors = {}, ms) => {
  await wait(ms);
  throw new ApiError(message, status, errors);
};
const toArray = (v) => (v == null || v === "" ? [] : [].concat(v));

const SIZE_ORDER = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "One Size",
];

/* ---------- Catalogue ---------- */

// Unisex products also appear under Men and Women
const matchCategory = (p, c) =>
  p.categories.includes(c) ||
  ((c === "men" || c === "women") && p.categories.includes("unisex"));

const COLLECTIONS = {
  "new-arrivals": (p) => p.isNew,
  "best-sellers": (p) => p.isBestSeller,
  sale: (p) => p.salePrice != null,
  trending: (p) => p.isTrending,
};

const SORTS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  "price-asc": (a, b) => currentPrice(a) - currentPrice(b),
  "price-desc": (a, b) => currentPrice(b) - currentPrice(a),
  popular: (a, b) => b.popularity - a.popularity,
};

export async function queryProducts(params = {}) {
  const {
    category,
    collection,
    search,
    exclude,
    minPrice,
    maxPrice,
    sort = "popular",
    page = 1,
    perPage = 12,
  } = params;
  const ids = toArray(params.ids).map(Number);
  const sizes = toArray(params.sizes);
  const colors = toArray(params.colors).map((c) => c.toLowerCase());

  let base = PRODUCTS;
  if (ids.length) base = base.filter((p) => ids.includes(p.id));
  if (category) base = base.filter((p) => matchCategory(p, category));
  if (collection && COLLECTIONS[collection])
    base = base.filter(COLLECTIONS[collection]);
  if (exclude) base = base.filter((p) => p.slug !== exclude);
  if (search && String(search).trim()) {
    const tokens = String(search).toLowerCase().split(/\s+/).filter(Boolean);
    base = base.filter((p) => {
      const hay =
        `${p.name} ${p.type} ${p.categories.join(" ")} ${p.tags.join(" ")}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }

  // Filter options shown in the UI, taken from the set before size/colour/price filters
  const prices = base.map(currentPrice);
  const colorMap = new Map();
  base.forEach((p) => p.colors.forEach((c) => colorMap.set(c.name, c)));
  const facets = {
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    sizes: [...new Set(base.flatMap((p) => p.sizes))].sort(
      (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b),
    ),
    colors: [...colorMap.values()],
  };

  let list = base.filter((p) => {
    const price = currentPrice(p);
    if (minPrice != null && minPrice !== "" && price < Number(minPrice))
      return false;
    if (maxPrice != null && maxPrice !== "" && price > Number(maxPrice))
      return false;
    if (sizes.length && !availableSizes(p).some((s) => sizes.includes(s)))
      return false;
    if (
      colors.length &&
      !p.colors.some((c) => colors.includes(c.name.toLowerCase()))
    )
      return false;
    return true;
  });
  list = [...list].sort(SORTS[sort] || SORTS.popular);

  const total = list.length;
  const per = Math.max(1, Number(perPage));
  const pg = Math.max(1, Number(page));
  const data = list.slice((pg - 1) * per, pg * per);
  return reply({
    data,
    meta: {
      total,
      page: pg,
      perPage: per,
      lastPage: Math.max(1, Math.ceil(total / per)),
      facets,
    },
  });
}

export async function findProduct(slug) {
  const p = PRODUCTS.find((x) => x.slug === slug);
  return p ? reply(p) : fail(404, "Product not found.");
}

export async function relatedProducts(slug, limit = 4) {
  const self = PRODUCTS.find((x) => x.slug === slug);
  if (!self) return fail(404, "Product not found.");
  const score = (p) =>
    p.categories.filter((c) => self.categories.includes(c)).length;
  const data = PRODUCTS.filter((p) => p.slug !== slug)
    .sort((a, b) => score(b) - score(a) || b.popularity - a.popularity)
    .slice(0, Number(limit));
  return reply(data);
}

export async function listCategories() {
  return reply(
    CATEGORIES.map((c) => ({
      ...c,
      productCount: PRODUCTS.filter((p) => matchCategory(p, c.slug)).length,
    })),
  );
}

export async function reviewsFor(slug) {
  const data = REVIEWS.filter((r) => r.productSlug === slug).sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  return reply(data);
}

/* ---------- Cart, delivery, payment ---------- */

export async function validateCart(items = []) {
  const result = items.map((it) => {
    const p = PRODUCTS.find((x) => x.id === it.productId);
    const v = p && findVariant(p, it.size, it.color);
    const base = {
      productId: it.productId,
      size: it.size,
      color: it.color,
      quantity: it.quantity,
    };
    if (!p || !v)
      return {
        ...base,
        available: false,
        maxQuantity: 0,
        unitPrice: 0,
        originalPrice: 0,
        issue: "This item is no longer available.",
      };
    return {
      ...base,
      unitPrice: currentPrice(p),
      originalPrice: p.price,
      maxQuantity: v.stock,
      available: v.stock > 0,
      issue:
        v.stock < 1
          ? "Out of stock"
          : it.quantity > v.stock
            ? `Only ${v.stock} left`
            : "",
    };
  });
  return reply({ items: result }, 250);
}

export async function quoteDelivery({ state, subtotal = 0 } = {}) {
  if (!findState(state))
    return fail(
      422,
      "Select a valid state.",
      { state: ["Select a valid state."] },
      200,
    );
  return reply(estimateDelivery(Number(subtotal), state), 250);
}

// Placeholder methods. The real list should come from Laravel.
const PAYMENT_METHODS = [
  {
    id: "paystack",
    label: "Card, bank transfer or USSD (Paystack)",
    description:
      "Online payment. Integration pending: the order is saved as unpaid for now.",
    enabled: true,
    integrationStatus: "pending",
  },
  {
    id: "bank-transfer",
    label: "Direct bank transfer",
    description: "Transfer to our account and we confirm your order manually.",
    enabled: true,
  },
  {
    id: "pay-on-delivery",
    label: "Pay on delivery",
    description: "Pay when your order arrives.",
    enabled: true,
  },
];
export const listPaymentMethods = () => reply(PAYMENT_METHODS, 200);

/* ---------- Orders ---------- */

const ORDERS_KEY = "tstar:mock-orders";

export async function createOrder(payload = {}) {
  const errors = {};
  const c = payload.customer || {};
  const d = payload.delivery || {};
  const blank = (v) => !String(v ?? "").trim();

  if (blank(c.firstName))
    errors["customer.firstName"] = ["First name is required."];
  if (blank(c.lastName))
    errors["customer.lastName"] = ["Last name is required."];
  if (!isEmail(c.email || ""))
    errors["customer.email"] = ["Enter a valid email address."];
  if (!isNgPhone(c.phone || ""))
    errors["customer.phone"] = ["Enter a valid Nigerian phone number."];
  if (blank(d.address))
    errors["delivery.address"] = ["Delivery address is required."];
  if (!findState(d.state)) errors["delivery.state"] = ["Select a valid state."];
  if (blank(d.city)) errors["delivery.city"] = ["Select a city."];
  if (!PAYMENT_METHODS.some((m) => m.id === payload.paymentMethod))
    errors.paymentMethod = ["Select a payment method."];

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length) errors.items = ["Your order has no items."];

  // Prices come from the server's own data, never from the client
  const lines = [];
  for (const it of items) {
    const p = PRODUCTS.find((x) => x.id === it.productId);
    const err = p
      ? selectionError(p, it.size, it.color, it.quantity)
      : "A product in your order is no longer available.";
    if (err) {
      errors.items = [...(errors.items || []), `${p?.name || "Item"}: ${err}`];
      continue;
    }
    lines.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      image: p.images[0]?.url || "",
      size: it.size,
      color: it.color,
      quantity: it.quantity,
      unitPrice: currentPrice(p),
      lineTotal: currentPrice(p) * it.quantity,
    });
  }
  if (Object.keys(errors).length)
    return fail(422, "Please fix the highlighted fields.", errors, 600);

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const delivery = estimateDelivery(subtotal, d.state);
  const order = {
    orderNumber: `TS-${Date.now().toString(36).toUpperCase()}`,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: payload.paymentMethod,
    customer: { ...c, email: c.email.trim().toLowerCase() },
    delivery: d,
    items: lines,
    subtotal,
    deliveryFee: delivery.fee,
    total: subtotal + delivery.fee,
    currency: "NGN",
    createdAt: new Date().toISOString(),
    // With real Paystack the backend returns authorizationUrl and the frontend redirects to it
    payment: {
      provider: payload.paymentMethod === "paystack" ? "paystack" : null,
      authorizationUrl: null,
    },
  };
  const orders = local.get(ORDERS_KEY, {});
  orders[order.orderNumber] = order;
  local.set(ORDERS_KEY, orders);
  return reply(order, 900);
}

export async function findOrder(orderNumber) {
  const order = local.get(ORDERS_KEY, {})[orderNumber];
  return order ? reply(order) : fail(404, "Order not found.");
}

/* ---------- Auth (demo only: demo@tstar.example / Password123) ---------- */

const USERS_KEY = "tstar:mock-users";

async function hashPw(pw) {
  try {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(pw),
    );
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return btoa(pw); // crypto.subtle needs HTTPS or localhost
  }
}

async function loadUsers() {
  let users = local.get(USERS_KEY);
  if (!users) {
    users = [
      {
        id: 1,
        name: "Demo Customer",
        email: "demo@tstar.example",
        phone: "",
        passwordHash: await hashPw("Password123"),
      },
    ];
    local.set(USERS_KEY, users);
  }
  return users;
}
const publicUser = ({ passwordHash, ...u }) => u;

export async function login({ email = "", password = "" } = {}) {
  const users = await loadUsers();
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || user.passwordHash !== (await hashPw(password))) {
    return fail(422, "These credentials do not match our records.", {
      email: ["These credentials do not match our records."],
    });
  }
  return reply({ user: publicUser(user), token: `mock.${user.id}` });
}

export async function register({
  name = "",
  email = "",
  phone = "",
  password = "",
} = {}) {
  const errors = {};
  if (!name.trim()) errors.name = ["Name is required."];
  if (!isEmail(email)) errors.email = ["Enter a valid email address."];
  if (phone && !isNgPhone(phone))
    errors.phone = ["Enter a valid Nigerian phone number."];
  if (password.length < 8)
    errors.password = ["Password must be at least 8 characters."];
  const users = await loadUsers();
  if (
    !errors.email &&
    users.some((u) => u.email === email.trim().toLowerCase())
  )
    errors.email = ["This email is already registered."];
  if (Object.keys(errors).length)
    return fail(422, "Please fix the highlighted fields.", errors);

  const user = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    passwordHash: await hashPw(password),
  };
  local.set(USERS_KEY, [...users, user]);
  return reply({ user: publicUser(user), token: `mock.${user.id}` });
}

export async function me(token) {
  const id = Number(String(token || "").split(".")[1]);
  const user = (await loadUsers()).find((u) => u.id === id);
  return user
    ? reply(publicUser(user), 200)
    : fail(401, "Unauthenticated.", {}, 200);
}

/* ---------- Newsletter and contact (nothing is actually sent) ---------- */

export async function subscribe(email = "") {
  if (!isEmail(email))
    return fail(422, "Enter a valid email address.", {
      email: ["Enter a valid email address."],
    });
  const list = local.get("tstar:mock-newsletter", []);
  const e = email.trim().toLowerCase();
  if (!list.includes(e)) local.set("tstar:mock-newsletter", [...list, e]);
  return reply({ message: "Subscribed." });
}

export async function sendContact({
  name = "",
  email = "",
  message = "",
} = {}) {
  const errors = {};
  if (!name.trim()) errors.name = ["Name is required."];
  if (!isEmail(email)) errors.email = ["Enter a valid email address."];
  if (message.trim().length < 10)
    errors.message = ["Message must be at least 10 characters."];
  if (Object.keys(errors).length)
    return fail(422, "Please fix the highlighted fields.", errors);
  return reply({ message: "Message received." }, 700);
}
