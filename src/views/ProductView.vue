<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronRight, ChevronDown, Truck } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Badge from '@/components/ui/Badge.vue'
import StarRating from '@/components/ui/StarRating.vue'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductPrice from '@/components/product/ProductPrice.vue'
import ProductPurchase from '@/components/product/ProductPurchase.vue'
import ReviewList from '@/components/product/ReviewList.vue'
import RelatedProducts from '@/components/product/RelatedProducts.vue'
import { useProductsStore } from '@/stores/products'
import { useSeo } from '@/composables/useSeo'
import { SITE } from '@/config/site'
import { formatNaira } from '@/utils/currency'
import { badgesFor, BADGE_LABELS, currentPrice, isInStock } from '@/utils/product'

const route = useRoute()
const store = useProductsStore()

const product = ref(null)
const loading = ref(true)
const error = ref('')
const notFound = ref(false)

let seq = 0
async function load() {
  const slug = route.params.slug
  const id = ++seq
  error.value = ''
  notFound.value = false
  product.value = store.getCached(slug)       // instant if we came from a list
  loading.value = !product.value
  try {
    const fresh = await store.fetchProduct(slug, { force: true }) // stock is always fresh
    if (id === seq) product.value = fresh
  } catch (e) {
    if (id !== seq) return
    if (e.status === 404) { notFound.value = true; product.value = null }
    else if (!product.value) error.value = e.message || 'Could not load this product.'
  } finally {
    if (id === seq) loading.value = false
  }
}
// The route is already the *next* one while this page fades out, so ignore a missing slug
watch(() => route.params.slug, (s) => { if (s && route.name === 'product') load() }, { immediate: true })

useSeo(computed(() => (product.value
  ? { title: product.value.name, description: product.value.description.slice(0, 155), image: product.value.images[0]?.url }
  : null)))

/* Structured data for search engines. Only emit aggregateRating when it is backed by real reviews. */
const LD_ID = 'product-jsonld'
watch(product, (p) => {
  document.getElementById(LD_ID)?.remove()
  if (!p) return
  const el = document.createElement('script')
  el.type = 'application/ld+json'
  el.id = LD_ID
  el.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    description: p.description,
    image: p.images.map((i) => i.url).filter(Boolean),
    brand: { '@type': 'Brand', name: SITE.name },
    ...(p.reviewCount ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewCount } } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: currentPrice(p),
      availability: isInStock(p) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href,
    },
  })
  document.head.appendChild(el)
}, { immediate: true })

const categorySlug = computed(() => product.value?.categories?.[0] || '')
const categoryName = computed(() => categorySlug.value.charAt(0).toUpperCase() + categorySlug.value.slice(1))

/* Mobile: a bottom bar appears once the buy buttons scroll out of view */
const purchaseEl = ref(null)
const showBar = ref(false)
let io
watch(purchaseEl, (el) => {
  io?.disconnect()
  if (!el || !('IntersectionObserver' in window)) return
  io = new IntersectionObserver(([e]) => { showBar.value = !e.isIntersecting && e.boundingClientRect.top < 0 })
  io.observe(el)
})
onBeforeUnmount(() => { io?.disconnect(); document.getElementById(LD_ID)?.remove() })

function toPurchase() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  purchaseEl.value?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
}

const detailBox = 'group border-b border-line py-5'
const detailSummary = 'flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden'
</script>

<template>
  <div class="pb-20 md:pb-0">
    <EmptyState
      v-if="notFound" title="Product not found"
      text="This product may have been removed, or the link is incorrect."
      action-label="Back to shop" :action-to="{ name: 'shop' }"
    />

    <div v-else-if="error" class="shell section-y text-center" role="alert">
      <p class="text-error">{{ error }}</p>
      <BaseButton class="mt-6" variant="outline" @click="load">Try again</BaseButton>
    </div>

    <div v-else-if="loading" class="shell grid gap-10 py-10 lg:grid-cols-12 lg:py-14" aria-busy="true" aria-label="Loading product">
      <Skeleton class="aspect-[4/5] w-full lg:col-span-7" />
      <div class="space-y-5 lg:col-span-5"><Skeleton class="h-4 w-24" /><Skeleton class="h-14 w-3/4" /><Skeleton class="h-7 w-40" /><Skeleton class="h-24 w-full" /><Skeleton class="h-12 w-full" /><Skeleton class="h-14 w-full" /></div>
    </div>

    <template v-else-if="product">
      <nav aria-label="Breadcrumb" class="shell pt-6 lg:pt-8">
        <ol class="flex flex-wrap items-center gap-1.5 text-[13px] text-graphite">
          <li><RouterLink to="/" class="hover:text-ink">Home</RouterLink></li>
          <li aria-hidden="true"><ChevronRight :size="14" /></li>
          <li><RouterLink to="/shop" class="hover:text-ink">Shop</RouterLink></li>
          <template v-if="categorySlug">
            <li aria-hidden="true"><ChevronRight :size="14" /></li>
            <li><RouterLink :to="`/shop/${categorySlug}`" class="hover:text-ink">{{ categoryName }}</RouterLink></li>
          </template>
          <li aria-hidden="true"><ChevronRight :size="14" /></li>
          <li class="font-medium text-ink" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <article class="shell grid gap-10 py-6 lg:grid-cols-12 lg:gap-14 lg:py-10">
        <div class="lg:col-span-7">
          <ProductGallery :key="product.slug" :images="product.images" :name="product.name" />
        </div>

        <div class="lg:col-span-5">
          <p class="label">{{ product.type }}</p>
          <h1 class="mt-2 text-5xl md:text-6xl">{{ product.name }}</h1>

          <div v-if="product.reviewCount" class="mt-4 flex items-center gap-3">
            <StarRating :rating="product.rating" />
            <a href="#reviews" class="text-[13px] underline underline-offset-4 hover:text-gold-dark">{{ product.rating.toFixed(1) }} · {{ product.reviewCount }} reviews</a>
          </div>

          <ProductPrice :product="product" size="lg" class="mt-5" />
          <div v-if="badgesFor(product).length" class="mt-3 flex gap-2">
            <Badge v-for="b in badgesFor(product)" :key="b" :variant="b">{{ BADGE_LABELS[b] }}</Badge>
          </div>

          <p class="mt-6 text-[16px] leading-relaxed text-graphite">{{ product.description }}</p>

          <div ref="purchaseEl" class="mt-8 scroll-mt-28">
            <ProductPurchase :key="product.id" :product="product" />
          </div>

          <div class="mt-10 border-t border-line">
            <details open :class="detailBox">
              <summary :class="detailSummary"><span class="label text-ink">Specifications</span><ChevronDown :size="16" class="transition-transform group-open:rotate-180" /></summary>
              <dl class="mt-4 grid grid-cols-[7rem_1fr] gap-y-3 text-[14px]">
                <template v-for="[k, v] in product.specs" :key="k">
                  <dt class="text-graphite">{{ k }}</dt><dd>{{ v }}</dd>
                </template>
              </dl>
            </details>
            <details :class="detailBox">
              <summary :class="detailSummary"><span class="label text-ink">Delivery &amp; returns</span><ChevronDown :size="16" class="transition-transform group-open:rotate-180" /></summary>
              <div class="mt-4 space-y-3 text-[14px] leading-relaxed text-graphite">
                <p class="flex gap-3"><Truck :size="18" class="mt-0.5 shrink-0 text-ink" /> Delivery takes 1 to 7 working days depending on your state. Free delivery on orders over {{ formatNaira(SITE.freeDeliveryThreshold) }}.</p>
                <p>Read our full <RouterLink to="/shipping-returns" class="underline underline-offset-4 hover:text-ink">shipping and returns information</RouterLink>.</p>
              </div>
            </details>
          </div>
        </div>
      </article>

      <ReviewList :slug="product.slug" :rating="product.rating" :count="product.reviewCount" />
      <RelatedProducts :slug="product.slug" />

      <div
        class="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-bone/95 px-5 py-3 backdrop-blur transition-transform duration-300 ease-brand md:hidden"
        :class="showBar ? 'translate-y-0' : 'translate-y-full'" :aria-hidden="!showBar"
      >
        <ProductPrice :product="product" />
        <BaseButton v-if="isInStock(product)" size="sm" :tabindex="showBar ? 0 : -1" @click="toPurchase">Choose options</BaseButton>
        <p v-else class="label text-error">Sold out</p>
      </div>
    </template>
  </div>
</template>