<script setup>
import BrandLogo from "@/components/ui/BrandLogo.vue";
import { NAV_LINKS, FOOTER_LINKS } from "@/config/nav";
import { SITE } from "@/config/site";

const year = new Date().getFullYear();
// Only show socials that have real links (placeholders are '#')
const socials = SITE.socials.filter((s) => s.href && s.href !== "#");
</script>

<template>
  <footer class="bg-ink text-bone">
    <div class="shell pt-16 md:pt-24">
      <p
        aria-hidden="true"
        class="text-outline select-none font-display text-[clamp(3rem,12.5vw,11.5rem)] font-extrabold italic uppercase leading-[.85] [--outline:rgba(244,241,236,.28)]"
      >
        Wear the<br />difference.
      </p>

      <div
        class="mt-16 grid gap-12 border-t border-line-dark py-14 md:grid-cols-12"
      >
        <div class="md:col-span-4">
          <BrandLogo inverted class="h-10" />
          <p class="mt-5 max-w-xs text-[14px] leading-relaxed text-bone/70">
            Premium streetwear and sportswear for people who don't blend in.
          </p>
          <address class="mt-6 space-y-1 text-[14px] not-italic text-bone/70">
            <p>
              <a :href="`mailto:${SITE.email}`" class="hover:text-gold">{{
                SITE.email
              }}</a>
            </p>
            <p>{{ SITE.phone }}</p>
            <p>{{ SITE.address }}</p>
            <p>{{ SITE.hours }}</p>
          </address>
        </div>

        <nav aria-label="Shop" class="md:col-span-3 md:col-start-6">
          <h2 class="label mb-5 text-bone">Shop</h2>
          <ul class="space-y-3 text-[14px] text-bone/70">
            <li v-for="l in NAV_LINKS" :key="l.label">
              <RouterLink :to="l.to" class="streak hover:text-bone">{{
                l.label
              }}</RouterLink>
            </li>
          </ul>
        </nav>

        <nav aria-label="Help" class="md:col-span-2">
          <h2 class="label mb-5 text-bone">Help</h2>
          <ul class="space-y-3 text-[14px] text-bone/70">
            <li v-for="l in FOOTER_LINKS.help" :key="l.label">
              <RouterLink :to="l.to" class="streak hover:text-bone">{{
                l.label
              }}</RouterLink>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company" class="md:col-span-2">
          <h2 class="label mb-5 text-bone">Company</h2>
          <ul class="space-y-3 text-[14px] text-bone/70">
            <li v-for="l in FOOTER_LINKS.company" :key="l.label">
              <RouterLink :to="l.to" class="streak hover:text-bone">{{
                l.label
              }}</RouterLink>
            </li>
            <li v-for="s in socials" :key="s.label">
              <a
                :href="s.href"
                target="_blank"
                rel="noopener noreferrer"
                class="streak hover:text-bone"
                >{{ s.label }}</a
              >
            </li>
          </ul>
        </nav>
      </div>

      <div
        class="flex flex-col gap-2 border-t border-line-dark py-6 text-[12px] text-bone/50 sm:flex-row sm:justify-between"
      >
        <p>© {{ year }} {{ SITE.name }}. All rights reserved.</p>
        <p class="uppercase tracking-label">{{ SITE.motto }}</p>
      </div>
    </div>
  </footer>
</template>
