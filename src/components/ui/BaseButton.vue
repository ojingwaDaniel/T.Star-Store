<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  variant: { type: String, default: "primary" }, // primary | outline | gold | ghost | light
  size: { type: String, default: "md" }, // sm | md | lg
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  type: { type: String, default: "button" },
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
  slant: { type: Boolean, default: true },
});

const tag = computed(() =>
  props.to ? RouterLink : props.href ? "a" : "button",
);
const attrs = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href };
  return { type: props.type, disabled: props.disabled || props.loading };
});

const variants = {
  primary: 'bg-ink text-bone hover:bg-graphite',
  light: 'bg-bone text-ink hover:bg-white',
  gold: 'bg-white text-ink hover:bg-bone', // inverse button for dark sections
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-bone',
  'outline-light': 'border-2 border-bone text-bone hover:bg-bone hover:text-ink',
  ghost: 'text-ink hover:text-graphite',
}
const sizes = {
  sm: "h-10 px-5 text-[12px]",
  md: "h-12 px-8 text-[13px]",
  lg: "h-14 px-10 text-[14px]",
};
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    :aria-busy="loading || undefined"
    :class="[
      'group relative inline-flex select-none items-center justify-center overflow-hidden font-sans font-semibold uppercase tracking-label',
      'transition-colors duration-300 ease-brand active:scale-[0.98]',
      'disabled:cursor-not-allowed disabled:opacity-45',
      variants[variant],
      sizes[size],
      block ? 'w-full' : '',
      slant ? 'skew-brand' : '',
    ]"
  >
    <span
      :class="['inline-flex items-center gap-2.5', slant ? 'unskew-brand' : '']"
    >
      <svg
        v-if="loading"
        class="h-4 w-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          stroke-width="3"
          opacity=".25"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
      <slot />
    </span>
  </component>
</template>
