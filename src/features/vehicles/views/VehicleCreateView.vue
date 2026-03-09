<template>
  <section class="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
    <header class="space-y-1">
      <h1 class="text-3xl font-semibold tracking-tight">Cadastrar veículo</h1>
      <p class="text-muted-foreground text-sm">
        Preencha os dados abaixo para cadastrar um novo veículo.
      </p>
    </header>

    <VehicleForm
      title="Novo veículo"
      submit-label="Cadastrar veículo"
      submitting-label="Cadastrando..."
      :is-submitting="createMutation.isPending.value"
      :api-error="submitError"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import VehicleForm from '@/features/vehicles/components/VehicleForm.vue'
import { createVehicle } from '../api/vehicles.api'
import { getErrorMessage } from '@/lib/api/errors'

const router = useRouter()
const queryClient = useQueryClient()
const submitError = ref<unknown>(null)

const createMutation = useMutation({
  mutationFn: createVehicle,
  onSuccess: async (vehicle) => {
    await queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    toast.success('Veículo cadastrado com sucesso.')
    await router.push(`/vehicles/${vehicle.id}`)
  },
})

async function handleSubmit(payload: Parameters<typeof createVehicle>[0]) {
  try {
    submitError.value = null
    await createMutation.mutateAsync(payload)
  } catch (error) {
    submitError.value = error
    toast.error(getErrorMessage(error, 'Não foi possível cadastrar o veículo.'))
  }
}

async function handleCancel() {
  await router.push('/vehicles')
}
</script>
