import { defineStore } from "pinia";

let toastId = 0;

export const useUiStore = defineStore("ui", {
  state: () => ({
    cartDrawerOpen: false,
    mobileMenuOpen: false,
    searchOpen: false,
    quickViewSlug: null,
    toasts: [],
  }),
  actions: {
    toast(message, type = "success", duration = 3200) {
      const id = ++toastId;
      this.toasts.push({ id, message, type });
      setTimeout(() => this.dismiss(id), duration);
    },
    dismiss(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
    openCart() {
      this.cartDrawerOpen = true;
    },
    closeCart() {
      this.cartDrawerOpen = false;
    },
    openMenu() {
      this.mobileMenuOpen = true;
    },
    closeMenu() {
      this.mobileMenuOpen = false;
    },
    openSearch() {
      this.searchOpen = true;
    },
    closeSearch() {
      this.searchOpen = false;
    },
    openQuickView(slug) {
      this.quickViewSlug = slug;
    },
    closeQuickView() {
      this.quickViewSlug = null;
    },
  },
});
