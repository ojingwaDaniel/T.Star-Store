<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import AppImage from "@/components/ui/AppImage.vue";

const props = defineProps({
  images: { type: Array, default: () => [] }, // [{ url, alt }]
  name: { type: String, required: true },
  thumbs: { type: Boolean, default: true }, // thumbnail column on md+
  ratio: { type: String, default: "4/5" },
});

const slides = computed(() =>
  props.images.length ? props.images : [{ url: "", alt: props.name }],
);
const track = ref(null);
const index = ref(0);
let raf = 0;

// A scroll-snap track: swipe on touch, arrows/thumbs/keys elsewhere
function onScroll() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const el = track.value;
    if (el && el.clientWidth)
      index.value = Math.round(el.scrollLeft / el.clientWidth);
  });
}
function go(i) {
  const el = track.value;
  if (!el) return;
  const n = Math.max(0, Math.min(slides.value.length - 1, i));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollTo({
    left: n * el.clientWidth,
    behavior: reduce ? "auto" : "smooth",
  });
  index.value = n;
}
function onKey(e) {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    go(index.value + 1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    go(index.value - 1);
  }
}
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <div :class="thumbs && 'md:flex md:flex-row-reverse md:gap-4'">
    <div class="relative min-w-0 flex-1">
      <div
        ref="track"
        tabindex="0"
        aria-roledescription="carousel"
        :aria-label="`${name} images`"
        class="flex snap-x snap-mandatory overflow-x-auto no-scrollbar focus-visible:outline-offset-[-3px]"
        @scroll.passive="onScroll"
        @keydown="onKey"
      >
        <div
          v-for="(img, i) in slides"
          :key="i"
          class="w-full shrink-0 snap-center"
          role="group"
          aria-roledescription="slide"
          :aria-label="`Image ${i + 1} of ${slides.length}`"
        >
          <AppImage
            :src="img.url"
            :alt="img.alt || name"
            :ratio="ratio"
            :eager="i === 0"
            sizes="(min-width:1024px) 55vw, 100vw"
          />
        </div>
      </div>

      <template v-if="slides.length > 1">
        <button
          type="button"
          aria-label="Previous image"
          :disabled="index === 0"
          class="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center bg-bone/90 transition-colors hover:bg-white disabled:opacity-0 md:grid"
          @click="go(index - 1)"
        >
          <ChevronLeft :size="20" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          :disabled="index === slides.length - 1"
          class="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center bg-bone/90 transition-colors hover:bg-white disabled:opacity-0 md:grid"
          @click="go(index + 1)"
        >
          <ChevronRight :size="20" />
        </button>
        <p
          class="pointer-events-none absolute bottom-3 right-3 bg-ink/80 px-2.5 py-1 text-[11px] font-semibold tracking-label text-bone"
          aria-hidden="true"
        >
          {{ index + 1 }} / {{ slides.length }}
        </p>

        <div class="mt-3 flex justify-center" :class="thumbs && 'md:hidden'">
          <button
            v-for="(s, i) in slides"
            :key="i"
            type="button"
            class="flex h-6 items-center px-1"
            :aria-label="`Show image ${i + 1}`"
            :aria-current="i === index || undefined"
            @click="go(i)"
          >
            <span
              class="block h-[3px] w-7 transition-colors"
              :class="i === index ? 'bg-ink' : 'bg-line'"
            />
          </button>
        </div>
      </template>
    </div>

    <ul
      v-if="thumbs && slides.length > 1"
      class="mt-3 hidden gap-3 md:mt-0 md:flex md:w-20 md:shrink-0 md:flex-col"
    >
      <li v-for="(img, i) in slides" :key="i">
        <button
          type="button"
          class="block w-full border-2 transition-colors"
          :class="
            i === index
              ? 'border-ink'
              : 'border-transparent hover:border-ink/40'
          "
          :aria-label="`Show image ${i + 1}`"
          :aria-current="i === index || undefined"
          @click="go(i)"
        >
          <AppImage :src="img.url" alt="" ratio="4/5" sizes="80px" />
        </button>
      </li>
    </ul>
  </div>
</template>
