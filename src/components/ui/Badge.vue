<script setup>
defineProps({ variant: { type: String, default: 'new' } }) // new | best | sale | out
const styles = {
  new: 'bg-ink text-bone',
  best: 'bg-gold text-ink',
  sale: 'bg-sale text-white',
  out: 'bg-white text-graphite border border-line',
}
</script>

<template>
  <span :class="['skew-brand inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-label', styles[variant]]">
    <span class="unskew-brand inline-block"><slot /></span>
  </span>
</template>