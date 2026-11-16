<script setup>
import { X, Check, AlertTriangle, Info } from "lucide-vue-next";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();
const icons = { success: Check, error: AlertTriangle, info: Info };
const accent = { success: "bg-success", error: "bg-error", info: "bg-gold" };
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
    aria-live="polite"
    role="status"
  >
    <TransitionGroup name="toast">
      <div
        v-for="t in ui.toasts"
        :key="t.id"
        class="pointer-events-auto flex w-full max-w-sm items-stretch bg-ink text-bone shadow-lift"
      >
        <span
          :class="['grid w-11 place-items-center text-white', accent[t.type]]"
        >
          <component :is="icons[t.type]" :size="18" />
        </span>
        <p class="flex-1 px-4 py-3.5 text-[14px]">{{ t.message }}</p>
        <button
          class="px-3 text-bone/60 hover:text-bone"
          aria-label="Dismiss notification"
          @click="ui.dismiss(t.id)"
        >
          <X :size="16" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
