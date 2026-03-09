<template>
  <section class="mx-auto flex w-full flex-col gap-6 p-4 md:p-6">
    <Alert v-if="error" variant="destructive">
      <AlertTitle>Erro ao carregar veículo</AlertTitle>
      <AlertDescription>
        {{ errorMessage }}
      </AlertDescription>
    </Alert>

    <div v-else-if="isLoading" class="text-muted-foreground rounded-lg border p-6 text-sm">
      Carregando veículo...
    </div>

    <template v-else-if="vehicle">
      <header class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-3xl font-semibold tracking-tight">
              {{ vehicle.marca }} {{ vehicle.modelo }}
            </h1>
            <Badge variant="secondary">
              {{ vehicle.placa }}
            </Badge>
          </div>

          <p class="text-muted-foreground text-sm">
            Visualize os dados, auditoria e imagens do veículo.
          </p>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" as-child>
            <RouterLink to="/vehicles"> Voltar </RouterLink>
          </Button>

          <Button as-child v-if="canEdit">
            <RouterLink :to="`/vehicles/${vehicle.id}/edit`"> Editar </RouterLink>
          </Button>

          <Dialog v-if="canEdit">
            <DialogTrigger as-child>
              <Button variant="destructive"> Excluir veículo </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir veículo</DialogTitle>
                <DialogDescription>
                  Essa ação não pode ser desfeita. Deseja realmente excluir este veículo?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose as-child>
                  <Button variant="outline"> Cancelar </Button>
                </DialogClose>

                <Button
                  variant="destructive"
                  :disabled="deleteMutation.isPending.value"
                  @click="handleDeleteVehicle"
                >
                  {{ deleteMutation.isPending.value ? 'Excluindo...' : 'Confirmar exclusão' }}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div class="grid gap-6 xl:grid-cols-4">
        <Card class="xl:col-span-4">
          <CardHeader>
            <CardTitle>Dados do veículo</CardTitle>
            <CardDescription> Informações principais do cadastro. </CardDescription>
          </CardHeader>

          <CardContent class="grid gap-4 md:grid-cols-4">
            <div>
              <p class="text-muted-foreground text-sm">Marca</p>
              <p class="font-medium">{{ vehicle.marca }}</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Modelo</p>
              <p class="font-medium">{{ vehicle.modelo }}</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Versão</p>
              <p class="font-medium">{{ vehicle.versao ?? '-' }}</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Placa</p>
              <p class="font-medium">{{ vehicle.placa }}</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Chassi</p>
              <p class="font-medium">{{ vehicle.chassi }}</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Cor</p>
              <p class="font-medium">{{ vehicle.cor }}</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Quilometragem</p>
              <p class="font-medium">{{ formatKm(vehicle.km) }} km</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Valor de venda</p>
              <p class="font-medium">{{ formatCurrency(vehicle.valor_venda) }}</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Câmbio</p>
              <p class="font-medium">{{ getVehicleCambioLabel(vehicle.cambio) }}</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Combustível</p>
              <p class="font-medium">{{ getVehicleCombustivelLabel(vehicle.combustivel) }}</p>
            </div>
          </CardContent>
          <CardFooter class="border-t grid gap-4 md:grid-cols-4">
            <div>
              <p class="text-muted-foreground">Criado em</p>
              <p class="font-medium">{{ formatDate(vehicle.created_at) }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Criado por</p>
              <p class="font-medium">{{ vehicle.created_by?.name ?? '-' }}</p>
            </div>

            <div>
              <p class="text-muted-foreground">Atualizado em</p>
              <p class="font-medium">
                {{ vehicle.updated_by?.name ? formatDate(vehicle.updated_at) : '-' }}
              </p>
            </div>

            <div>
              <p class="text-muted-foreground">Atualizado por</p>
              <p class="font-medium">{{ vehicle.updated_by?.name ?? '-' }}</p>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardContent>
          <VehicleImageGallery :vehicle-id="vehicle.id" :images="vehicle.images ?? []" />
        </CardContent>
      </Card>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getErrorMessage } from '@/lib/api/errors'
import {
  getVehicleCambioLabel,
  getVehicleCombustivelLabel,
} from '@/features/vehicles/types/vehicle.types.ts'
import VehicleImageGallery from '../components/VehicleImageGallery.vue'
import { deleteVehicle } from '../api/vehicles.api'
import { useVehicle } from '../composables/useVehicle'
import { useAuth } from '@/features/auth/composables/useAuth.ts'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

const canEdit = computed(() => {
  return vehicle.value?.created_by?.id === user.value?.id || !!user.value?.is_admin
})

const queryClient = useQueryClient()
const vehicleId = computed(() => String(route.params.id))
const { vehicle, isLoading, error } = useVehicle(vehicleId)

const errorMessage = computed(() =>
  error.value ? getErrorMessage(error.value, 'Não foi possível carregar o veículo.') : '',
)

const deleteMutation = useMutation({
  mutationFn: () => deleteVehicle(vehicleId.value),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['vehicles'] })
  },
})

async function handleDeleteVehicle() {
  try {
    await deleteMutation.mutateAsync()
    toast.success('Veículo excluído com sucesso.')
    await router.push('/vehicles')
  } catch (mutationError) {
    toast.error(getErrorMessage(mutationError, 'Não foi possível excluir o veículo.'))
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatKm(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value)
}

function formatDate(value?: string) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}
</script>
