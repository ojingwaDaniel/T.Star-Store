import { watch, onBeforeUnmount } from "vue";

const stack = [];

export function useModalStack(active, onEscape) {
  const token = Symbol("modal");

  const onKey = (e) => {
    if (e.key === "Escape" && stack[stack.length - 1] === token) onEscape();
  };
  const leave = () => {
    const i = stack.indexOf(token);
    if (i !== -1) stack.splice(i, 1);
    document.removeEventListener("keydown", onKey);
  };

  watch(
    active,
    (on) => {
      if (on) {
        stack.push(token);
        document.addEventListener("keydown", onKey);
      } else leave();
    },
    { immediate: true },
  );

  onBeforeUnmount(leave);
}
