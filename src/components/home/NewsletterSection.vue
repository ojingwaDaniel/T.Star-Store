<script setup>
import NewsletterForm from './NewsletterForm.vue'
</script>

<template>
  <section class="section-y border-t border-line" aria-labelledby="newsletter-title">
    <div v-reveal class="shell mx-auto max-w-xl text-center">
      <p class="label-gold">Stay in the loop</p>
      <h2 id="newsletter-title" class="mt-3 text-5xl md:text-7xl">Join the difference</h2>
      <p class="mx-auto mt-5 max-w-md text-graphite">First access to new pieces and offers, straight to your inbox.</p>
      <div class="mt-9 text-left"><NewsletterForm /></div>
    </div>
  </section>
</template>