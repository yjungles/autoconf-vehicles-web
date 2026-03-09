export type ApiValidationErrors = Record<string, string[]>

type ApiErrorShape = {
  message?: string
  errors?: ApiValidationErrors
}

export function getErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.') {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object') {
    const apiError = error as ApiErrorShape

    if (typeof apiError.message === 'string' && apiError.message.trim().length > 0) {
      return apiError.message
    }
  }

  return fallback
}

export function getValidationErrors(error: unknown): ApiValidationErrors {
  if (error && typeof error === 'object') {
    const apiError = error as ApiErrorShape

    if (apiError.errors && typeof apiError.errors === 'object') {
      return apiError.errors
    }
  }

  return {}
}

export function getFieldError(error: unknown, field: string): string {
  const errors = getValidationErrors(error)
  return errors[field]?.[0] ?? ''
}
