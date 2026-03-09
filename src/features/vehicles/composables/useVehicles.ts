import { useQuery } from '@tanstack/vue-query'
import { computed, unref, type MaybeRef } from 'vue'
import { listVehicles } from '../api/vehicles.api'
import type { VehicleFilters } from '../types/vehicle.types'

export function useVehicles(filters: MaybeRef<VehicleFilters>) {
  const normalizedFilters = computed(() => unref(filters))

  return useQuery({
    queryKey: computed(() => ['vehicles', normalizedFilters.value]),
    queryFn: () => listVehicles(normalizedFilters.value),
  })
}
