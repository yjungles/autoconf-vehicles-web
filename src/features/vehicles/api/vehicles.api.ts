import { apiFetch } from '@/lib/api/client.ts'
import type { Vehicle, VehicleFilters, VehicleListResponse } from '../types/vehicle.types'
import type { SingleResponse } from '@/lib/api/types.ts'

export function listVehicles(filters: VehicleFilters) {
  return apiFetch<VehicleListResponse>('/vehicles', {
    params: filters,
  })
}

export function getVehicle(id: number | string) {
  return apiFetch<SingleResponse<Vehicle>>(`/vehicles/${id}`)
}

export function createVehicle(payload: Partial<Vehicle>) {
  return apiFetch<SingleResponse<Vehicle>>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateVehicle(id: number | string, payload: Partial<Vehicle>) {
  return apiFetch<SingleResponse<Vehicle>>(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteVehicle(id: number | string) {
  return apiFetch<void>(`/vehicles/${id}`, {
    method: 'DELETE',
  })
}
