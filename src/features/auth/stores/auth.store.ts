import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getCsrfCookie, getMe, login, logout, register } from '../api/auth.api'
import type { LoginPayload, RegisterPayload, User } from '../types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isBootstrapping = ref(false)
  const isStateKnown = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function signIn(payload: LoginPayload) {
    await getCsrfCookie()
    const response = await login(payload)
    user.value = response.user
    return response
  }

  async function signUp(payload: RegisterPayload) {
    const response = await register(payload)
    await signIn({
      email: payload.email,
      password: payload.password,
    })
    user.value = response.user
    return response
  }

  async function fetchMe() {
    if (isAuthenticated.value) return
    try {
      isBootstrapping.value = true
      user.value = await getMe()
    } catch {
      user.value = null
    } finally {
      isBootstrapping.value = false
      isStateKnown.value = true
    }
  }

  async function signOut() {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      isBootstrapping.value = false
      isStateKnown.value = true
    }
  }

  return {
    user,
    isAuthenticated,
    isBootstrapping,
    isStateKnown,
    signIn,
    signUp,
    signOut,
    fetchMe,
  }
})
