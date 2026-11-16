<script setup>
import { ArrowRight } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import AppImage from "@/components/ui/AppImage.vue";
import { IMAGES } from "@/mock/images";
</script>

<template>
  <section
    class="edge-slant-both relative isolate overflow-hidden bg-ink py-28 text-bone md:py-44"
    aria-labelledby="promo-title"
  >
    <div class="absolute inset-0 -z-10">
      <AppImage
        :src="IMAGES.promoBanner"
        alt=""
        ratio="auto"
        class="h-full"
        fallback-class="bg-[#121212] text-gold/30"
      />
      <div
        class="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent"
      />
    </div>

    <span
      aria-hidden="true"
      class="text-outline pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(8rem,28vw,24rem)] font-extrabold italic leading-none [--outline:rgba(244,241,236,.16)]"
      >SALE</span
    >

    <div class="shell relative">
      <div v-reveal class="max-w-xl">
        <p class="label text-gold-light">Limited stock</p>
        <h2 id="promo-title" class="mt-4 text-6xl italic md:text-8xl">
          The sale edit
        </h2>
        <p class="mt-5 max-w-sm text-[17px] leading-relaxed text-bone/75">
          Selected pieces, reduced. When a size is gone, it's gone.
        </p>
        <div class="mt-8">
          <BaseButton
            :to="{ path: '/shop', query: { collection: 'sale' } }"
            variant="gold"
            size="lg"
            >Shop the sale <ArrowRight :size="18"
          /></BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
