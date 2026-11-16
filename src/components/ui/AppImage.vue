<script setup>
import { ref, watch } from 'vue'
import StarIcon from './StarIcon.vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, required: true },
  ratio: { type: String, default: '4/5' }, // CSS aspect-ratio value, or 'auto'
  eager: Boolean,                         // true for above-the-fold images
  sizes: { type: String, default: '(min-width:1024px) 33vw, 50vw' },
  srcset: { type: String, default: '' },
  fit: { type: String, default: 'cover' },
  position: { type: String, default: 'center' },
  fallbackClass: { type: String, default: 'bg-ink text-gold' },
})

const loaded = ref(false)
const failed = ref(!props.src)
watch(() => props.src, (v) => { loaded.value = false; failed.value = !v })
</script>

<template>
  <div class="relative overflow-hidden bg-line" :style="{ aspectRatio: ratio }">
    <div v-if="!loaded && !failed" class="absolute inset-0 animate-pulse bg-gradient-to-br from-line to-bone" aria-hidden="true" />

    <img
      v-if="!failed"
      :src="src" :srcset="srcset || undefined" :sizes="srcset ? sizes : undefined"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
      class="absolute inset-0 h-full w-full transition-opacity duration-700"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      :style="{ objectFit: fit, objectPosition: position }"
      @load="loaded = true"
      @error="failed = true"
    />

    <!-- branded fallback when no image is set or it fails to load -->
    <div v-else class="absolute inset-0 grid place-items-center" :class="fallbackClass" role="img" :aria-label="alt">
      <StarIcon :size="44" :filled="false" />
    </div>
  </div>
</template>