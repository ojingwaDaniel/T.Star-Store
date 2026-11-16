<script setup>
import Skeleton from "@/components/ui/Skeleton.vue";
</script>

<template>
  <div aria-hidden="true">
    <Skeleton class="aspect-[4/5] w-full" />
    <Skeleton class="mt-4 h-3 w-16" />
    <Skeleton class="mt-2.5 h-5 w-3/4" />
    <Skeleton class="mt-2.5 h-4 w-24" />
  </div>
</template>
