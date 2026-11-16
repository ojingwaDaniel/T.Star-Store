<script setup>
import { ArrowRight } from "lucide-vue-next";
import AppImage from "@/components/ui/AppImage.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import StarIcon from "@/components/ui/StarIcon.vue";
import { IMAGES } from "@/mock/images";

// PLACEHOLDER COPY: replace every string on this page with your real brand story.
const PILLARS = [
  [
    "01",
    "Quality",
    "Heavyweight fabrics, clean finishing and details that hold up wash after wash.",
  ],
  [
    "02",
    "Individuality",
    "Cuts and details chosen to stand out. We design for people who dress on purpose.",
  ],
  [
    "03",
    "Confidence",
    "Clothing should make you stand taller the moment you put it on.",
  ],
];
</script>

<template>
  <div>
    <section
      class="relative isolate overflow-hidden bg-ink text-bone"
      aria-labelledby="about-title"
    >
      <StarIcon
        :size="820"
        :filled="false"
        :stroke-width="0.35"
        class="pointer-events-none absolute -right-48 -top-20 -z-10 text-bone/[0.07]"
      />
      <div class="shell pb-16 pt-14 md:pb-24 md:pt-24">
        <p class="label text-gold-light">About T.STAR</p>
        <h1
          id="about-title"
          class="mt-5 text-[clamp(3.6rem,13vw,11rem)] font-extrabold italic leading-[.86]"
        >
          Wear the <span class="text-gold">difference.</span>
        </h1>
        <p
          v-reveal
          class="mt-8 max-w-xl text-[18px] leading-relaxed text-bone/75"
        >
          T.STAR is premium streetwear and sportswear for people who refuse to
          blend in.
        </p>
      </div>
    </section>

    <div class="shell -mt-8 md:-mt-14">
      <AppImage
        :src="IMAGES.aboutHero"
        alt="The T.STAR team at work"
        ratio="16/9"
        position="center 15%"
        eager
        sizes="(min-width:1440px) 1344px, 100vw"
      />
    </div>

    <section class="section-y" aria-labelledby="story-title">
      <div class="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div v-reveal class="lg:col-span-4">
          <AppImage
            :src="IMAGES.aboutPortrait"
            alt="T.STAR founder portrait"
            ratio="3/4"
            sizes="(min-width:1024px) 30vw, 90vw"
          />
        </div>
        <div class="lg:col-span-7 lg:col-start-6">
          <div v-reveal>
            <p class="label-gold">Our story</p>
            <h2 id="story-title" class="mt-3 text-5xl md:text-7xl">
              Built on a simple belief.
            </h2>
            <p class="mt-7 max-w-xl text-[17px] leading-relaxed text-graphite">
              What you wear should say something about you. T.STAR started as an
              idea about clothing with attitude: sharp lines, serious fabrics
              and a little speed built into every cut.
            </p>
            <p class="mt-5 max-w-xl text-[17px] leading-relaxed text-graphite">
              The star in our logo cuts through the wordmark like it's already
              moving. That's the energy we design for: confident, forward and
              impossible to mistake for anyone else.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section
      class="edge-slant-both bg-ink py-24 text-bone md:py-36"
      aria-labelledby="motto-title"
    >
      <div class="shell text-center">
        <p class="label text-gold-light">Our motto</p>
        <h2
          id="motto-title"
          v-reveal
          class="mt-5 text-[clamp(3rem,10vw,9rem)] font-extrabold italic leading-[.88]"
        >
          Wear the<br /><span class="text-gold">difference.</span>
        </h2>
        <p
          v-reveal="{ delay: 120 }"
          class="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-bone/75"
        >
          It's not a slogan on a label. It's the standard every piece has to
          meet: be different, feel different, and look like you meant it.
        </p>
      </div>
    </section>

    <section class="section-y" aria-labelledby="values-title">
      <div class="shell">
        <div v-reveal class="mb-12 max-w-xl">
          <p class="label-gold">What we stand for</p>
          <h2 id="values-title" class="mt-3 text-5xl md:text-7xl">
            Our values
          </h2>
        </div>
        <ul class="grid gap-px border border-line bg-line md:grid-cols-3">
          <li
            v-for="([n, title, text], i) in PILLARS"
            :key="n"
            v-reveal="{ delay: i * 100 }"
            class="bg-bone p-8 md:p-10"
          >
            <p class="font-display text-6xl font-extrabold italic text-gold">
              {{ n }}
            </p>
            <h3 class="mt-6 text-4xl">{{ title }}</h3>
            <p class="mt-4 text-[15px] leading-relaxed text-graphite">
              {{ text }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <section
      class="border-t border-line bg-white section-y"
      aria-labelledby="vision-title"
    >
      <div class="shell grid gap-10 lg:grid-cols-12">
        <div v-reveal class="lg:col-span-5">
          <p class="label-gold">Vision</p>
          <h2 id="vision-title" class="mt-3 text-5xl md:text-6xl">
            Where we're headed
          </h2>
        </div>
        <div v-reveal="{ delay: 100 }" class="lg:col-span-6 lg:col-start-7">
          <p class="text-[17px] leading-relaxed text-graphite">
            We want T.STAR to be the name people think of first for streetwear
            and sportswear that looks as good as it performs, designed with care
            and made to last.
          </p>
          <p class="mt-5 text-[17px] leading-relaxed text-graphite">
            Every collection is a step toward that: better fabrics, better fits
            and a better experience from the first click to the moment your
            order arrives.
          </p>
          <div class="mt-9 flex flex-wrap gap-4">
            <BaseButton to="/shop" size="lg"
              >Shop the collection <ArrowRight :size="16"
            /></BaseButton>
            <BaseButton to="/contact" variant="outline" size="lg"
              >Get in touch</BaseButton
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
