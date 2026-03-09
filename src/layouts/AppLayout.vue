<template>
  <div class="bg-muted/20 min-h-screen">
    <header
      class="flex flex-col items-center justify-center w-full sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div
        class="flex flex-row items-center justify-between mx-auto w-full max-w-7xl min-h-16 px-6"
      >
        <AppBrand to="/vehicles" subtitle="Painel administrativo" />

        <NavUser
          :user="user"
          :theme="theme"
          :is-logging-out="isLoggingOut"
          @toggle-theme="toggleTheme"
          @logout="onLogoutClick"
        />
      </div>
    </header>

    <main class="mx-auto flex w-full justify-center px-4 py-6 md:px-6">
      <div class="w-full max-w-7xl">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useTheme } from '@/app/composables/useTheme'
import AppBrand from '@/components/shared/AppBrand.vue'
import NavUser from '@/components/shared/NavUser.vue'
import { useAuth } from '@/features/auth/composables/useAuth'
import { getErrorMessage } from '@/lib/api/errors'

const router = useRouter()
const { user, signOut } = useAuth()
const { theme, setTheme } = useTheme()

const isLoggingOut = ref(false)

function toggleTheme() {
  setTheme(theme.value === 'light' ? 'dark' : 'light')
}

async function onLogoutClick() {
  try {
    isLoggingOut.value = true
    await signOut()
    toast.success('Sessão encerrada com sucesso.')
    await router.push('/login')
  } catch (error) {
    toast.error(getErrorMessage(error, 'Não foi possível sair da aplicação.'))
  } finally {
    isLoggingOut.value = false
  }
}
</script>
