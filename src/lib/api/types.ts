export type PaginationMeta = {
  current_page: number
  from: number
  last_page: number
  links: { url: string | null; label: string; active: boolean }[]
  path: string
  per_page: number
  to: number
  total: number
}

export type PaginationLinks = {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export type PaginatedResponse<T> = {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}

export type SingleResponse<T> = {
  data: T
}
