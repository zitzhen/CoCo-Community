<template>
  <div class="page-shell py-14 sm:py-20">
    <div class="mx-auto max-w-4xl">
      <UBreadcrumb v-if="breadcrumbs?.length" :items="breadcrumbs" class="mb-8" />
      <div class="mb-10">
        <UBadge v-if="eyebrow" color="primary" variant="subtle" class="mb-4">{{ eyebrow }}</UBadge>
        <h1 class="text-4xl font-black tracking-tight sm:text-5xl">{{ title }}</h1>
        <p v-if="description" class="mt-4 text-lg leading-8 text-slate-500 dark:text-slate-400">{{ description }}</p>
      </div>
      <div class="surface rounded-3xl p-6 sm:p-10">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  eyebrow?: string
  breadcrumbs?: Array<{ label: string, to?: string }>
}>()
</script>
