<script setup>
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  page: { type: Number, required: true },
  lastPage: { type: Number, required: true },
});
const emit = defineEmits(["change"]);

// 1 … 4 5 6 … 12
const items = computed(() => {
  const nums = [
    ...new Set([1, props.lastPage, props.page - 1, props.page, props.page + 1]),
  ]
    .filter((n) => n >= 1 && n <= props.lastPage)
    .sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push(`gap-${n}`);
    out.push(n);
  });
  return out;
});
const btn =
  "grid h-11 min-w-[2.75rem] place-items-center px-3 text-[14px] font-semibold transition-colors";
</script>

<template>
  <nav
    v-if="lastPage > 1"
    aria-label="Pagination"
    class="mt-14 flex items-center justify-center gap-1.5"
  >
    <button
      type="button"
      :class="[btn, 'border border-line hover:border-ink disabled:opacity-35']"
      :disabled="page <= 1"
      aria-label="Previous page"
      @click="emit('change', page - 1)"
    >
      <ChevronLeft :size="18" />
    </button>
    <template v-for="it in items" :key="it">
      <span
        v-if="typeof it === 'string'"
        class="px-1 text-graphite"
        aria-hidden="true"
        >…</span
      >
      <button
        v-else
        type="button"
        :aria-current="it === page ? 'page' : undefined"
        :aria-label="`Page ${it}`"
        :class="[
          btn,
          it === page
            ? 'bg-ink text-bone'
            : 'border border-line hover:border-ink',
        ]"
        @click="it !== page && emit('change', it)"
      >
        {{ it }}
      </button>
    </template>
    <button
      type="button"
      :class="[btn, 'border border-line hover:border-ink disabled:opacity-35']"
      :disabled="page >= lastPage"
      aria-label="Next page"
      @click="emit('change', page + 1)"
    >
      <ChevronRight :size="18" />
    </button>
  </nav>
</template>
