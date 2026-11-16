<script setup>
import { useRoute, useRouter } from "vue-router";
import { Search } from "lucide-vue-next";
import Drawer from "@/components/ui/Drawer.vue";
import BrandLogo from "@/components/ui/BrandLogo.vue";
import { NAV_LINKS, isNavActive } from "@/config/nav";
import { SITE } from "@/config/site";
import { useUiStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";
import { useWishlistStore } from "@/stores/wishlist";
import { useToast } from "@/composables/useToast";

const ui = useUiStore();
const auth = useAuthStore();
const wishlist = useWishlistStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

function openSearch() {
  ui.closeMenu();
  setTimeout(() => ui.openSearch(), 250);
}
async function signOut() {
  ui.closeMenu();
  await auth.logout();
  toast.info("You have been signed out.");
  router.push("/");
}
</script>

<template>
  <Drawer
    :open="ui.mobileMenuOpen"
    side="left"
    label="Menu"
    dark
    panel-class="max-w-[26rem] bg-ink text-bone"
    @close="ui.closeMenu()"
  >
    <template #header>
      <BrandLogo inverted class="h-8" />
    </template>

    <div class="flex-1 overflow-y-auto px-5 py-8">
      <button
        type="button"
        class="mb-8 flex w-full items-center gap-3 border border-line-dark px-4 py-3.5 text-left text-[14px] text-bone/70"
        @click="openSearch"
      >
        <Search :size="18" /> Search products
      </button>

      <nav aria-label="Mobile">
        <ul>
          <li
            v-for="(l, i) in NAV_LINKS"
            :key="l.label"
            class="menu-in overflow-hidden"
            :style="{ animationDelay: `${120 + i * 55}ms` }"
          >
            <RouterLink v-slot="{ href, navigate }" :to="l.to" custom>
              <a
                :href="href"
                :aria-current="isNavActive(route, l) ? 'page' : undefined"
                class="block py-2 font-display text-[44px] font-extrabold italic uppercase leading-none transition-colors hover:text-gold"
                :class="[
                  l.accent ? 'text-gold' : '',
                  isNavActive(route, l) ? 'text-gold' : '',
                ]"
                @click="navigate"
                >{{ l.label }}</a
              >
            </RouterLink>
          </li>
        </ul>
      </nav>

      <ul class="mt-10 space-y-1 border-t border-line-dark pt-6 text-[14px]">
        <li>
          <RouterLink
            to="/wishlist"
            class="flex items-center justify-between py-2.5 text-bone/80 hover:text-gold"
            >Wishlist
            <span v-if="wishlist.count" class="text-gold">{{
              wishlist.count
            }}</span></RouterLink
          >
        </li>
        <li v-if="!auth.isAuthenticated">
          <RouterLink
            to="/login"
            class="block py-2.5 text-bone/80 hover:text-gold"
            >Sign in</RouterLink
          >
        </li>
        <li v-if="!auth.isAuthenticated">
          <RouterLink
            to="/register"
            class="block py-2.5 text-bone/80 hover:text-gold"
            >Create account</RouterLink
          >
        </li>
        <li v-if="auth.isAuthenticated">
          <button
            type="button"
            class="block w-full py-2.5 text-left text-bone/80 hover:text-gold"
            @click="signOut"
          >
            Sign out ({{ auth.user.name }})
          </button>
        </li>
        <li>
          <RouterLink
            to="/about"
            class="block py-2.5 text-bone/80 hover:text-gold"
            >About</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/contact"
            class="block py-2.5 text-bone/80 hover:text-gold"
            >Contact</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/shipping-returns"
            class="block py-2.5 text-bone/80 hover:text-gold"
            >Shipping &amp; Returns</RouterLink
          >
        </li>
      </ul>
    </div>

    <p
      class="shrink-0 border-t border-line-dark px-5 py-5 text-[12px] uppercase tracking-label text-bone/50"
    >
      {{ SITE.motto }}
    </p>
  </Drawer>
</template>
