<script setup>
import { formatNaira } from '@/utils/currency'
import { currentPrice, isOnSale, discountPercent } from '@/utils/product'

defineProps({
  product: { type: Object, required: true },
  size: { type: String, default: 'md' }, // md | lg
})
</script>

<template>
  <p class="flex flex-wrap items-baseline gap-x-3">
    <span class="sr-only">Price:</span>
    <span class="font-semibold" :class="[size === 'lg' ? 'text-3xl' : 'text-xl', isOnSale(product) && 'text-sale']">{{ formatNaira(currentPrice(product)) }}</span>
    <template v-if="isOnSale(product)">
      <span class="sr-only">Original price:</span>
      <s class="text-graphite" :class="size === 'lg' ? 'text-lg' : 'text-[15px]'">{{ formatNaira(product.price) }}</s>
      <span class="text-[13px] font-semibold text-sale">Save {{ discountPercent(product) }}%</span>
    </template>
  </p>
</template>