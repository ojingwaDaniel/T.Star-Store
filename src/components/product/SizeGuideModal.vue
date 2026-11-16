<script setup>
import { ref, computed, watch } from "vue";
import Modal from "@/components/ui/Modal.vue";
import {
  SIZE_CHARTS,
  HOW_TO_MEASURE,
  defaultChartFor,
} from "@/config/sizeGuide";

const props = defineProps({
  open: Boolean,
  product: { type: Object, required: true },
});
const emit = defineEmits(["close"]);

const active = ref(defaultChartFor(props.product));
watch(
  () => props.open,
  (o) => {
    if (o) active.value = defaultChartFor(props.product);
  },
);
const chart = computed(
  () => SIZE_CHARTS.find((c) => c.id === active.value) || SIZE_CHARTS[0],
);
</script>

<template>
  <Modal
    :open="open"
    label="Size guide"
    size="md"
    z="z-[90]"
    @close="emit('close')"
  >
    <div class="p-6 pt-14 md:p-9">
      <h2 class="text-4xl md:text-5xl">Size guide</h2>

      <div
        class="mt-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Choose a size chart"
      >
        <button
          v-for="c in SIZE_CHARTS"
          :key="c.id"
          type="button"
          :aria-pressed="active === c.id"
          class="border px-4 py-2 text-[12px] font-semibold uppercase tracking-label transition-colors"
          :class="
            active === c.id
              ? 'border-ink bg-ink text-bone'
              : 'border-line bg-white hover:border-ink'
          "
          @click="active = c.id"
        >
          {{ c.label }}
        </button>
      </div>

      <div class="mt-6 overflow-x-auto">
        <table
          class="w-full min-w-[20rem] border-collapse text-left text-[14px]"
        >
          <caption class="mb-3 text-left text-[13px] text-graphite">
            {{
              chart.title
            }}
          </caption>
          <thead>
            <tr class="border-b-2 border-ink">
              <th
                v-for="h in chart.headers"
                :key="h"
                scope="col"
                class="py-3 pr-4 text-[11px] font-semibold uppercase tracking-label"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in chart.rows"
              :key="row[0]"
              class="border-b border-line"
            >
              <th scope="row" class="py-3 pr-4 font-semibold">{{ row[0] }}</th>
              <td
                v-for="(cell, i) in row.slice(1)"
                :key="i"
                class="py-3 pr-4 tabular-nums"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="mt-9 text-2xl">How to measure</h3>
      <ul class="mt-3 space-y-2 text-[14px] leading-relaxed text-graphite">
        <li v-for="t in HOW_TO_MEASURE" :key="t">{{ t }}</li>
      </ul>
      <p class="mt-6 text-[12px] text-graphite">
        Measurements are approximate and can vary by up to 2 cm.
      </p>
    </div>
  </Modal>
</template>
