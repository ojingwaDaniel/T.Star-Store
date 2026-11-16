<script setup>
import { ref, computed, watch } from "vue";
import { BadgeCheck } from "lucide-vue-next";
import StarRating from "@/components/ui/StarRating.vue";
import Skeleton from "@/components/ui/Skeleton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { getReviews } from "@/services/productService";

const props = defineProps({
  slug: { type: String, required: true },
  rating: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
});

const PREVIEW = 3;
const reviews = ref([]);
const loading = ref(true);
const error = ref("");
const showAll = ref(false);

async function load() {
  loading.value = true;
  error.value = "";
  showAll.value = false;
  try {
    reviews.value = await getReviews(props.slug);
  } catch (e) {
    error.value = e.message || "Could not load reviews.";
  } finally {
    loading.value = false;
  }
}
watch(() => props.slug, load, { immediate: true });

const visible = computed(() =>
  showAll.value ? reviews.value : reviews.value.slice(0, PREVIEW),
);
const fmt = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
</script>

<template>
  <section
    id="reviews"
    class="scroll-mt-28 border-t border-line bg-white section-y"
    aria-labelledby="reviews-title"
  >
    <div class="shell grid gap-10 lg:grid-cols-12">
      <div class="lg:col-span-4">
        <h2 id="reviews-title" class="text-5xl">Customer reviews</h2>
        <div v-if="count" class="mt-6 flex items-center gap-4">
          <p class="font-display text-7xl font-extrabold leading-none">
            {{ rating.toFixed(1) }}
          </p>
          <div>
            <StarRating :rating="rating" :size="18" />
            <p class="mt-1.5 text-[13px] text-graphite">
              Based on {{ count }} reviews
            </p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div v-if="loading" class="space-y-8" aria-label="Loading reviews">
          <div v-for="n in 2" :key="n" class="space-y-3">
            <Skeleton class="h-4 w-28" /><Skeleton class="h-5 w-1/2" /><Skeleton
              class="h-14 w-full"
            />
          </div>
        </div>

        <div v-else-if="error" role="alert">
          <p class="text-error">{{ error }}</p>
          <BaseButton class="mt-4" variant="outline" @click="load"
            >Try again</BaseButton
          >
        </div>

        <p v-else-if="!reviews.length" class="text-graphite">
          No written reviews yet.
        </p>

        <template v-else>
          <ul class="divide-y divide-line">
            <li v-for="r in visible" :key="r.id" class="py-7 first:pt-0">
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
                <StarRating :rating="r.rating" :size="15" />
                <p class="text-[13px] text-graphite">
                  {{ r.author }} · {{ fmt.format(new Date(r.date)) }}
                </p>
                <p
                  v-if="r.verified"
                  class="inline-flex items-center gap-1 text-[12px] font-medium text-success"
                >
                  <BadgeCheck :size="14" /> Verified purchase
                </p>
              </div>
              <h3 class="mt-3 text-2xl">{{ r.title }}</h3>
              <p
                class="mt-2 max-w-2xl text-[15px] leading-relaxed text-graphite"
              >
                {{ r.body }}
              </p>
              <p v-if="r.size" class="mt-3 text-[12px] text-graphite">
                Size purchased: {{ r.size }}
              </p>
            </li>
          </ul>
          <BaseButton
            v-if="reviews.length > PREVIEW"
            class="mt-4"
            variant="outline"
            @click="showAll = !showAll"
          >
            {{ showAll ? "Show fewer" : `Show all ${reviews.length} reviews` }}
          </BaseButton>
        </template>
      </div>
    </div>
  </section>
</template>
