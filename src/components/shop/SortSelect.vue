<script setup>
import { useId } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { SORT_OPTIONS } from '@/config/shop'

defineProps({ modelValue: { type: String, default: 'popular' } })
defineEmits(['update:modelValue'])
const id = useId()
</script>

<template>
  <div class="flex items-center gap-3">
    <label :for="id" class="label hidden text-ink sm:block">Sort by</label>
    <div class="relative">
      <select
        :id="id" :value="modelValue" aria-label="Sort products"
        class="h-11 appearance-none border border-line bg-white pl-4 pr-10 text-[14px] hover:border-ink/40 focus:border-ink focus:outline-none"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-for="o in SORT_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
      <ChevronDown :size="16" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
    </div>
  </div>
</template>