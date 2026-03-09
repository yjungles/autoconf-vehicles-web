import type { PaginatedResponse } from '@/lib/api/types.ts'
import type { User } from '@/features/auth/types/auth.types.ts'

export type VehicleImage = {
  id: number
  url: string
  path: string
  is_cover: boolean
  created_at?: string
  updated_at?: string
}

export type VehicleAudit = {
  created_at?: string
  updated_at?: string
  created_by?: User | null
  updated_by?: User | null
}

export type VehicleCambio = 'manual' | 'automatico'

export type VehicleCombustivel =
  | 'gasolina'
  | 'alcool'
  | 'flex'
  | 'diesel'
  | 'hibrido'
  | 'eletrico'

export const VEHICLE_CAMBIO_LABELS = {
  manual: 'Manual',
  automatico: 'Automático',
} as const satisfies Record<VehicleCambio, string>

export const VEHICLE_COMBUSTIVEL_LABELS = {
  gasolina: 'Gasolina',
  alcool: 'Álcool',
  flex: 'Flex',
  diesel: 'Diesel',
  hibrido: 'Híbrido',
  eletrico: 'Elétrico',
} as const satisfies Record<VehicleCombustivel, string>

export function getVehicleCambioLabel(value: VehicleCambio) {
  return VEHICLE_CAMBIO_LABELS[value]
}

export function getVehicleCombustivelLabel(value: VehicleCombustivel) {
  return VEHICLE_COMBUSTIVEL_LABELS[value]
}

export type Vehicle = {
  id: number
  placa: string
  chassi: string
  marca: string
  modelo: string
  versao?: string
  valor_venda: number
  cor: string
  km: number
  cambio: VehicleCambio
  combustivel: VehicleCombustivel
  images?: VehicleImage[]
  created_at?: string
  updated_at?: string
  created_by?: VehicleAudit['created_by']
  updated_by?: VehicleAudit['updated_by']
}

export type VehicleSortField = 'id' | 'km' | 'valor_venda'
export type VehicleSortValue = VehicleSortField | `-${VehicleSortField}`

export type VehicleFilters = {
  page?: number
  per_page?: number
  q?: string
  marca?: string
  modelo?: string
  placa?: string
  sort?: string
}

export type VehicleListResponse = PaginatedResponse<Vehicle>
