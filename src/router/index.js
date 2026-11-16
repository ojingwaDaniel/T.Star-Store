import { createRouter, createWebHistory } from "vue-router";
import { SITE } from "@/config/site";

const lazy = (name) => () => import(`../views/${name}.vue`);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: {
      title: "Wear The Difference",
      description: "Premium streetwear and sportswear for men and women.",
    },
  },
  {
    path: "/shop",
    name: "shop",
    component: () => import("../views/ShopView.vue"),
    meta: {
      title: "Shop",
      description: "Browse the full T.STAR collection.",
      viewKey: "shop",
    },
  },
  {
    path: "/shop/:category",
    name: "shop-category",
    component: () => import("../views/ShopView.vue"),
    meta: { title: "Shop", viewKey: "shop" },
  },
  {
    path: "/product/:slug",
    name: "product",
    component: () => import("../views/ProductView.vue"),
    meta: { title: "Product" },
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("../views/CartView.vue"),
    meta: { title: "Your Cart" },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("../views/CheckoutView.vue"),
    meta: { title: "Checkout", layout: "checkout" },
  },
  {
    path: "/order-confirmation/:orderNumber",
    name: "order-confirmation",
    component: () => import("../views/OrderConfirmationView.vue"),
    meta: { title: "Order Confirmed", layout: "checkout" },
  },
  {
    path: "/wishlist",
    name: "wishlist",
    component: () => import("../views/WishlistView.vue"),
    meta: { title: "Wishlist" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: { title: "Sign In", layout: "auth" },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
    meta: { title: "Create Account", layout: "auth" },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
    meta: { title: "About Us", description: "The story behind T.STAR." },
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/ContactView.vue"),
    meta: { title: "Contact" },
  },
  {
    path: "/privacy",
    name: "privacy",
    component: () => import("../views/PolicyView.vue"),
    props: { page: "privacy" },
    meta: { title: "Privacy Policy" },
  },
  {
    path: "/terms",
    name: "terms",
    component: () => import("../views/PolicyView.vue"),
    props: { page: "terms" },
    meta: { title: "Terms & Conditions" },
  },
  {
    path: "/shipping-returns",
    name: "shipping",
    component: () => import("../views/PolicyView.vue"),
    props: { page: "shipping" },
    meta: { title: "Shipping & Returns" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
    meta: { title: "Page Not Found" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, behavior: "smooth", top: 90 };
    // keep scroll position when only a query (filters) changes
    if (to.path === from.path) return false;
    return { top: 0 };
  },
});

function setMeta(name, content, attr = "name") {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

router.afterEach((to, from) => {
  if (from.name && to.path === from.path) return;
  const title = to.meta.title
    ? `${to.meta.title} | ${SITE.name}`
    : `${SITE.name} | Wear The Difference`;
  document.title = title;
  const desc =
    to.meta.description ||
    "Premium streetwear and sportswear. Wear the difference.";
  setMeta("description", desc);
  setMeta("og:title", title, "property");
  setMeta("og:description", desc, "property");
});

export default router;
