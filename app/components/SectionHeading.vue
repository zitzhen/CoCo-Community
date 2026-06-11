<template>
  <div :class="center ? 'mx-auto text-center' : ''" class="max-w-2xl">
    <UBadge v-if="eyebrow" color="primary" variant="subtle" class="mb-4">
      {{ eyebrow }}
    </UBadge>
    <h2 class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  eyebrow?: string
  center?: boolean
}>()
</script>
