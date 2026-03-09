<template>
  <Card class="border-border/60 shadow-sm">
    <CardHeader class="space-y-2">
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>
        Preencha os dados do veículo e confirme para salvar.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form class="space-y-6" @submit="onSubmit">
        <Alert v-if="errorMessage" variant="destructive">
          <AlertTitle>Não foi possível salvar</AlertTitle>
          <AlertDescription>
            {{ errorMessage }}
          </AlertDescription>
        </Alert>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="marca">Marca</Label>
            <Input
              id="marca"
              v-model="marca"
              type="text"
              placeholder="Ex.: Chevrolet"
              :aria-invalid="!!errors.marca"
            />
            <p v-if="errors.marca" class="text-destructive text-sm">
              {{ errors.marca }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="modelo">Modelo</Label>
            <Input
              id="modelo"
              v-model="modelo"
              type="text"
              placeholder="Ex.: Onix"
              :aria-invalid="!!errors.modelo"
            />
            <p v-if="errors.modelo" class="text-destructive text-sm">
              {{ errors.modelo }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="placa">Placa</Label>
            <Input
              id="placa"
              v-model="placa"
              type="text"
              placeholder="ABC1D23"
              :aria-invalid="!!errors.placa"
            />
            <p v-if="errors.placa" class="text-destructive text-sm">
              {{ errors.placa }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="ano">Ano</Label>
            <Input
              id="ano"
              v-model="ano"
              type="number"
              placeholder="2024"
              :aria-invalid="!!errors.ano"
            />
            <p v-if="errors.ano" class="text-destructive text-sm">
              {{ errors.ano }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="km">Quilometragem</Label>
            <Input
              id="km"
              v-model="km"
              type="number"
              min="0"
              placeholder="25000"
              :aria-invalid="!!errors.km"
            />
            <p v-if="errors.km" class="text-destructive text-sm">
              {{ errors.km }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="valor_venda">Valor de venda</Label>
            <Input
              id="valor_venda"
              v-model="valorVenda"
              type="number"
              min="0"
              step="0.01"
              placeholder="69990.00"
              :aria-invalid="!!errors.valor_venda"
            />
            <p v-if="errors.valor_venda" class="text-destructive text-sm">
              {{ errors.valor_venda }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            v-model="descricao"
            rows="5"
            placeholder="Descreva o estado, opcionais e observações do veículo"
            :aria-invalid="!!errors.descricao"
          />
          <p v-if="errors.descricao" class="text-destructive text-sm">
            {{ errors.descricao }}
          </p>
        </div>

        <div class="flex flex-col gap-2 border-t pt-6 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" @click="$emit('cancel')">
            Cancelar
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? submittingLabel : submitLabel }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getValidationErrors } from '@/lib/api/errors'

type VehicleFormValues = {
  marca: string
  modelo: string
  placa: string
  ano: string | number
  km: string | number
  valor_venda: string | number
  descricao: string
}

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    submittingLabel?: string
    initialValues?: Partial<VehicleFormValues>
    isSubmitting?: boolean
    apiError?: unknown
  }>(),
  {
    submittingLabel: 'Salvando...',
    initialValues: () => ({}),
    isSubmitting: false,
    apiError: null,
  },
)

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      marca: string
      modelo: string
      placa: string
      ano?: number
      km: number
      valor_venda: number
      descricao?: string
    },
  ): void
  (e: 'cancel'): void
}>()

const vehicleSchema = toTypedSchema(
  z.object({
    marca: z.string().trim().min(1, 'A marca é obrigatória.'),
    modelo: z.string().trim().min(1, 'O modelo é obrigatório.'),
    placa: z.string().trim().min(1, 'A placa é obrigatória.'),
    ano: z
      .union([z.string(), z.number()])
      .optional()
      .transform((value) => String(value ?? '').trim())
      .refine((value) => value === '' || /^\d{4}$/.test(value), 'Informe um ano válido com 4 dígitos.'),
    km: z
      .union([z.string(), z.number()])
      .transform((value) => String(value).trim())
      .refine((value) => value !== '', 'A quilometragem é obrigatória.')
      .refine((value) => !Number.isNaN(Number(value)), 'Informe uma quilometragem válida.')
      .refine((value) => Number(value) >= 0, 'A quilometragem não pode ser negativa.'),
    valor_venda: z
      .union([z.string(), z.number()])
      .transform((value) => String(value).trim())
      .refine((value) => value !== '', 'O valor de venda é obrigatório.')
      .refine((value) => !Number.isNaN(Number(value)), 'Informe um valor de venda válido.')
      .refine((value) => Number(value) >= 0, 'O valor de venda não pode ser negativo.'),
    descricao: z.string().trim().optional(),
  }),
)

const {
  errors,
  defineField,
  handleSubmit,
  resetForm,
  setErrors,
} = useForm({
  validationSchema: vehicleSchema,
  initialValues: {
    marca: '',
    modelo: '',
    placa: '',
    ano: '',
    km: '',
    valor_venda: '',
    descricao: '',
  },
})

const [marca] = defineField('marca')
const [modelo] = defineField('modelo')
const [placa] = defineField('placa')
const [ano] = defineField('ano')
const [km] = defineField('km')
const [valorVenda] = defineField('valor_venda')
const [descricao] = defineField('descricao')

const errorMessage = computed(() => '')

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values: {
        marca: values?.marca ?? '',
        modelo: values?.modelo ?? '',
        placa: values?.placa ?? '',
        ano: values?.ano ?? '',
        km: values?.km ?? '',
        valor_venda: values?.valor_venda ?? '',
        descricao: values?.descricao ?? '',
      },
    })
  },
  { immediate: true, deep: true },
)

watch(
  () => props.apiError,
  () => {
    const apiErrors = getValidationErrors(props.apiError)

    setErrors({
      marca: apiErrors.marca?.[0],
      modelo: apiErrors.modelo?.[0],
      placa: apiErrors.placa?.[0],
      ano: apiErrors.ano?.[0],
      km: apiErrors.km?.[0],
      valor_venda: apiErrors.valor_venda?.[0],
      descricao: apiErrors.descricao?.[0],
    })
  },
)

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    marca: values.marca.trim(),
    modelo: values.modelo.trim(),
    placa: values.placa.trim().toUpperCase(),
    ano: String(values.ano).trim() ? Number(values.ano) : undefined,
    km: Number(values.km),
    valor_venda: Number(values.valor_venda),
    descricao: values.descricao?.trim() || undefined,
  })
})
</script>
