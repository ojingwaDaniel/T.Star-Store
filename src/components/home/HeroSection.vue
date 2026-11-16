<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ArrowRight, Pause, Play } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppImage from '@/components/ui/AppImage.vue'
import { IMAGES, VIDEOS } from '@/mock/images'

const root = ref(null)
const video = ref(null)
const playing = ref(false)
const hasVideo = !!VIDEOS.hero.mp4
const useVideo = ref(false)
let mm

/* YouTube embed (used only when youtubeId is set) */
const ytId = VIDEOS.hero.youtubeId
const ytSrc = ytId
  ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`
  : ''
const frame = ref(null)
const ytPlaying = ref(true)
function ytToggle() {
  const cmd = ytPlaying.value ? 'pauseVideo' : 'playVideo'
  frame.value?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*')
  ytPlaying.value = !ytPlaying.value
}

/* Direct video file (used only when mp4 is set and there is no youtubeId) */
function canAutoplay() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = navigator.connection?.saveData === true
  return hasVideo && !reduced && !saveData
}

async function togglePlay() {
  const v = video.value
  if (!v) return
  if (v.paused) {
    try { await v.play() } catch { /* blocked */ }
  } else v.pause()
}

onMounted(async () => {
  useVideo.value = !ytId && hasVideo && !navigator.connection?.saveData
  if (useVideo.value) {
    await Promise.resolve()
    const v = video.value
    if (v) {
      v.muted = true // autoplay needs it
      if (canAutoplay()) {
        try { await v.play() } catch { /* shows the poster instead */ }
      }
    }
  }

  mm = gsap.matchMedia(root.value)
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('[data-hero="eyebrow"]', { y: 16, opacity: 0, duration: 0.6 })
      .from('[data-hero="line"]', { yPercent: 110, duration: 1.1, stagger: 0.12 }, '-=0.3')
      .from('[data-hero="streak"]', { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power3.inOut' }, '-=0.7')
      .from('[data-hero="sub"]', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('[data-hero="cta"]', { y: 20, opacity: 0, stagger: 0.1, duration: 0.7 }, '-=0.6')
  })
})
onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section
    ref="root" aria-labelledby="hero-title"
    class="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ink text-bone lg:min-h-[calc(100svh-7rem)] lg:items-center"
  >
    <div class="absolute inset-0 -z-10">
      <!-- only ONE of these three shows: iframe, then video, then photo -->
      <iframe
        v-if="ytId" ref="frame" :src="ytSrc" title="" tabindex="-1" aria-hidden="true"
        allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"
        class="pointer-events-none absolute left-1/2 top-1/2 h-full min-w-full -translate-x-1/2 -translate-y-1/2 border-0 [aspect-ratio:9/16] lg:aspect-video lg:h-[56.25vw] lg:min-h-full lg:w-[100vw] lg:scale-[3.2]"
      />
      <video
        v-else-if="useVideo" ref="video"
        class="h-full w-full object-cover"
        muted loop playsinline preload="metadata"
        :poster="VIDEOS.hero.poster || undefined"
        aria-hidden="true" tabindex="-1"
        @play="playing = true" @pause="playing = false"
      >
        <source v-if="VIDEOS.hero.webm" :src="VIDEOS.hero.webm" type="video/webm" />
        <source :src="VIDEOS.hero.mp4" type="video/mp4" />
      </video>
      <AppImage
        v-else :src="IMAGES.hero" alt="" ratio="auto" eager class="h-full"
        fallback-class="bg-[#121212] text-bone/20"
      />

      <!-- keeps the text readable on any footage -->
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25 lg:bg-gradient-to-r lg:from-ink/90 lg:via-ink/45 lg:to-ink/10" />
    </div>

    <div class="shell w-full pb-14 pt-24 md:pb-20 lg:py-20">
      <div class="max-w-3xl">
        <p data-hero="eyebrow" class="label text-bone/80">Streetwear &amp; Sportswear</p>

        <h1 id="hero-title" class="mt-5 text-[clamp(3.6rem,13vw,10.5rem)] font-extrabold italic leading-[.88]">
          <span class="block overflow-hidden pb-[.06em] pr-[.1em]"><span data-hero="line" class="block">Wear the</span></span>
          <span class="block overflow-hidden pb-[.06em] pr-[.1em]"><span data-hero="line" class="block text-outline [--outline:#F4F1EC]">Difference.</span></span>
        </h1>

        <span data-hero="streak" class="mt-6 block h-2 w-40 bg-bone md:w-64" style="clip-path: polygon(0 50%, 100% 0, 100% 100%)" aria-hidden="true" />

        <p data-hero="sub" class="mt-7 max-w-md text-[17px] leading-relaxed text-bone/85">
          Premium streetwear and sportswear, cut for people who don't blend in.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          <div data-hero="cta"><BaseButton to="/shop" variant="gold" size="lg">Shop Now <ArrowRight :size="18" /></BaseButton></div>
          <div data-hero="cta"><BaseButton :to="{ path: '/shop', query: { collection: 'new-arrivals' } }" variant="outline-light" size="lg">New Arrivals</BaseButton></div>
        </div>
      </div>
    </div>

    <!-- pause buttons sit ABOVE the background so they can be clicked -->
    <button
      v-if="ytId" type="button"
      class="absolute bottom-5 right-5 grid h-11 w-11 place-items-center border border-bone/60 bg-ink/50 text-bone backdrop-blur transition-colors hover:bg-bone hover:text-ink md:bottom-8 md:right-8"
      :aria-label="ytPlaying ? 'Pause background video' : 'Play background video'"
      @click="ytToggle"
    >
      <Pause v-if="ytPlaying" :size="16" /><Play v-else :size="16" />
    </button>

    <button
      v-else-if="useVideo" type="button"
      class="absolute bottom-5 right-5 grid h-11 w-11 place-items-center border border-bone/60 bg-ink/50 text-bone backdrop-blur transition-colors hover:bg-bone hover:text-ink md:bottom-8 md:right-8"
      :aria-label="playing ? 'Pause background video' : 'Play background video'"
      @click="togglePlay"
    >
      <Pause v-if="playing" :size="16" /><Play v-else :size="16" />
    </button>
  </section>
</template>