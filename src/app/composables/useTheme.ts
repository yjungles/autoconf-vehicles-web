import { computed, ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme-preference'
const theme = ref<ThemeMode>('light')
let initialized = false

function getSystemTheme(): 'light' | 'dark' {
  return 'light'
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const resolvedTheme = mode === 'system' ? getSystemTheme() : mode

  root.classList.toggle('dark', resolvedTheme === 'dark')
  root.style.colorScheme = resolvedTheme
}

function persistTheme(mode: ThemeMode) {
  localStorage.setItem(STORAGE_KEY, mode)
}

function restoreTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }

  return 'light'
}

function handleSystemThemeChange() {
  if (theme.value === 'system') {
    applyTheme('system')
  }
}

export function useTheme() {
  if (!initialized && typeof window !== 'undefined') {
    initialized = true
    theme.value = restoreTheme()
    applyTheme(theme.value)

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleSystemThemeChange)
  }

  const resolvedTheme = computed(() => {
    if (theme.value === 'system') {
      return getSystemTheme()
    }

    return theme.value
  })

  function setTheme(mode: ThemeMode) {
    theme.value = mode
    persistTheme(mode)
    applyTheme(mode)
  }

  return {
    theme,
    resolvedTheme,
    setTheme,
  }
}
