import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const { user, isAuthenticated, isBootstrapping } = storeToRefs(authStore)

  return {
    user,
    isAuthenticated,
    isBootstrapping,
    signIn: authStore.signIn,
    signUp: authStore.signUp,
    signOut: authStore.signOut,
    fetchMe: authStore.fetchMe,
  }
}
