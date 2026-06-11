<template>
  <NuxtLink
    :to="`/control/${encodeURIComponent(control.name)}`"
    class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-blue-500/50"
  >
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 transition group-hover:opacity-100" />
    <div class="flex items-start justify-between gap-4">
      <div class="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500/15 via-violet-500/10 to-cyan-400/15 text-lg font-black text-blue-600 ring-1 ring-blue-500/15 dark:text-blue-300">
        {{ controlInitial(control.name) }}
      </div>
      <UBadge color="neutral" variant="soft" size="sm">
        {{ getControlCategory(control.name) }}
      </UBadge>
    </div>

    <h3 class="mt-5 line-clamp-1 text-lg font-bold tracking-tight text-slate-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
      {{ control.name }}
    </h3>
    <p class="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
      {{ getControlDescription(control) }}
    </p>

    <div class="mt-5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <UIcon name="i-lucide-circle-user-round" class="size-4" />
      <span class="truncate">{{ control.author }}</span>
    </div>

    <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
      <span class="flex items-center gap-1.5">
        <UIcon name="i-lucide-download" class="size-3.5" />
        {{ formatNumber(control.downloads) }}
      </span>
      <span class="flex items-center gap-1.5">
        <UIcon name="i-lucide-heart" class="size-3.5" />
        {{ formatNumber(control.likes) }}
      </span>
      <span class="flex items-center gap-1.5">
        <UIcon name="i-lucide-eye" class="size-3.5" />
        {{ formatNumber(control.Pageviews) }}
      </span>
      <UIcon name="i-lucide-arrow-up-right" class="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ControlItem } from '~/types/community'

defineProps<{ control: ControlItem }>()
</script>
