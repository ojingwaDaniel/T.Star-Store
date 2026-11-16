<script setup>
import AppImage from "@/components/ui/AppImage.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import StarIcon from "@/components/ui/StarIcon.vue";
import { IMAGES } from "@/mock/images";

// PLACEHOLDER copy. Replace with your real story.
const VALUES = [
  [
    "Quality",
    "Heavy fabrics, clean finishing, pieces that last past the season.",
  ],
  ["Individuality", "Cuts and details chosen to stand out, never to blend in."],
  [
    "Confidence",
    "Clothing that makes you stand taller the moment you put it on.",
  ],
];
</script>

<template>
  <section class="section-y bg-white" aria-labelledby="story-title">
    <div class="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
      <div v-reveal class="relative lg:col-span-5">
        <div
          class="absolute -bottom-4 -left-4 h-full w-full border-2 border-gold"
          aria-hidden="true"
        />
        <div
          class="relative [clip-path:polygon(0_0,100%_0,100%_92%,88%_100%,0_100%)]"
        >
          <AppImage
            :src="IMAGES.brandStory"
            alt="Behind the scenes with the T.STAR team"
            ratio="3/4"
            sizes="(min-width:1024px) 40vw, 90vw"
          />
        </div>
      </div>

      <div class="lg:col-span-6 lg:col-start-7">
        <div v-reveal>
          <p class="label-gold">The T.STAR story</p>
          <h2 id="story-title" class="mt-3 text-5xl md:text-7xl">
            Not made to blend in.
          </h2>
          <p class="mt-6 max-w-lg text-[17px] leading-relaxed text-graphite">
            T.STAR began with a simple belief: what you wear should say
            something about you. We design streetwear and sportswear with sharp
            lines, serious fabrics and a little speed built in.
          </p>
          <p class="mt-4 max-w-lg text-[17px] leading-relaxed text-graphite">
            Wear the difference is more than a line on a label. It's the
            standard we hold every piece to.
          </p>
        </div>

        <ul class="mt-9 grid gap-6 sm:grid-cols-3">
          <li
            v-for="([title, text], i) in VALUES"
            :key="title"
            v-reveal="{ delay: 100 + i * 100 }"
          >
            <StarIcon :size="18" class="text-gold" />
            <h3 class="mt-3 text-2xl">{{ title }}</h3>
            <p class="mt-2 text-[14px] leading-relaxed text-graphite">
              {{ text }}
            </p>
          </li>
        </ul>

        <div class="mt-10">
          <BaseButton to="/about" variant="outline">Our story</BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
