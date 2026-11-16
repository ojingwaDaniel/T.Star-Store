<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import AnnouncementBar from "@/components/layout/AnnouncementBar.vue";
import TheHeader from "@/components/layout/TheHeader.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
import MobileMenu from "@/components/layout/MobileMenu.vue";
import CartDrawer from "@/components/layout/CartDrawer.vue";
import SearchOverlay from "@/components/layout/SearchOverlay.vue";
import { useUiStore } from "@/stores/ui";
import QuickViewModal from '@/components/product/QuickViewModal.vue'

const ui = useUiStore();
const route = useRoute();

// Any navigation closes every overlay
watch(
  () => route.fullPath,
  () => {
    ui.closeCart();
    ui.closeMenu();
    ui.closeSearch();
    ui.closeQuickView();
  },
);
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-3 focus:text-bone"
    >Skip to content</a
  >
  <AnnouncementBar />
  <TheHeader />
  <main id="main" tabindex="-1" class="focus:outline-none">
    <slot />
  </main>
  <TheFooter />
  <MobileMenu />
  <CartDrawer />
  <SearchOverlay />
  <QuickViewModal />
</template>
