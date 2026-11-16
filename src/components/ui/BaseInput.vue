<script setup>
import { useId } from "vue";

defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, required: true },
  type: { type: String, default: "text" },
  error: { type: String, default: "" },
  hint: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  autocomplete: { type: String, default: "off" },
  required: Boolean,
  textarea: Boolean,
  rows: { type: Number, default: 5 },
});
defineEmits(["update:modelValue", "blur"]);
const id = useId();
</script>

<template>
  <div>
    <label :for="id" class="label mb-2 block text-ink">
      {{ label
      }}<span v-if="required" class="text-gold-dark" aria-hidden="true">
        *</span
      >
    </label>
    <component
      :is="textarea ? 'textarea' : 'input'"
      :id="id"
      :type="textarea ? undefined : type"
      :rows="textarea ? rows : undefined"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? `${id}-err` : hint ? `${id}-hint` : undefined"
      class="w-full border bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-graphite/60 transition-colors duration-200 focus:border-ink focus:outline-none"
      :class="error ? 'border-error' : 'border-line hover:border-ink/40'"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />
    <p
      v-if="error"
      :id="`${id}-err`"
      class="mt-1.5 text-[13px] text-error"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="`${id}-hint`"
      class="mt-1.5 text-[13px] text-graphite"
    >
      {{ hint }}
    </p>
  </div>
</template>
