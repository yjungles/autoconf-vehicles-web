<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getErrorMessage, getValidationErrors } from '@/lib/api/errors'
import { useAuth } from '../composables/useAuth'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const router = useRouter()
const route = useRoute()
const { signIn } = useAuth()

const errorMessage = ref('')

const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .trim()
      .min(1, 'O e-mail é obrigatório.')
      .email('Informe um e-mail válido.'),
    password: z
      .string()
      .min(1, 'A senha é obrigatória.'),
  }),
)

const {
  errors,
  defineField,
  handleSubmit,
  isSubmitting,
  setErrors,
} = useForm({
  validationSchema: loginSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const [email] = defineField('email')
const [password] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await signIn({
      email: values.email,
      password: values.password,
    })

    toast.success('Login realizado com sucesso.')

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/vehicles'
    await router.push(redirect)
  } catch (error) {
    const message = getErrorMessage(error, 'Não foi possível entrar.')
    const validationErrors = getValidationErrors(error)

    setErrors({
      email: validationErrors.email?.[0],
      password: validationErrors.password?.[0],
    })

    toast.error(message)
  }
})
</script>

<template>
  <form :class="cn('flex flex-col gap-6', props.class)" @submit="onSubmit">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">Entrar</h1>
        <p class="text-muted-foreground text-sm text-balance">
          Acesse sua conta para gerenciar veículos
        </p>
      </div>

      <Alert v-if="errorMessage" variant="destructive">
        <AlertTitle>Não foi possível entrar</AlertTitle>
        <AlertDescription>
          {{ errorMessage }}
        </AlertDescription>
      </Alert>

      <Field :data-invalid="!!errors.email">
        <div class="flex items-center">
          <FieldLabel for="email">E-mail</FieldLabel>
        </div>
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="usuario@exemplo.com"
          :aria-invalid="!!errors.email"
        />
        <FieldError>
          {{ errors.email }}
        </FieldError>
      </Field>

      <Field :data-invalid="!!errors.password">
        <div class="flex items-center">
          <FieldLabel for="password">Senha</FieldLabel>
        </div>
        <Input
          id="password"
          v-model="password"
          type="password"
          placeholder="Digite sua senha"
          :aria-invalid="!!errors.password"
        />
        <FieldError>
          {{ errors.password }}
        </FieldError>
      </Field>

      <Field>
        <Button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
        </Button>
      </Field>

      <Field>
        <FieldDescription class="text-center">
          Ainda não tem conta?
          <RouterLink to="/register" class="text-primary font-medium hover:underline">
            Criar conta
          </RouterLink>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>
