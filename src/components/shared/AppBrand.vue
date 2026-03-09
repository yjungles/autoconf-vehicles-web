<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    subtitle?: string
    centered?: boolean
  }>(),
  {
    to: '/',
    subtitle: '',
    centered: false,
  },
)
</script>

<template>
  <RouterLink
    :to="to"
    class="flex min-w-0 items-center gap-3"
    :class="centered ? 'justify-center md:justify-start' : ''"
  >
    <div
      class="bg-primary text-primary-foreground flex shrink-0 items-center justify-center rounded-xl font-semibold size-10 text-sm"
    >
      AV
    </div>

    <div class="min-w-0">
      <p class="truncate text-sm font-bold">AUTOCONF <span class="font-light">Vehicles</span></p>
      <p v-if="subtitle" class="text-muted-foreground hidden truncate text-xs sm:block">
        {{ subtitle }}
      </p>
    </div>
  </RouterLink>
</template>
