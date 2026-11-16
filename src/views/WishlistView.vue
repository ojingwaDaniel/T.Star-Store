<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useProductsStore } from '@/stores/products'
import { useToast } from '@/composables/useToast'
import { getProducts } from '@/services/productService'

const wishlist = useWishlistStore()
const store = useProductsStore()
const toast = useToast()

const products = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  const ids = [...wishlist.ids].reverse() // newest first
  error.value = ''
  if (!ids.length) { products.value = []; loading.value = false; return }
  loading.value = true
  try {
    const res = await getProducts({ ids, perPage: ids.length })
    const byId = new Map(res.data.map((p) => [p.id, p]))
    products.value = ids.map((id) => byId.get(id)).filter(Boolean)
    store.remember(res.data)
    // Products that no longer exist shouldn't linger in the list or the header count
    ids.filter((id) => !byId.has(id)).forEach((id) => wishlist.remove(id))
  } catch (e) {
    error.value = e.message || 'Could not load your wishlist.'
  } finally {
    loading.value = false
  }
}
onMounted(load)

// Removing a star on a card drops it from the page instantly, with no refetch
const visible = computed(() => products.value.filter((p) => wishlist.has(p.id)))
const showEmpty = computed(() => !loading.value && !error.value && visible.value.length === 0)

function clearAll() {
  wishlist.clear()
  toast.info('Your wishlist has been cleared.')
}
</script>

<template>
  <div>
    <header class="border-b border-line bg-white">
      <div class="shell flex flex-wrap items-end justify-between gap-6 py-10 md:py-14">
        <div>
          <p class="label-gold">Saved</p>
          <h1 class="mt-3 text-6xl md:text-8xl">Wishlist</h1>
          <p class="mt-4 text-graphite">Saved on this device. Open a piece to pick a size and colour.</p>
        </div>
        <BaseButton v-if="visible.length" variant="outline" size="sm" @click="clearAll">Clear wishlist</BaseButton>
      </div>
    </header>

    <div class="shell py-10 lg:py-14">
      <EmptyState
        v-if="showEmpty" title="Your wishlist is empty"
        text="Tap the star on any piece to save it here."
        action-label="Browse the collection" :action-to="{ name: 'shop' }"
      />
      <ProductGrid
        v-else :products="visible" :loading="loading" :error="error"
        :skeletons="Math.min(Math.max(wishlist.count, 2), 8)" cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4" @retry="load"
      />
    </div>
  </div>
</template>