<script setup>
import { ref, toRef, onMounted, onBeforeUnmount } from "vue";
import { X } from "lucide-vue-next";
import { useScrollLock } from "@/composables/useScrollLock";
import { useFocusTrap } from "@/composables/useFocusTrap";

const props = defineProps({
  open: Boolean,
  side: { type: String, default: "right" }, // left | right
  label: { type: String, required: true }, // accessible name
  panelClass: { type: String, default: "max-w-md bg-bone text-ink" },
  dark: Boolean,
});
const emit = defineEmits(["close"]);

const panel = ref(null);
const open = toRef(props, "open");
useScrollLock(open);
useFocusTrap(panel, open);

const onKey = (e) => {
  if (e.key === "Escape" && props.open) emit("close");
};
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-ink/60 backdrop-blur-[2px]"
        aria-hidden="true"
        @click="emit('close')"
      />
    </Transition>

    <Transition :name="side === 'left' ? 'drawer-left' : 'drawer-right'">
      <aside
        v-if="open"
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        tabindex="-1"
        class="fixed inset-y-0 z-[60] flex w-full flex-col shadow-lift focus:outline-none"
        :class="[side === 'left' ? 'left-0' : 'right-0', panelClass]"
      >
        <div
          class="flex h-16 shrink-0 items-center justify-between border-b px-5 lg:h-20"
          :class="dark ? 'border-line-dark' : 'border-line'"
        >
          <slot name="header"
            ><h2 class="text-2xl">{{ label }}</h2></slot
          >
          <button
            type="button"
            class="icon-btn -mr-2.5"
            :class="dark && 'text-bone'"
            aria-label="Close"
            @click="emit('close')"
          >
            <X :size="22" />
          </button>
        </div>
        <slot />
      </aside>
    </Transition>
  </Teleport>
</template>
