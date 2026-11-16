import { useUiStore } from "@/stores/ui";

export function useToast() {
  const ui = useUiStore();
  return {
    success: (m) => ui.toast(m, "success"),
    error: (m) => ui.toast(m, "error", 4500),
    info: (m) => ui.toast(m, "info"),
  };
}
