<script setup>
import { ArrowRight } from "lucide-vue-next";
import AppImage from "@/components/ui/AppImage.vue";
import { IMAGES } from "@/mock/images";

const TILES = [
  { cls: "md:col-span-5", ratio: "4/5" },
  { cls: "md:col-span-7 md:mt-24", ratio: "4/3" },
  { cls: "md:col-span-4", ratio: "4/5" },
  { cls: "md:col-span-8 md:mt-16", ratio: "16/10" },
];
</script>

<template>
  <section class="section-y" aria-labelledby="lookbook-title">
    <div class="shell">
      <div v-reveal class="mb-10 flex items-end justify-between gap-6 md:mb-14">
        <div>
          <p class="label-gold">Lifestyle</p>
          <h2 id="lookbook-title" class="mt-3 text-5xl md:text-7xl">
            The lookbook
          </h2>
        </div>
        <RouterLink
          to="/shop"
          class="streak hidden items-center gap-2 pb-1 text-[12px] font-semibold uppercase tracking-label sm:inline-flex"
        >
          Shop the looks <ArrowRight :size="16" />
        </RouterLink>
      </div>

      <div class="grid gap-5 md:grid-cols-12 md:items-start md:gap-6">
        <figure
          v-for="(t, i) in TILES"
          :key="i"
          v-reveal="{ delay: (i % 2) * 120 }"
          class="group overflow-hidden"
          :class="t.cls"
        >
          <div class="overflow-hidden">
            <div
              class="transition-transform duration-[1400ms] ease-brand group-hover:scale-[1.04]"
            >
              <AppImage
                :src="IMAGES.lookbook[i]"
                :alt="`T.STAR lookbook, look ${i + 1}`"
                :ratio="t.ratio"
                sizes="(min-width:768px) 50vw, 100vw"
              />
            </div>
          </div>
          <figcaption class="label mt-3">
            Look {{ String(i + 1).padStart(2, "0") }}
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
