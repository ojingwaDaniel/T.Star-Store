<script setup>
import { Search } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import StarIcon from "@/components/ui/StarIcon.vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();
</script>

<template>
  <section
    class="relative isolate overflow-hidden bg-ink text-bone"
    aria-labelledby="nf-title"
  >
    <StarIcon
      :size="900"
      :filled="false"
      :stroke-width="0.3"
      class="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-bone/[0.08]"
    />

    <div
      class="shell flex min-h-[calc(100svh-7.5rem)] flex-col items-center justify-center py-20 text-center"
    >
      <p
        class="text-outline select-none font-display text-[clamp(8rem,32vw,22rem)] font-extrabold italic leading-[.8] [--outline:#B8923A]"
        aria-hidden="true"
      >
        404
      </p>
      <h1 id="nf-title" class="mt-6 text-5xl italic md:text-7xl">
        Off the map.
      </h1>
      <p class="mt-4 max-w-md text-[17px] text-bone/70">
        That page doesn't exist, or it has moved. Let's get you back to
        something good.
      </p>

      <div class="mt-9 flex flex-wrap justify-center gap-4">
        <BaseButton to="/" variant="gold" size="lg">Back to home</BaseButton>
        <BaseButton to="/shop" variant="outline-light" size="lg"
          >Shop the collection</BaseButton
        >
      </div>
      <button
        type="button"
        class="mt-8 inline-flex items-center gap-2 text-[13px] text-bone/70 underline underline-offset-4 hover:text-gold"
        @click="ui.openSearch()"
      >
        <Search :size="16" /> Search the store
      </button>
    </div>
  </section>
</template>
