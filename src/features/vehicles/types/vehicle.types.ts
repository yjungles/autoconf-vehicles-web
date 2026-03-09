import type { PaginatedResponse } from '@/lib/api/types.ts'

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
  created_by?: {
    id: number
    name: string
    email?: string
  } | null
  updated_by?: {
    id: number
    name: string
    email?: string
  } | null
}

export type Vehicle = {
  id: number
  marca: string
  modelo: string
  placa: string
  ano?: number
  km: number
  valor_venda: number
  descricao?: string
  images?: VehicleImage[]
  created_at?: string
  updated_at?: string
  created_by?: VehicleAudit['created_by']
  updated_by?: VehicleAudit['updated_by']
}

export type VehicleFilters = {
  page?: number
  q?: string
  marca?: string
  modelo?: string
  placa?: string
  sort?: 'km' | 'valor_venda'
  direction?: 'asc' | 'desc'
}

export type VehicleListResponse = PaginatedResponse<Vehicle>
