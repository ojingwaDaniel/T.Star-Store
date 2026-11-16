<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import CheckoutLayout from '@/layouts/CheckoutLayout.vue'
import ToastHost from '@/components/ui/ToastHost.vue'

const route = useRoute()
const layouts = { main: MainLayout, auth: AuthLayout, checkout: CheckoutLayout }
const layout = computed(() => layouts[route.meta.layout] || MainLayout)
</script>

<template>
  <component :is="layout">
    <RouterView v-slot="{ Component, route: r }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="r.meta.viewKey || r.path" />
      </Transition>
    </RouterView>
  </component>
  <ToastHost />
</template>