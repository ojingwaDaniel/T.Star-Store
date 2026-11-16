<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import BrandLogo from "@/components/ui/BrandLogo.vue";

const route = useRoute();
const onCheckout = computed(() => route.name === "checkout");
const buyNow = computed(() => route.query.mode === "buy-now");
const back = computed(() =>
  onCheckout.value && !buyNow.value
    ? { to: { name: "cart" }, label: "Back to cart" }
    : { to: { name: "shop" }, label: "Continue shopping" },
);
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-line bg-bone">
      <div class="shell grid h-16 grid-cols-3 items-center lg:h-20">
        <RouterLink
          :to="back.to"
          class="label inline-flex items-center gap-2 justify-self-start hover:text-ink"
        >
          <ArrowLeft :size="16" />
          <span class="hidden sm:inline">{{ back.label }}</span>
        </RouterLink>
        <RouterLink to="/" class="justify-self-center" aria-label="T.STAR home"
          ><BrandLogo class="h-8 lg:h-10"
        /></RouterLink>
        <RouterLink to="/contact" class="label justify-self-end hover:text-ink"
          >Help</RouterLink
        >
      </div>
    </header>

    <main id="main" tabindex="-1" class="flex-1 focus:outline-none">
      <slot />
    </main>

    <footer class="border-t border-line py-6">
      <div
        class="shell flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-graphite"
      >
        <RouterLink to="/shipping-returns" class="hover:text-ink"
          >Shipping &amp; Returns</RouterLink
        >
        <RouterLink to="/terms" class="hover:text-ink">Terms</RouterLink>
        <RouterLink to="/privacy" class="hover:text-ink">Privacy</RouterLink>
      </div>
    </footer>
  </div>
</template>
