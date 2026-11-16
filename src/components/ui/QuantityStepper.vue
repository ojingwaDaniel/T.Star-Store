<script setup>
import { Minus, Plus } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
  size: { type: String, default: 'md' }, // sm | md
  label: { type: String, default: 'Quantity' },
})
const emit = defineEmits(['update:modelValue', 'limit'])

function change(d) {
  const n = props.modelValue + d
  if (n < props.min) return
  if (n > props.max) { emit('limit'); return }
  emit('update:modelValue', n)
}
</script>

<template>
  <div role="group" :aria-label="label" class="inline-flex items-stretch border border-line bg-white" :class="size === 'sm' ? 'h-9' : 'h-12'">
    <button
      type="button" aria-label="Decrease quantity" :disabled="modelValue <= min"
      class="grid w-9 place-items-center transition-colors hover:bg-bone disabled:opacity-35" :class="size === 'md' && 'w-11'"
      @click="change(-1)"
    ><Minus :size="14" /></button>
    <output class="grid min-w-[2.25rem] place-items-center px-1 text-[14px] font-semibold tabular-nums" aria-live="polite">{{ modelValue }}</output>
    <button
      type="button" aria-label="Increase quantity"
      class="grid w-9 place-items-center transition-colors hover:bg-bone" :class="size === 'md' && 'w-11'"
      @click="change(1)"
    ><Plus :size="14" /></button>
  </div>
</template>