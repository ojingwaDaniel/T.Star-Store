<script setup>
defineProps({
  size: { type: [Number, String], default: 20 },
  filled: { type: Boolean, default: true },
  strokeWidth: { type: Number, default: 2 },
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linejoin="miter"
    aria-hidden="true"
    focusable="false"
  >
    <polygon
      points="12.6,1.5 14.2,9.4 22.5,9.4 15.6,14.2 17.4,22.5 9.8,18.2 3.2,12.4 8.4,9.2"
    />
  </svg>
</template>
