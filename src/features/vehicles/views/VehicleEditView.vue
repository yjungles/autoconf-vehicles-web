<template>
  <section class="mx-auto flex w-full flex-col gap-6 p-4 md:p-6">
    <header class="space-y-1">
      <h1 class="text-3xl font-semibold tracking-tight">Editar veículo</h1>
      <p class="text-muted-foreground text-sm">Atualize as informações do veículo selecionado.</p>
    </header>

    <Alert v-if="vehicleError" variant="destructive">
      <AlertTitle>Erro ao carregar veículo</AlertTitle>
      <AlertDescription>
        {{ vehicleErrorMessage }}
      </AlertDescription>
    </Alert>

    <div v-else-if="isLoading" class="text-muted-foreground rounded-lg border p-6 text-sm">
      Carregando dados do veículo...
    </div>

    <VehicleForm
      v-else-if="vehicle"
      title="Dados do veículo"
      submit-label="Salvar alterações"
      submitting-label="Salvando..."
      :initial-values="{
        placa: vehicle.placa,
        chassi: vehicle.chassi,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        versao: vehicle.versao ?? '',
        valor_venda: vehicle.valor_venda,
        cor: vehicle.cor,
        km: vehicle.km,
        cambio: vehicle.cambio,
        combustivel: vehicle.combustivel,
      }"
      :is-submitting="updateMutation.isPending.value"
      :api-error="submitError"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import VehicleForm from '@/features/vehicles/components/VehicleForm.vue'
import { getErrorMessage } from '@/lib/api/errors'
import { updateVehicle } from '../api/vehicles.api'
import { useVehicle } from '../composables/useVehicle'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

const vehicleId = computed(() => String(route.params.id))
const submitError = ref<unknown>(null)

const { vehicle, isLoading, error: vehicleError } = useVehicle(vehicleId)

const vehicleErrorMessage = computed(() =>
  vehicleError.value
    ? getErrorMessage(vehicleError.value, 'Não foi possível carregar o veículo.')
    : '',
)

const updateMutation = useMutation({
  mutationFn: (payload: Parameters<typeof updateVehicle>[1]) =>
    updateVehicle(vehicleId.value, payload),
  onSuccess: async (response) => {
    await queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    await queryClient.invalidateQueries({ queryKey: ['vehicle', vehicleId.value] })
    toast.success('Veículo atualizado com sucesso.')
    await router.push(`/vehicles/${response.data.id}`)
  },
})

async function handleSubmit(payload: Parameters<typeof updateVehicle>[1]) {
  try {
    submitError.value = null
    await updateMutation.mutateAsync(payload)
  } catch (error) {
    submitError.value = error
    toast.error(getErrorMessage(error, 'Não foi possível atualizar o veículo.'))
  }
}

async function handleCancel() {
  await router.push(`/vehicles/${vehicleId.value}`)
}
</script>
