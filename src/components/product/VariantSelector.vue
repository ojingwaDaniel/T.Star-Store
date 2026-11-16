<script setup>
import { computed, ref, useId } from "vue";
import { Ruler } from "lucide-vue-next";
import { availableSizes, variantStock } from "@/utils/product";

const props = defineProps({
  product: { type: Object, required: true },
  size: { type: String, default: "" },
  color: { type: String, default: "" },
  showErrors: Boolean, // highlight whatever is still missing
});
const emit = defineEmits(["update:size", "update:color", "size-guide"]);

const uid = useId();
const notice = ref("");

// Sizes: unavailable in the chosen colour (or in every colour, if none chosen yet)
const sizeOk = computed(
  () => new Set(availableSizes(props.product, props.color || null)),
);
// Colours: unavailable only if sold out in every size. Picking one that lacks the
// chosen size clears the size (with a notice) instead of leaving the buyer stuck.
const colorOk = computed(
  () =>
    new Set(
      props.product.variants.filter((v) => v.stock > 0).map((v) => v.color),
    ),
);

function pickColor(name) {
  notice.value = "";
  emit("update:color", name);
  if (props.size && variantStock(props.product, props.size, name) < 1) {
    notice.value = `Size ${props.size} isn't available in ${name}. Please choose another size.`;
    emit("update:size", "");
  }
}
function pickSize(s) {
  notice.value = "";
  emit("update:size", s);
}
const swatchSoldOut =
  "linear-gradient(to top right, transparent calc(50% - 1px), rgba(10,10,10,.55) 50%, transparent calc(50% + 1px))";
</script>

<template>
  <div class="space-y-7">
    <div role="group" :aria-labelledby="`${uid}-color`">
      <p
        :id="`${uid}-color`"
        class="label mb-3"
        :class="showErrors && !color ? 'text-error' : 'text-ink'"
      >
        Colour<span
          v-if="color"
          class="font-normal normal-case tracking-normal text-graphite"
          >: {{ color }}</span
        >
      </p>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="c in product.colors"
          :key="c.name"
          type="button"
          :disabled="!colorOk.has(c.name)"
          :aria-pressed="color === c.name"
          :aria-label="colorOk.has(c.name) ? c.name : `${c.name}, sold out`"
          class="relative grid h-11 w-11 place-items-center transition-shadow disabled:cursor-not-allowed disabled:opacity-50"
          :class="
            color === c.name
              ? 'ring-2 ring-ink ring-offset-2 ring-offset-bone'
              : 'ring-1 ring-line hover:ring-ink/50'
          "
          @click="pickColor(c.name)"
        >
          <span
            class="block h-8 w-8 border border-ink/15"
            :style="{ background: c.hex }"
          />
          <span
            v-if="!colorOk.has(c.name)"
            class="absolute inset-0"
            :style="{ background: swatchSoldOut }"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <div role="group" :aria-labelledby="`${uid}-size`">
      <div class="mb-3 flex items-baseline justify-between">
        <p
          :id="`${uid}-size`"
          class="label"
          :class="showErrors && !size ? 'text-error' : 'text-ink'"
        >
          Size<span
            v-if="size"
            class="font-normal normal-case tracking-normal text-graphite"
            >: {{ size }}</span
          >
        </p>
        <button
          v-if="product.sizes.length > 1"
          type="button"
          class="inline-flex items-center gap-1.5 text-[13px] underline underline-offset-4 hover:text-gold-dark"
          @click="emit('size-guide')"
        >
          <Ruler :size="15" /> Size guide
        </button>
      </div>
      <div class="flex flex-wrap gap-2.5">
        <button
          v-for="s in product.sizes"
          :key="s"
          type="button"
          :disabled="!sizeOk.has(s)"
          :aria-pressed="size === s"
          :aria-label="
            sizeOk.has(s)
              ? undefined
              : `${s}, unavailable${color ? ' in ' + color : ''}`
          "
          class="h-12 min-w-[3.25rem] border px-4 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed"
          :class="
            size === s
              ? 'border-ink bg-ink text-bone'
              : sizeOk.has(s)
                ? 'border-line bg-white hover:border-ink'
                : 'border-line bg-white text-graphite/50 line-through'
          "
          @click="pickSize(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <p v-if="notice" class="text-[13px] text-graphite" role="status">
      {{ notice }}
    </p>
  </div>
</template>
