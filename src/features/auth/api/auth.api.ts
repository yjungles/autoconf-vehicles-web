import { apiFetch, backendFetch } from '@/lib/api/client.ts'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth.types'

export function getCsrfCookie() {
  return backendFetch<void>('/sanctum/csrf-cookie')
}

export function login(payload: LoginPayload) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function register(payload: RegisterPayload) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getMe() {
  return apiFetch<User>('/auth/me')
}

export function logout() {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
  })
}
