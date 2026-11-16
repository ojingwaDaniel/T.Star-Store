<script setup>
const ITEMS = [
  "Wear the difference",
  "Premium streetwear",
  "Sportswear",
  "Made to stand out",
];
</script>

<template>
  <!-- decorative: the same message appears elsewhere in real text -->
  <div class="overflow-hidden bg-gold py-3.5 text-ink" aria-hidden="true">
    <div class="marquee-track flex w-max">
      <div
        v-for="g in 2"
        :key="g"
        class="flex shrink-0 items-center gap-10 pr-10"
      >
        <template v-for="t in ITEMS" :key="t + g">
          <span
            class="whitespace-nowrap font-display text-2xl font-bold italic uppercase leading-none"
            >{{ t }}</span
          >
          <span class="text-lg leading-none">★</span>
        </template>
      </div>
    </div>
  </div>
</template>
