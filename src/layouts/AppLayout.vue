<template>
  <div class="bg-muted/20 min-h-screen">
    <header
      class="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-30 border-b backdrop-blur"
    >
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <RouterLink to="/vehicles" class="flex items-center gap-3">
          <div
            class="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold"
          >
            AV
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold">AutoConf Vehicles</span>
            <span class="text-muted-foreground text-xs">Painel administrativo</span>
          </div>
        </RouterLink>

        <nav class="flex items-center gap-2">
          <div class="ms-auto items-center gap-1 p-1 md:flex">
            <Button
              size="icon"
              variant="outline"
              @click="setTheme(theme === 'light' ? 'dark' : 'light')"
              class="rounded-lg border"
            >
              <Sun v-if="theme === 'light'" class="size-4" />
              <Moon v-else class="size-4" />
            </Button>
          </div>

          <div class="hidden text-right md:block">
            <p class="text-sm font-medium">
              {{ user?.name || 'Usuário autenticado' }}
            </p>
            <p class="text-muted-foreground text-xs">
              {{ user?.email || 'Sessão ativa' }}
            </p>
          </div>

          <Button variant="outline" :disabled="isLoggingOut" @click="handleLogout">
            {{ isLoggingOut ? 'Saindo...' : 'Sair' }}
          </Button>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useTheme } from '@/app/composables/useTheme'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/composables/useAuth'
import { getErrorMessage } from '@/lib/api/errors'
import { Sun, Moon } from 'lucide-vue-next'

const router = useRouter()
const { user, signOut } = useAuth()
const { theme, setTheme } = useTheme()

const isLoggingOut = ref(false)

async function handleLogout() {
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
