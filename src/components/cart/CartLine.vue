<script setup>
import { ref, computed } from "vue";
import { Trash2, Pencil } from "lucide-vue-next";
import AppImage from "@/components/ui/AppImage.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import QuantityStepper from "@/components/ui/QuantityStepper.vue";
import Skeleton from "@/components/ui/Skeleton.vue";
import VariantSelector from "@/components/product/VariantSelector.vue";
import SizeGuideModal from "@/components/product/SizeGuideModal.vue";
import { useCartStore } from "@/stores/cart";
import { useProductsStore } from "@/stores/products";
import { useToast } from "@/composables/useToast";
import { formatNaira } from "@/utils/currency";

const props = defineProps({ line: { type: Object, required: true } });

const cart = useCartStore();
const store = useProductsStore();
const toast = useToast();

const editing = ref(false);
const loading = ref(false);
const product = ref(null);
const size = ref("");
const color = ref("");
const error = ref("");
const guideOpen = ref(false);

const unchanged = computed(
  () => size.value === props.line.size && color.value === props.line.color,
);

async function toggleEdit() {
  editing.value = !editing.value;
  if (!editing.value) return;
  size.value = props.line.size;
  color.value = props.line.color;
  error.value = "";
  if (product.value) return;
  loading.value = true;
  try {
    product.value = await store.fetchProduct(props.line.slug, { force: true });
  } catch (e) {
    error.value = e.message || "Could not load options.";
  } finally {
    loading.value = false;
  }
}

function apply() {
  const res = cart.changeVariant(props.line.key, product.value, {
    size: size.value,
    color: color.value,
  });
  if (!res.ok) {
    error.value = res.error;
    return;
  }
  toast.success(
    res.adjusted
      ? "Options updated. Quantity reduced to what is in stock."
      : "Options updated.",
  );
  editing.value = false;
}

function setQty(q) {
  const r = cart.setQuantity(props.line.key, q);
  if (!r.ok && r.error) toast.info(r.error);
}
function remove() {
  cart.remove(props.line.key);
  toast.info(`${props.line.name} removed from your cart.`);
}
</script>

<template>
  <li class="py-7 first:pt-0">
    <div class="flex gap-4 md:gap-6">
      <RouterLink
        :to="{ name: 'product', params: { slug: line.slug } }"
        class="block w-24 shrink-0 md:w-32"
        tabindex="-1"
        aria-hidden="true"
        :class="line.available === false && 'opacity-50'"
      >
        <AppImage
          :src="line.image"
          :alt="line.name"
          ratio="3/4"
          sizes="128px"
        />
      </RouterLink>

      <div class="flex min-w-0 flex-1 flex-col">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <RouterLink
              :to="{ name: 'product', params: { slug: line.slug } }"
              class="font-display text-2xl font-bold uppercase leading-none hover:text-gold-dark md:text-3xl"
              >{{ line.name }}</RouterLink
            >
            <p class="mt-2 flex items-center gap-2 text-[14px] text-graphite">
              <span
                class="h-3.5 w-3.5 border border-ink/20"
                :style="{ background: line.colorHex }"
                aria-hidden="true"
              />
              {{ line.color }} · Size {{ line.size }}
            </p>
          </div>
          <p class="shrink-0 text-right text-[16px] font-semibold">
            {{ formatNaira(line.unitPrice * line.quantity) }}
            <s
              v-if="line.originalPrice > line.unitPrice"
              class="block text-[13px] font-normal text-graphite"
              >{{ formatNaira(line.originalPrice * line.quantity) }}</s
            >
          </p>
        </div>

        <p
          v-if="line.issue"
          class="mt-2 text-[13px] font-medium text-error"
          role="alert"
        >
          {{ line.issue }}
        </p>

        <div
          class="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-3 pt-4"
        >
          <QuantityStepper
            :model-value="line.quantity"
            :max="line.maxStock"
            :label="`Quantity for ${line.name}`"
            @update:model-value="setQty"
            @limit="toast.info(`Only ${line.maxStock} available.`)"
          />
          <div class="flex items-center gap-5 text-[13px]">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-gold-dark"
              :aria-expanded="editing"
              @click="toggleEdit"
            >
              <Pencil :size="14" /> {{ editing ? "Cancel" : "Edit options" }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-error"
              :aria-label="`Remove ${line.name}, ${line.color}, size ${line.size}`"
              @click="remove"
            >
              <Trash2 :size="14" /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editing" class="mt-6 border border-line bg-white p-5 md:p-6">
      <div v-if="loading" class="space-y-4" aria-busy="true">
        <Skeleton class="h-10 w-2/3" /><Skeleton class="h-12 w-full" />
      </div>
      <p v-else-if="error && !product" class="text-error" role="alert">
        {{ error }}
      </p>
      <template v-else-if="product">
        <VariantSelector
          v-model:size="size"
          v-model:color="color"
          :product="product"
          @size-guide="guideOpen = true"
        />
        <p v-if="error" class="mt-4 text-[13px] text-error" role="alert">
          {{ error }}
        </p>
        <div class="mt-6 flex gap-3">
          <BaseButton
            size="sm"
            :disabled="unchanged || !size || !color"
            @click="apply"
            >Update options</BaseButton
          >
          <BaseButton size="sm" variant="outline" @click="editing = false"
            >Cancel</BaseButton
          >
        </div>
        <SizeGuideModal
          :open="guideOpen"
          :product="product"
          @close="guideOpen = false"
        />
      </template>
    </div>
  </li>
</template>
