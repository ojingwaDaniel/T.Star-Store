<script setup>
defineProps({ class: { type: String, default: '' } })
</script>
<template>
  <div :class="['animate-pulse bg-line', $props.class]" aria-hidden="true" />
</template>