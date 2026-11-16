<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import StarIcon from '@/components/ui/StarIcon.vue'
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <aside class="relative hidden overflow-hidden bg-ink text-bone lg:flex lg:flex-col lg:justify-between lg:p-12">
      <StarIcon :size="760" :filled="false" :stroke-width="0.35" class="pointer-events-none absolute -bottom-32 -right-40 text-bone/[0.07]" />
      <RouterLink to="/" aria-label="T.STAR home"><BrandLogo inverted class="h-10" /></RouterLink>
      <p class="relative font-display text-8xl font-extrabold italic uppercase leading-[.88]">
        Wear the <span class="text-gold">difference.</span>
      </p>
      <p class="relative text-sm text-bone/60">Sign in to save your wishlist and check out faster.</p>
    </aside>

    <div class="flex flex-col">
      <div class="flex items-center justify-between px-5 py-5 md:px-10">
        <RouterLink to="/" class="label inline-flex items-center gap-2 hover:text-ink"><ArrowLeft :size="16" /> Back to store</RouterLink>
        <RouterLink to="/" class="lg:hidden" aria-label="T.STAR home"><BrandLogo class="h-8" /></RouterLink>
      </div>
      <main id="main" class="flex flex-1 items-center justify-center px-5 pb-16 md:px-10">
        <div class="w-full max-w-md"><slot /></div>
      </main>
    </div>
  </div>
</template>