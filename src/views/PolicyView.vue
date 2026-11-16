<script setup>
import { computed } from "vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import { POLICIES, fillPolicyText as fill } from "@/config/policies";
import { ZONES, STATES } from "@/config/locations";
import { useSeo } from "@/composables/useSeo";
import { slugify } from "@/utils/slugify";
import { formatNaira } from "@/utils/currency";

const props = defineProps({ page: { type: String, required: true } });

const policy = computed(() => POLICIES[props.page] || null);
useSeo(
  computed(() =>
    policy.value
      ? { title: policy.value.title, description: fill(policy.value.intro) }
      : null,
  ),
);

// Built from the same config the checkout uses, so this page can never disagree with it
const zones = computed(() =>
  Object.entries(ZONES).map(([key, z]) => ({
    key,
    fee: z.fee,
    days: z.days,
    states: STATES.filter((s) => s.zone === key).map((s) => s.name),
  })),
);
</script>

<template>
  <EmptyState
    v-if="!policy"
    title="Page not found"
    action-label="Back to home"
    :action-to="{ name: 'home' }"
  />

  <div v-else>
    <header class="border-b border-line bg-white">
      <div class="shell py-10 md:py-14">
        <p class="label-gold">Information</p>
        <h1 class="mt-3 text-6xl md:text-8xl">{{ policy.title }}</h1>
        <p class="mt-4 max-w-xl text-graphite">{{ fill(policy.intro) }}</p>
        <p class="mt-3 text-[13px] text-graphite">
          Last updated {{ policy.updated }}
        </p>
      </div>
    </header>

    <div class="shell grid gap-10 py-10 lg:grid-cols-12 lg:gap-16 lg:py-16">
      <nav class="hidden lg:col-span-3 lg:block" aria-label="On this page">
        <ul
          class="sticky top-28 space-y-3 border-l border-line pl-5 text-[14px]"
        >
          <li v-for="s in policy.sections" :key="s.heading">
            <a
              :href="`#${slugify(s.heading)}`"
              class="text-graphite transition-colors hover:text-ink"
              >{{ s.heading }}</a
            >
          </li>
        </ul>
      </nav>

      <article class="max-w-3xl lg:col-span-8 lg:col-start-5">
        <p
          v-if="policy.draft"
          class="mb-10 border border-gold bg-white p-4 text-[14px] leading-relaxed"
          role="note"
        >
          <strong>Draft policy.</strong> This is template text and has not been
          reviewed by a lawyer. Review and edit it in
          <code>src/config/policies.js</code>, then set
          <code>draft: false</code> to remove this notice.
        </p>

        <section
          v-for="s in policy.sections"
          :key="s.heading"
          class="mb-12 last:mb-0"
        >
          <h2 :id="slugify(s.heading)" class="scroll-mt-28 text-4xl">
            {{ s.heading }}
          </h2>
          <p
            v-for="p in s.paragraphs"
            :key="p"
            class="mt-4 text-[16px] leading-relaxed text-graphite"
          >
            {{ fill(p) }}
          </p>

          <ul
            v-if="s.list"
            class="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-graphite"
          >
            <li v-for="li in s.list" :key="li">{{ fill(li) }}</li>
          </ul>

          <div v-if="s.type === 'zones'" class="mt-6 overflow-x-auto">
            <table
              class="w-full min-w-[34rem] border-collapse text-left text-[14px]"
            >
              <caption class="sr-only">
                Delivery fees and times by zone
              </caption>
              <thead>
                <tr class="border-b-2 border-ink">
                  <th
                    scope="col"
                    class="py-3 pr-4 text-[11px] font-semibold uppercase tracking-label"
                  >
                    Zone
                  </th>
                  <th
                    scope="col"
                    class="py-3 pr-4 text-[11px] font-semibold uppercase tracking-label"
                  >
                    Fee
                  </th>
                  <th
                    scope="col"
                    class="py-3 pr-4 text-[11px] font-semibold uppercase tracking-label"
                  >
                    Estimated time
                  </th>
                  <th
                    scope="col"
                    class="py-3 text-[11px] font-semibold uppercase tracking-label"
                  >
                    States
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="z in zones"
                  :key="z.key"
                  class="border-b border-line align-top"
                >
                  <th scope="row" class="py-4 pr-4 font-semibold">
                    Zone {{ z.key }}
                  </th>
                  <td class="py-4 pr-4 tabular-nums">
                    {{ formatNaira(z.fee) }}
                  </td>
                  <td class="py-4 pr-4">
                    {{ z.days[0] }} to {{ z.days[1] }} working days
                  </td>
                  <td class="py-4 text-graphite">{{ z.states.join(", ") }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>
