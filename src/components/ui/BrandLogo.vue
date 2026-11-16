<script setup>
import { ref } from 'vue'
defineProps({ inverted: Boolean })
const failed = ref(false)
</script>

<template>
  <!-- Falls back to text if the logo file is missing, so the header never breaks -->
  <span v-if="failed" class="inline-block font-display text-2xl font-extrabold italic uppercase tracking-tight">T.STAR</span>
  <img
    v-else src="/logo/tstar-logo.png" alt="T.STAR" decoding="async"
    :class="['w-auto select-none', inverted && 'invert']"
    @error="failed = true"
  />
</template>