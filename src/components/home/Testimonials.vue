<script setup>
import StarIcon from '@/components/ui/StarIcon.vue'
import { TESTIMONIALS } from '@/mock/testimonials'
</script>

<template>
  <section class="bg-ink section-y text-bone" aria-labelledby="testimonials-title">
    <div class="shell">
      <div v-reveal class="mb-10 md:mb-14">
        <p class="label text-gold-light">Customers</p>
        <h2 id="testimonials-title" class="mt-3 text-5xl md:text-7xl">What they say</h2>
      </div>

      <ul class="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
        <li v-for="(t, i) in TESTIMONIALS" :key="t.id" v-reveal="{ delay: i * 120 }" class="w-[84%] shrink-0 snap-start border border-line-dark p-7 sm:w-[60%] md:w-auto md:p-9">
          <figure class="flex h-full flex-col">
            <div class="flex gap-1 text-gold" role="img" :aria-label="`${t.rating} out of 5 stars`">
              <StarIcon v-for="n in t.rating" :key="n" :size="16" />
            </div>
            <blockquote class="mt-6 flex-1 text-[18px] leading-relaxed text-bone/90">“{{ t.text }}”</blockquote>
            <figcaption class="mt-8 border-t border-line-dark pt-5">
              <p class="font-display text-xl font-bold uppercase">{{ t.name }}</p>
              <p class="mt-1 text-[13px] text-bone/60">{{ t.city }}</p>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>
</template>