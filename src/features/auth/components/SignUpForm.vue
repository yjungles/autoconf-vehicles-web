<template>
  <form :class="cn('flex flex-col gap-6', props.class)" @submit="onSubmit">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">Crie sua conta</h1>
        <p class="text-muted-foreground text-sm text-balance">
          Preencha o formulário abaixo para criar sua conta
        </p>
      </div>
      <Alert v-if="errorMessage" variant="destructive">
        <AlertDescription>
          {{ errorMessage }}
        </AlertDescription>
      </Alert>

      <Field :data-invalid="!!errors.name">
        <FieldLabel for="name">Nome</FieldLabel>
        <Input
          id="name"
          v-model="name"
          type="text"
          placeholder="Seu nome"
          :aria-invalid="!!errors.name"
        />
        <FieldError>
          {{ errors.name }}
        </FieldError>
      </Field>

      <Field :data-invalid="!!errors.email">
        <FieldLabel for="email">E-mail</FieldLabel>
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="voce@exemplo.com"
          :aria-invalid="!!errors.email"
        />
        <FieldError>
          {{ errors.email }}
        </FieldError>
      </Field>

      <Field :data-invalid="!!errors.password">
        <FieldLabel for="password">Senha</FieldLabel>
        <Input
          id="password"
          v-model="password"
          type="password"
          placeholder="Crie uma senha"
          :aria-invalid="!!errors.password"
        />
        <FieldError>
          {{ errors.password }}
        </FieldError>
      </Field>

      <Field :data-invalid="!!errors.password_confirmation">
        <FieldLabel for="password_confirmation">Confirmar senha</FieldLabel>
        <Input
          id="password_confirmation"
          v-model="passwordConfirmation"
          type="password"
          placeholder="Repita a senha"
          :aria-invalid="!!errors.password_confirmation"
        />
        <FieldError>
          {{ errors.password_confirmation }}
        </FieldError>
      </Field>

      <Field>
        <Button type="submit" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? 'Criando conta...' : 'Criar conta' }}
        </Button>
      </Field>

      <Field>
        <FieldDescription class="px-6 text-center">
          Já possui uma conta?
          <RouterLink to="/login" class="text-primary font-medium hover:underline">
            Entrar
          </RouterLink>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from 'vue-router'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getErrorMessage, getValidationErrors } from '@/lib/api/errors'
import { useAuth } from '../composables/useAuth'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const router = useRouter()
const { signUp } = useAuth()

const errorMessage = ref('')

const signUpSchema = toTypedSchema(
  z
    .object({
      name: z.string().trim().min(1, 'O nome é obrigatório.'),
      email: z
        .string()
        .trim()
        .min(1, 'O e-mail é obrigatório.')
        .email('Informe um e-mail válido.'),
      password: z
        .string()
        .min(1, 'A senha é obrigatória.')
        .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
      password_confirmation: z.string().min(1, 'Confirme sua senha.'),
    })
    .refine((values) => values.password === values.password_confirmation, {
      path: ['password_confirmation'],
      message: 'As senhas não coincidem.',
    }),
)

const {
  errors,
  defineField,
  handleSubmit,
  isSubmitting,
  setErrors,
} = useForm({
  validationSchema: signUpSchema,
  initialValues: {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  },
})

const [name] = defineField('name')
const [email] = defineField('email')
const [password] = defineField('password')
const [passwordConfirmation] = defineField('password_confirmation')

const onSubmit = handleSubmit(async (values) => {
  try {
    errorMessage.value = ''

    await signUp({
      name: values.name,
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
    })

    toast.success('Conta criada com sucesso.')
    await router.push('/vehicles')
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Não foi possível criar a conta.')

    const validationErrors = getValidationErrors(error)
    setErrors({
      name: validationErrors.name?.[0],
      email: validationErrors.email?.[0],
      password: validationErrors.password?.[0],
      password_confirmation: validationErrors.password_confirmation?.[0],
    })

    toast.error(errorMessage.value)
  }
})
</script>
