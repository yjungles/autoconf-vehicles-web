<script setup lang="ts">
import carSalesmanImage from '@/assets/images/car-sales.jpg'
import AppBrand from '@/components/shared/AppBrand.vue'
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <AppBrand centered />
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <RouterView />
        </div>
      </div>
    </div>
    <div class="bg-muted relative hidden lg:block">
      <img
        :src="carSalesmanImage"
        alt="Image"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  </div>
</template>
