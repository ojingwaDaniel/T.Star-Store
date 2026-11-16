<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import MarqueeStrip from '@/components/home/MarqueeStrip.vue'
import CollectionsRail from '@/components/home/CollectionsRail.vue'
import ProductShelf from '@/components/home/ProductShelf.vue'
import PromoBanner from '@/components/home/PromoBanner.vue'
import BrandStory from '@/components/home/BrandStory.vue'
import EditorialGrid from '@/components/home/EditorialGrid.vue'
import Testimonials from '@/components/home/Testimonials.vue'
import NewsletterSection from '@/components/home/NewsletterSection.vue'
</script>

<template>
  <HeroSection />
  <MarqueeStrip />
  <CollectionsRail />

  <ProductShelf
    title="New arrivals" label="Just dropped" collection="new-arrivals" sort="newest" tone="white"
    :view-all-to="{ path: '/shop', query: { collection: 'new-arrivals' } }"
  />

  <PromoBanner />

  <ProductShelf
    title="Best sellers" label="Customer favourites" collection="best-sellers"
    :view-all-to="{ path: '/shop', query: { collection: 'best-sellers' } }"
  />

  <BrandStory />
  <EditorialGrid />

  <ProductShelf
    title="Trending now" label="What everyone's wearing" collection="trending" tone="white"
    :view-all-to="{ path: '/shop', query: { collection: 'trending' } }"
  />

  <Testimonials />
  <NewsletterSection />
</template>