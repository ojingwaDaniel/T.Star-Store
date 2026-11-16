<script setup>
import { ref, onMounted } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import Skeleton from "@/components/ui/Skeleton.vue";
import { getPaymentMethods } from "@/services/checkoutService";

defineProps({
  modelValue: { type: String, default: "" },
  error: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const methods = ref([]);
const loading = ref(true);
const loadError = ref("");

async function load() {
  loading.value = true;
  loadError.value = "";
  try {
    methods.value = await getPaymentMethods();
  } catch (e) {
    loadError.value = e.message || "Could not load payment methods.";
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>

<template>
  <fieldset>
    <legend class="label mb-4 text-ink">
      Payment method <span class="text-gold-dark" aria-hidden="true">*</span>
    </legend>

    <div v-if="loading" class="space-y-3" aria-busy="true">
      <Skeleton v-for="n in 3" :key="n" class="h-20 w-full" />
    </div>

    <div v-else-if="loadError" role="alert">
      <p class="text-error">{{ loadError }}</p>
      <BaseButton class="mt-4" variant="outline" size="sm" @click="load"
        >Try again</BaseButton
      >
    </div>

    <div v-else class="space-y-3">
      <label
        v-for="m in methods"
        :key="m.id"
        class="block"
        :class="m.enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'"
      >
        <input
          type="radio"
          name="payment-method"
          class="peer sr-only"
          :value="m.id"
          :checked="modelValue === m.id"
          :disabled="!m.enabled"
          @change="emit('update:modelValue', m.id)"
        />
        <div
          class="flex gap-4 border border-line bg-white p-4 transition-colors hover:border-ink/40 peer-checked:border-ink peer-checked:ring-1 peer-checked:ring-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold"
        >
          <span
            class="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-ink"
            aria-hidden="true"
          >
            <span
              class="h-1.5 w-1.5 rounded-full bg-ink transition-opacity"
              :class="modelValue === m.id ? 'opacity-100' : 'opacity-0'"
            />
          </span>
          <span>
            <span class="block text-[15px] font-semibold">{{ m.label }}</span>
            <span
              class="mt-1 block text-[13px] leading-relaxed text-graphite"
              >{{ m.description }}</span
            >
            <span
              v-if="m.integrationStatus === 'pending'"
              class="mt-2 inline-block bg-bone px-2 py-1 text-[11px] font-semibold uppercase tracking-label text-gold-dark"
              >Payment integration pending</span
            >
          </span>
        </div>
      </label>
    </div>

    <p v-if="error" class="mt-2 text-[13px] text-error" role="alert">
      {{ error }}
    </p>
  </fieldset>
</template>
