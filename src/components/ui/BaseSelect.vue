<script setup>
import { useId } from "vue";
import { ChevronDown } from "lucide-vue-next";

defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, required: true },
  options: { type: Array, required: true }, // [{ value, label }] or strings
  placeholder: { type: String, default: "Select" },
  error: { type: String, default: "" },
  required: Boolean,
  disabled: Boolean,
});
defineEmits(["update:modelValue"]);
const id = useId();
const val = (o) => (typeof o === "string" ? o : o.value);
const lab = (o) => (typeof o === "string" ? o : o.label);
</script>

<template>
  <div>
    <label :for="id" class="label mb-2 block text-ink">
      {{ label
      }}<span v-if="required" class="text-gold-dark" aria-hidden="true">
        *</span
      >
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :aria-invalid="!!error || undefined"
        class="w-full appearance-none border bg-white py-3.5 pl-4 pr-11 text-[15px] text-ink focus:border-ink focus:outline-none disabled:opacity-50"
        :class="error ? 'border-error' : 'border-line hover:border-ink/40'"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="val(o)" :value="val(o)">
          {{ lab(o) }}
        </option>
      </select>
      <ChevronDown
        :size="18"
        class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-graphite"
        aria-hidden="true"
      />
    </div>
    <p v-if="error" class="mt-1.5 text-[13px] text-error" role="alert">
      {{ error }}
    </p>
  </div>
</template>
