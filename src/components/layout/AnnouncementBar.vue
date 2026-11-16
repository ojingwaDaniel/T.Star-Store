<script setup>
import { SITE } from "@/config/site";
import { formatNaira } from "@/utils/currency";
</script>

<template>
  <div class="bg-ink text-bone">
    <p
      class="shell py-2.5 text-center text-[11px] font-semibold uppercase tracking-label"
    >
      Free delivery over {{ formatNaira(SITE.freeDeliveryThreshold) }}
      <span class="mx-3 text-gold" aria-hidden="true">★</span>
      <span class="hidden sm:inline">Wear the difference</span>
    </p>
  </div>
</template>
