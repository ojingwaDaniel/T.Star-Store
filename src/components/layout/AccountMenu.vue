<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { User, LogOut } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();
const open = ref(false);
const root = ref(null);

const onDoc = (e) => {
  if (root.value && !root.value.contains(e.target)) open.value = false;
};
const onKey = (e) => {
  if (e.key === "Escape") open.value = false;
};
onMounted(() => {
  document.addEventListener("click", onDoc);
  document.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDoc);
  document.removeEventListener("keydown", onKey);
});

async function signOut() {
  open.value = false;
  await auth.logout();
  toast.info("You have been signed out.");
  router.push("/");
}
</script>

<template>
  <div v-if="auth.isAuthenticated" ref="root" class="relative hidden lg:block">
    <button
      type="button"
      class="icon-btn"
      aria-haspopup="menu"
      :aria-expanded="open"
      aria-label="Account menu"
      @click="open = !open"
    >
      <User :size="20" />
    </button>
    <div
      v-if="open"
      role="menu"
      class="absolute right-0 top-full z-50 mt-2 w-64 border border-line bg-white shadow-lift"
    >
      <div class="border-b border-line px-4 py-3.5">
        <p class="truncate text-[14px] font-semibold">{{ auth.user.name }}</p>
        <p class="truncate text-[13px] text-graphite">{{ auth.user.email }}</p>
      </div>
      <RouterLink
        to="/wishlist"
        role="menuitem"
        class="block px-4 py-3 text-[14px] hover:bg-bone"
        @click="open = false"
        >My wishlist</RouterLink
      >
      <button
        type="button"
        role="menuitem"
        class="flex w-full items-center gap-2 border-t border-line px-4 py-3 text-left text-[14px] hover:bg-bone"
        @click="signOut"
      >
        <LogOut :size="15" /> Sign out
      </button>
    </div>
  </div>

  <RouterLink
    v-else
    to="/login"
    class="icon-btn hidden lg:grid"
    aria-label="Sign in"
    ><User :size="20"
  /></RouterLink>
</template>
