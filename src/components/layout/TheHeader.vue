<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { Search, ShoppingBag, Menu } from "lucide-vue-next";
import BrandLogo from "@/components/ui/BrandLogo.vue";
import StarIcon from "@/components/ui/StarIcon.vue";
import AccountMenu from "./AccountMenu.vue";
import { NAV_LINKS, isNavActive } from "@/config/nav";
import { useUiStore } from "@/stores/ui";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";

const ui = useUiStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const route = useRoute();

// Hide on scroll down, show on scroll up
const hidden = ref(false);
let lastY = 0;
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    if (y > 240 && y > lastY + 4) hidden.value = true;
    else if (y < lastY - 4 || y <= 240) hidden.value = false;
    lastY = y;
    ticking = false;
  });
}
onMounted(() => {
  lastY = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

// Cart badge bump when something is added
const bump = ref(false);
let bumpTimer;
watch(
  () => cart.count,
  (n, o) => {
    if (n > o) {
      bump.value = true;
      clearTimeout(bumpTimer);
      bumpTimer = setTimeout(() => {
        bump.value = false;
      }, 500);
    }
  },
);
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur-md transition-transform duration-500 ease-brand"
    :class="hidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <div class="shell flex h-[4.5rem] items-center lg:h-24">
      <div class="order-1 flex flex-1 basis-0 items-center lg:hidden">
        <button
          type="button"
          class="icon-btn -ml-2.5"
          aria-label="Open menu"
          aria-haspopup="dialog"
          @click="ui.openMenu()"
        >
          <Menu :size="22" />
        </button>
      </div>

      <RouterLink
        to="/"
        class="order-2 shrink-0 lg:order-1 lg:mr-10"
        aria-label="T.STAR home"
      >
        <BrandLogo class="h-10 lg:h-14" />
      </RouterLink>

      <nav
        aria-label="Primary"
        class="order-3 hidden lg:order-2 lg:flex lg:flex-1 lg:justify-center lg:gap-7 xl:gap-9"
      >
        <RouterLink
          v-for="l in NAV_LINKS"
          :key="l.label"
          v-slot="{ href, navigate }"
          :to="l.to"
          custom
        >
          <a
            :href="href"
            class="streak py-2 text-[12px] font-semibold uppercase tracking-label"
            :class="l.accent ? 'text-gold-dark' : 'text-ink'"
            :aria-current="isNavActive(route, l) ? 'page' : undefined"
            @click="navigate"
            >{{ l.label }}</a
          >
        </RouterLink>
      </nav>

      <div
        class="order-4 flex flex-1 basis-0 items-center justify-end lg:flex-none"
      >
        <button
          type="button"
          class="icon-btn"
          aria-label="Search products"
          aria-haspopup="dialog"
          @click="ui.openSearch()"
        >
          <Search :size="20" />
        </button>

        <AccountMenu />

        <RouterLink
          :to="{ name: 'wishlist' }"
          class="icon-btn hidden sm:grid"
          :aria-label="`Wishlist, ${wishlist.count} saved`"
        >
          <StarIcon :size="20" :filled="false" />
          <span
            v-if="wishlist.count"
            class="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center bg-ink px-1 text-[10px] font-bold text-bone"
            aria-hidden="true"
            >{{ wishlist.count }}</span
          >
        </RouterLink>

        <button
          type="button"
          class="icon-btn -mr-2.5 lg:mr-0"
          :aria-label="`Open cart, ${cart.count} items`"
          aria-haspopup="dialog"
          @click="ui.openCart()"
        >
          <ShoppingBag :size="20" />
          <span
            v-if="cart.count"
            class="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center bg-gold px-1 text-[10px] font-bold text-ink"
            :class="bump && 'animate-bump'"
            aria-hidden="true"
            >{{ cart.count }}</span
          >
        </button>
      </div>
    </div>
  </header>
</template>
