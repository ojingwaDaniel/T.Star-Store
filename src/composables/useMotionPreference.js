import { ref, onMounted, onBeforeUnmount } from "vue";

export function useMotionPreference() {
  const reduced = ref(false);
  let mq;
  const update = () => {
    reduced.value = mq.matches;
  };
  onMounted(() => {
    mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    update();
    mq.addEventListener("change", update);
  });
  onBeforeUnmount(() => mq && mq.removeEventListener("change", update));
  return { reduced };
}
