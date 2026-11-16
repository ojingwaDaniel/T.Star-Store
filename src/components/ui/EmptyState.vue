<script setup>
import StarIcon from './StarIcon.vue'
import BaseButton from './BaseButton.vue'

defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  actionTo: { type: [String, Object], default: null },
})
defineEmits(['action'])
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
    <StarIcon :size="42" :filled="false" class="mb-6 text-gold" />
    <h2 class="text-3xl">{{ title }}</h2>
    <p v-if="text" class="mt-3 text-graphite">{{ text }}</p>
    <BaseButton v-if="actionLabel" class="mt-8" :to="actionTo" @click="$emit('action')">
      {{ actionLabel }}
    </BaseButton>
  </div>
</template>