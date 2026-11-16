<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { COLLECTION_LABELS } from '@/config/shop'
import { formatNaira } from '@/utils/currency'

const props = defineProps({ filters: { type: Object, required: true } })
const emit = defineEmits(['update', 'clear'])

const chips = computed(() => {
  const f = props.filters
  const out = []
  if (f.search) out.push({ key: 'search', label: `“${f.search}”`, patch: { search: '' } })
  if (f.collection) out.push({ key: 'collection', label: COLLECTION_LABELS[f.collection], patch: { collection: '' } })
  f.sizes.forEach((s) => out.push({ key: `size-${s}`, label: `Size ${s}`, patch: { sizes: f.sizes.filter((x) => x !== s) } }))
  f.colors.forEach((c) => out.push({ key: `color-${c}`, label: c, patch: { colors: f.colors.filter((x) => x !== c) } }))
  if (f.minPrice != null || f.maxPrice != null) {
    const label = f.minPrice != null && f.maxPrice != null
      ? `${formatNaira(f.minPrice)} – ${formatNaira(f.maxPrice)}`
      : f.minPrice != null ? `From ${formatNaira(f.minPrice)}` : `Up to ${formatNaira(f.maxPrice)}`
    out.push({ key: 'price', label, patch: { minPrice: null, maxPrice: null } })
  }
  return out
})
</script>

<template>
  <ul v-if="chips.length" class="flex flex-wrap items-center gap-2" aria-label="Active filters">
    <li v-for="c in chips" :key="c.key">
      <button
        type="button" class="inline-flex items-center gap-2 border border-ink bg-white px-3 py-1.5 text-[12px] font-semibold transition-colors hover:bg-ink hover:text-bone"
        :aria-label="`Remove filter: ${c.label}`" @click="emit('update', c.patch)"
      >{{ c.label }} <X :size="13" /></button>
    </li>
    <li><button type="button" class="px-2 text-[12px] underline underline-offset-4 hover:text-gold-dark" @click="emit('clear')">Clear all</button></li>
  </ul>
</template>