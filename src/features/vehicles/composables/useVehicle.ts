import { useQuery } from '@tanstack/vue-query'
import { computed, unref, type MaybeRef } from 'vue'
import { getVehicle } from '../api/vehicles.api'

export function useVehicle(id: MaybeRef<number | string>) {
  const vehicleId = computed(() => unref(id))

  const query = useQuery({
    queryKey: computed(() => ['vehicle', String(vehicleId.value)]),
    queryFn: () => getVehicle(vehicleId.value),
    enabled: computed(() => !!vehicleId.value),
  })

  const vehicle = computed(() => query.data.value?.data)

  return { ...query, vehicle }
}
