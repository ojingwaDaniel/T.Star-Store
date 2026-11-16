import { watch, nextTick, onBeforeUnmount } from "vue";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Keeps Tab inside `container` while `active`, and restores focus on close.
export function useFocusTrap(container, active) {
  let previous = null;

  const onKey = (e) => {
    if (e.key !== "Tab" || !container.value) return;
    const els = [...container.value.querySelectorAll(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null,
    );
    if (!els.length) {
      e.preventDefault();
      return;
    }
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  watch(
    active,
    async (on) => {
      if (on) {
        previous = document.activeElement;
        document.addEventListener("keydown", onKey);
        await nextTick();
        const target =
          container.value?.querySelector("[data-autofocus]") ||
          container.value?.querySelector(FOCUSABLE);
        (target || container.value)?.focus();
      } else {
        document.removeEventListener("keydown", onKey);
        previous?.focus?.();
        previous = null;
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
}
