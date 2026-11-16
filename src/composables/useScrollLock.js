import { watch, onBeforeUnmount } from "vue";

let locks = 0; // shared, so stacked overlays don't unlock each other

export function useScrollLock(active) {
  let held = false;
  const lock = () => {
    if (held) return;
    held = true;
    if (locks++ === 0) {
      const bar = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (bar > 0) document.body.style.paddingRight = `${bar}px`;
    }
  };
  const unlock = () => {
    if (!held) return;
    held = false;
    if (--locks === 0) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  };
  watch(active, (v) => (v ? lock() : unlock()), { immediate: true });
  onBeforeUnmount(unlock);
}
