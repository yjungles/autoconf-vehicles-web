<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown, LogOut, Moon, Sun } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const props = withDefaults(
  defineProps<{
    user?: {
      name?: string
      email?: string
      avatar?: string
    } | null
    theme: 'light' | 'dark' | 'system'
    isLoggingOut?: boolean
  }>(),
  {
    user: null,
    isLoggingOut: false,
  },
)

const emit = defineEmits<{
  toggleTheme: []
  logout: []
}>()

const userName = computed(() => props.user?.name || 'Usuário autenticado')
const userEmail = computed(() => props.user?.email || 'Sessão ativa')

const userInitials = computed(() => {
  const name = props.user?.name?.trim()

  if (!name) {
    return 'AU'
  }

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
})

function handleToggleTheme() {
  emit('toggleTheme')
}

function handleLogout() {
  emit('logout')
}
</script>

<template>
  <nav class="flex items-center gap-2">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          class="border h-auto min-w-55 justify-between rounded-xl px-3 py-2 text-left md:flex"
        >
          <div class="flex min-w-0 items-center gap-3">
            <div
              class="bg-slate-500 text-primary-foreground flex shrink-0 items-center justify-center rounded-xl font-semibold size-9 text-sm"
            >
              {{ userInitials }}
            </div>

            <div class="min-w-0">
              <p class="truncate text-sm font-medium">
                {{ userName }}
              </p>
              <p class="text-muted-foreground truncate text-xs">
                {{ userEmail }}
              </p>
            </div>
          </div>

          <ChevronDown class="text-muted-foreground size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        class="w-[--reka-dropdown-menu-trigger-width] min-w-72 rounded-xl"
        side="bottom"
        :side-offset="8"
      >
        <DropdownMenuLabel class="p-0 font-normal">
          <div class="flex items-center gap-3 px-4 py-3 text-left">
            <div
              class="bg-slate-500 text-primary-foreground flex shrink-0 items-center justify-center rounded-xl font-semibold size-9 text-sm"
            >
              {{ userInitials }}
            </div>

            <div class="min-w-0">
              <p class="truncate text-sm font-medium">
                {{ userName }}
              </p>
              <p class="text-muted-foreground truncate text-xs">
                {{ userEmail }}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem @click="handleToggleTheme" class="px-4 py-3">
          <Sun v-if="theme === 'light'" class="size-4" />
          <Moon v-else class="size-4" />
          {{ theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro' }}
        </DropdownMenuItem>
        <DropdownMenuItem :disabled="isLoggingOut" @click="handleLogout" class="px-4 py-3">
          <LogOut class="size-4" />
          {{ isLoggingOut ? 'Saindo...' : 'Fazer Logout' }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </nav>
</template>
