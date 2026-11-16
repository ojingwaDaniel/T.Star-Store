<script setup>
import StarIcon from './StarIcon.vue'
defineProps({
  rating: { type: Number, default: 0 },
  size: { type: Number, default: 16 },
})
</script>

<template>
  <span class="inline-flex gap-0.5 text-gold" role="img" :aria-label="`Rated ${rating.toFixed(1)} out of 5`">
    <StarIcon v-for="n in 5" :key="n" :size="size" :filled="n <= Math.round(rating)" :class="n > Math.round(rating) && 'opacity-40'" />
  </span>
</template>