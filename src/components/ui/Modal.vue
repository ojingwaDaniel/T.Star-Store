<script setup>
import { ref, toRef } from 'vue'
import { X } from 'lucide-vue-next'
import { useScrollLock } from '@/composables/useScrollLock'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useModalStack } from '@/composables/useModalStack'

const props = defineProps({
  open: Boolean,
  label: { type: String, required: true }, // accessible name
  size: { type: String, default: 'md' },   // sm | md | lg | xl
  z: { type: String, default: 'z-[80]' },
})
const emit = defineEmits(['close'])

const panel = ref(null)
const open = toRef(props, 'open')
useScrollLock(open)
useFocusTrap(panel, open)
useModalStack(open, () => emit('close'))

const WIDTH = { sm: 'sm:max-w-md', md: 'sm:max-w-2xl', lg: 'sm:max-w-3xl', xl: 'sm:max-w-5xl' }
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6" :class="z">
        <div class="absolute inset-0 bg-ink/65 backdrop-blur-[2px]" aria-hidden="true" @click="emit('close')" />
        <div
          ref="panel" role="dialog" aria-modal="true" :aria-label="label" tabindex="-1"
          class="modal-panel relative flex max-h-[92dvh] w-full flex-col bg-bone shadow-lift focus:outline-none sm:max-h-[90vh]"
          :class="WIDTH[size]"
        >
          <button
            type="button" aria-label="Close"
            class="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center bg-bone/90 text-ink transition-colors hover:bg-white hover:text-gold-dark"
            @click="emit('close')"
          ><X :size="20" /></button>
          <div class="overflow-y-auto overscroll-contain"><slot /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>