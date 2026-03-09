import { apiFetch, apiUpload } from '@/lib/api/client.ts'
import type { VehicleImage } from '../types/vehicle.types'

export function uploadVehicleImages(vehicleId: number | string, files: File[]) {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files[]', file)
  })

  return apiUpload<VehicleImage[]>(`/vehicles/${vehicleId}/images`, formData)
}

export function setVehicleCover(vehicleId: number | string, imageId: number | string) {
  return apiFetch<void>(`/vehicles/${vehicleId}/images/${imageId}/cover`, {
    method: 'PATCH',
  })
}

export function deleteVehicleImage(vehicleId: number | string, imageId: number | string) {
  return apiFetch<void>(`/vehicles/${vehicleId}/images/${imageId}`, {
    method: 'DELETE',
  })
}
