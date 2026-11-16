<script setup>
import AppImage from "@/components/ui/AppImage.vue";
import { formatNaira } from "@/utils/currency";

defineProps({
  lines: { type: Array, required: true }, // { key?, name, image, color, size, quantity, unitPrice }
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  stateChosen: { type: Boolean, default: true },
  quoting: Boolean,
  title: { type: String, default: "Order summary" },
  editTo: { type: [String, Object], default: null },
  editLabel: { type: String, default: "Edit" },
});
</script>

<template>
  <div class="border border-line bg-white p-5 md:p-7">
    <div class="flex items-baseline justify-between">
      <h2 class="text-3xl">{{ title }}</h2>
      <RouterLink
        v-if="editTo"
        :to="editTo"
        class="text-[13px] underline underline-offset-4 hover:text-gold-dark"
        >{{ editLabel }}</RouterLink
      >
    </div>

    <ul class="mt-5 divide-y divide-line">
      <li
        v-for="(l, i) in lines"
        :key="l.key || i"
        class="flex gap-4 py-4 first:pt-0"
      >
        <div class="relative w-16 shrink-0">
          <AppImage :src="l.image" :alt="l.name" ratio="3/4" sizes="64px" />
          <span
            class="absolute -right-2 -top-2 grid h-5 min-w-[1.25rem] place-items-center bg-ink px-1 text-[11px] font-semibold text-bone"
          >
            <span class="sr-only">Quantity:</span>{{ l.quantity }}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-display text-lg font-bold uppercase leading-tight">
            {{ l.name }}
          </p>
          <p class="mt-1 text-[13px] text-graphite">
            {{ l.color }} · {{ l.size }}
          </p>
          <p v-if="l.issue" class="mt-1 text-[12px] font-medium text-error">
            {{ l.issue }}
          </p>
        </div>
        <p class="text-[14px] font-semibold">
          {{ formatNaira(l.unitPrice * l.quantity) }}
        </p>
      </li>
    </ul>

    <dl class="mt-2 space-y-3 border-t border-line pt-5 text-[14px]">
      <div class="flex justify-between">
        <dt class="text-graphite">Subtotal</dt>
        <dd class="font-semibold">{{ formatNaira(subtotal) }}</dd>
      </div>
      <div class="flex justify-between">
        <dt class="text-graphite">Delivery</dt>
        <dd class="font-semibold">
          <template v-if="!stateChosen"
            ><span class="font-normal text-graphite"
              >Select a state</span
            ></template
          >
          <template v-else-if="quoting"
            ><span class="font-normal text-graphite"
              >Calculating…</span
            ></template
          >
          <template v-else>{{
            deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)
          }}</template>
        </dd>
      </div>
      <div
        class="flex items-baseline justify-between border-t border-line pt-4"
        aria-live="polite"
      >
        <dt class="label text-ink">Total</dt>
        <dd class="text-2xl font-semibold">
          {{ formatNaira(total)
          }}<span
            v-if="!stateChosen"
            class="ml-1 text-[12px] font-normal text-graphite"
            >+ delivery</span
          >
        </dd>
      </div>
    </dl>
  </div>
</template>
