<template>
  <Card class="border-border/60 shadow-sm">
    <CardHeader class="space-y-2">
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription> Preencha os dados do veículo e confirme para salvar. </CardDescription>
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
          <Field :data-invalid="!!errors.placa">
            <FieldLabel for="placa">Placa</FieldLabel>
            <Input
              id="placa"
              :model-value="placa"
              type="text"
              inputmode="text"
              maxlength="7"
              placeholder="ABC1D23"
              :aria-invalid="!!errors.placa"
              @input="onPlacaInput"
            />
            <FieldError>
              {{ errors.placa }}
            </FieldError>
          </Field>

          <Field :data-invalid="!!errors.chassi">
            <FieldLabel for="chassi">Chassi</FieldLabel>
            <Input
              id="chassi"
              :model-value="chassi"
              type="text"
              inputmode="text"
              maxlength="17"
              placeholder="9BWZZZ377VT004251"
              :aria-invalid="!!errors.chassi"
              @input="onChassiInput"
            />
            <FieldError>
              {{ errors.chassi }}
            </FieldError>
          </Field>

          <Field :data-invalid="!!errors.marca">
            <FieldLabel for="marca">Marca</FieldLabel>
            <Input
              id="marca"
              v-model="marca"
              type="text"
              placeholder="Ex.: Chevrolet"
              :aria-invalid="!!errors.marca"
            />
            <FieldError>
              {{ errors.marca }}
            </FieldError>
          </Field>

          <Field :data-invalid="!!errors.modelo">
            <FieldLabel for="modelo">Modelo</FieldLabel>
            <Input
              id="modelo"
              v-model="modelo"
              type="text"
              placeholder="Ex.: Onix"
              :aria-invalid="!!errors.modelo"
            />
            <FieldError>
              {{ errors.modelo }}
            </FieldError>
          </Field>

          <Field :data-invalid="!!errors.versao">
            <FieldLabel for="versao">Versão</FieldLabel>
            <Input
              id="versao"
              v-model="versao"
              type="text"
              placeholder="Ex.: LT 1.0 Turbo"
              :aria-invalid="!!errors.versao"
            />
            <FieldError>
              {{ errors.versao }}
            </FieldError>
          </Field>

          <Field :data-invalid="!!errors.cor">
            <FieldLabel for="cor">Cor</FieldLabel>
            <Input
              id="cor"
              v-model="cor"
              type="text"
              placeholder="Ex.: Prata"
              :aria-invalid="!!errors.cor"
            />
            <FieldError>
              {{ errors.cor }}
            </FieldError>
          </Field>

          <Field :data-invalid="!!errors.valor_venda">
            <FieldLabel for="valor_venda">Valor de venda</FieldLabel>
            <Input
              id="valor_venda"
              :model-value="valorVenda"
              type="text"
              inputmode="numeric"
              placeholder="0,00"
              :aria-invalid="!!errors.valor_venda"
              @input="onValorVendaInput"
            />
            <FieldError>
              {{ errors.valor_venda }}
            </FieldError>
          </Field>

          <Field :data-invalid="!!errors.km">
            <FieldLabel for="km">Quilometragem</FieldLabel>
            <Input
              id="km"
              :model-value="km"
              type="text"
              inputmode="numeric"
              placeholder="25000"
              :aria-invalid="!!errors.km"
              @input="onKmInput"
            />
            <FieldError>
              {{ errors.km }}
            </FieldError>
          </Field>

          <Field :data-invalid="!!errors.cambio">
            <FieldLabel for="cambio">Câmbio</FieldLabel>
            <Select v-model="cambio">
              <SelectTrigger id="cambio" class="w-full" :aria-invalid="!!errors.cambio">
                <SelectValue placeholder="Selecione o câmbio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in cambioOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldError>
              {{ errors.cambio }}
            </FieldError>
          </Field>

          <Field :data-invalid="!!errors.combustivel">
            <FieldLabel for="combustivel">Combustível</FieldLabel>
            <Select v-model="combustivel">
              <SelectTrigger id="combustivel" class="w-full" :aria-invalid="!!errors.combustivel">
                <SelectValue placeholder="Selecione o combustível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in combustivelOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldError>
              {{ errors.combustivel }}
            </FieldError>
          </Field>
        </div>

        <div class="flex flex-col gap-2 pt-6 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" @click="$emit('cancel')"> Cancelar </Button>
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getValidationErrors } from '@/lib/api/errors'
import {
  VEHICLE_CAMBIO_LABELS,
  VEHICLE_COMBUSTIVEL_LABELS,
  type Vehicle,
  type VehicleCambio,
  type VehicleCombustivel,
} from '@/features/vehicles/types/vehicle.types.ts'

type VehicleFormSubmitPayload = Pick<
  Vehicle,
  | 'placa'
  | 'chassi'
  | 'marca'
  | 'modelo'
  | 'versao'
  | 'valor_venda'
  | 'cor'
  | 'km'
  | 'cambio'
  | 'combustivel'
>

const PLACA_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/
const CHASSI_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/

const cambioOptions: Array<{ value: VehicleCambio; label: string }> = Object.entries(
  VEHICLE_CAMBIO_LABELS,
).map(([value, label]) => ({
  value: value as VehicleCambio,
  label,
}))

const combustivelOptions: Array<{ value: VehicleCombustivel; label: string }> = Object.entries(
  VEHICLE_COMBUSTIVEL_LABELS,
).map(([value, label]) => ({
  value: value as VehicleCombustivel,
  label,
}))

function normalizePlaca(value: string | number | null | undefined) {
  return String(value ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 7)
}

function normalizeChassi(value: string | number | null | undefined) {
  return String(value ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/[IOQ]/g, '')
    .slice(0, 17)
}

function normalizeInteger(value: string | number | null | undefined) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .replace(/^0+(?=\d)/, '')
}

function formatCurrencyBRLInput(value: string | number | null | undefined) {
  const digits = String(value ?? '').replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const integerValue = Number(digits) / 100

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(integerValue)
}

function parseCurrencyBRL(value: string | number | null | undefined) {
  const normalized = String(value ?? '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()

  return Number(normalized)
}

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    submittingLabel?: string
    initialValues?: Partial<VehicleFormSubmitPayload>
    isSubmitting?: boolean
    apiError?: unknown
  }>(),
  {
    submittingLabel: 'Salvando...',
    initialValues: () => ({}),
    isSubmitting: false,
    apiError: undefined,
  },
)

const emit = defineEmits<{
  (e: 'submit', payload: VehicleFormSubmitPayload): void
  (e: 'cancel'): void
}>()

const vehicleSchema = toTypedSchema(
  z.object({
    placa: z
      .string()
      .transform((value) => normalizePlaca(value))
      .refine((value) => value.length > 0, 'A placa é obrigatória.')
      .refine((value) => PLACA_REGEX.test(value), 'Informe uma placa válida no padrão Mercosul.'),
    chassi: z
      .string()
      .transform((value) => normalizeChassi(value))
      .refine((value) => value.length > 0, 'O chassi é obrigatório.')
      .refine(
        (value) => CHASSI_REGEX.test(value),
        'Informe um chassi válido com 17 caracteres alfanuméricos.',
      ),
    marca: z.string().trim().min(1, 'A marca é obrigatória.'),
    modelo: z.string().trim().min(1, 'O modelo é obrigatório.'),
    versao: z.string().trim(),
    valor_venda: z
      .string()
      .trim()
      .min(1, 'O valor de venda é obrigatório.')
      .refine(
        (value) => !Number.isNaN(parseCurrencyBRL(value)),
        'Informe um valor de venda válido.',
      )
      .refine(
        (value) => parseCurrencyBRL(value) >= 0.01,
        'O valor de venda deve ser no mínimo 0,01.',
      ),
    cor: z.string().trim().min(1, 'A cor é obrigatória.'),
    km: z
      .string()
      .trim()
      .min(1, 'A quilometragem é obrigatória.')
      .refine((value) => /^\d+$/.test(value), 'Informe uma quilometragem inteira válida.')
      .refine((value) => Number(value) >= 0, 'A quilometragem não pode ser negativa.'),
    cambio: z.enum(Object.keys(VEHICLE_CAMBIO_LABELS) as [VehicleCambio, ...VehicleCambio[]], {
      message: 'Selecione um câmbio.',
    }),
    combustivel: z.enum(
      Object.keys(VEHICLE_COMBUSTIVEL_LABELS) as [VehicleCombustivel, ...VehicleCombustivel[]],
      {
        message: 'Selecione um combustível.',
      },
    ),
  }),
)

const { errors, defineField, handleSubmit, resetForm, setErrors, setFieldValue } = useForm({
  validationSchema: vehicleSchema,
  initialValues: {
    placa: '',
    chassi: '',
    marca: '',
    modelo: '',
    versao: '',
    valor_venda: '',
    cor: '',
    km: '',
    cambio: 'manual' as VehicleCambio,
    combustivel: 'gasolina' as VehicleCombustivel,
  },
})

const [placa] = defineField('placa')
const [chassi] = defineField('chassi')
const [marca] = defineField('marca')
const [modelo] = defineField('modelo')
const [versao] = defineField('versao')
const [valorVenda] = defineField('valor_venda')
const [cor] = defineField('cor')
const [km] = defineField('km')
const [cambio] = defineField('cambio')
const [combustivel] = defineField('combustivel')

const errorMessage = computed(() => '')

function onPlacaInput(event: Event) {
  const target = event.target as HTMLInputElement
  setFieldValue('placa', normalizePlaca(target.value))
}

function onChassiInput(event: Event) {
  const target = event.target as HTMLInputElement
  setFieldValue('chassi', normalizeChassi(target.value))
}

function onValorVendaInput(event: Event) {
  const target = event.target as HTMLInputElement
  setFieldValue('valor_venda', formatCurrencyBRLInput(target.value))
}

function onKmInput(event: Event) {
  const target = event.target as HTMLInputElement
  setFieldValue('km', normalizeInteger(target.value))
}

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values: {
        placa: normalizePlaca(values?.placa),
        chassi: normalizeChassi(values?.chassi),
        marca: values?.marca ?? '',
        modelo: values?.modelo ?? '',
        versao: values?.versao ?? '',
        valor_venda: formatCurrencyBRLInput(values?.valor_venda),
        cor: values?.cor ?? '',
        km: normalizeInteger(values?.km),
        cambio: values?.cambio ?? 'manual',
        combustivel: values?.combustivel ?? 'gasolina',
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
      placa: apiErrors.placa?.[0],
      chassi: apiErrors.chassi?.[0],
      marca: apiErrors.marca?.[0],
      modelo: apiErrors.modelo?.[0],
      versao: apiErrors.versao?.[0],
      valor_venda: apiErrors.valor_venda?.[0],
      cor: apiErrors.cor?.[0],
      km: apiErrors.km?.[0],
      cambio: apiErrors.cambio?.[0],
      combustivel: apiErrors.combustivel?.[0],
    })
  },
)

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    placa: normalizePlaca(values.placa),
    chassi: normalizeChassi(values.chassi),
    marca: values.marca.trim(),
    modelo: values.modelo.trim(),
    versao: values.versao.trim() || undefined,
    valor_venda: parseCurrencyBRL(values.valor_venda),
    cor: values.cor.trim(),
    km: Number(values.km),
    cambio: values.cambio,
    combustivel: values.combustivel,
  })
})
</script>
