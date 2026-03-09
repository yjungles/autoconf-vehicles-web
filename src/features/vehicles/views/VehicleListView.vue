<template>
  <section class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
    <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <h1 class="text-3xl font-semibold tracking-tight">Veículos</h1>
        <p class="text-muted-foreground text-sm">
          Gerencie os veículos cadastrados na plataforma.
        </p>
      </div>

      <Button as-child>
        <RouterLink to="/vehicles/new">
          Novo veículo
        </RouterLink>
      </Button>
    </header>

    <Card>
      <CardHeader class="gap-2">
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Busque por texto livre e refine por marca, modelo, placa e ordenação.
        </CardDescription>
      </CardHeader>

      <CardContent class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div class="space-y-2 xl:col-span-2">
          <Label for="q">Busca</Label>
          <Input
            id="q"
            :model-value="searchForm.q"
            placeholder="Ex.: Onix, hatch, Chevrolet..."
            @update:model-value="updateField('q', $event)"
          />
        </div>

        <div class="space-y-2">
          <Label for="marca">Marca</Label>
          <Input
            id="marca"
            :model-value="searchForm.marca"
            placeholder="Ex.: Fiat"
            @update:model-value="updateField('marca', $event)"
          />
        </div>

        <div class="space-y-2">
          <Label for="modelo">Modelo</Label>
          <Input
            id="modelo"
            :model-value="searchForm.modelo"
            placeholder="Ex.: Argo"
            @update:model-value="updateField('modelo', $event)"
          />
        </div>

        <div class="space-y-2">
          <Label for="placa">Placa</Label>
          <Input
            id="placa"
            :model-value="searchForm.placa"
            placeholder="ABC1D23"
            v-mask
            @update:model-value="updateField('placa', $event)"
          />
        </div>

        <div class="space-y-2">
          <Label>Ordenar por</Label>
          <Select :model-value="searchForm.sort || 'km'" @update:model-value="updateSort">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="km">KM</SelectItem>
              <SelectItem value="valor_venda">Valor de venda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label>Direção</Label>
          <Select :model-value="searchForm.direction" @update:model-value="updateDirection">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Crescente</SelectItem>
              <SelectItem value="desc">Decrescente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardFooter class="flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">


        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button variant="outline" @click="clearFilters">
            Limpar filtros
          </Button>
          <Button @click="applyFilters">
            Aplicar filtros
          </Button>
        </div>
      </CardFooter>
    </Card>

    <Alert v-if="error" variant="destructive">
      <AlertTitle>Erro ao carregar veículos</AlertTitle>
      <AlertDescription>
        {{ errorMessage }}
      </AlertDescription>
    </Alert>

    <Card>
      <CardHeader class="gap-1">
        <CardTitle>Lista de veículos</CardTitle>
        <CardDescription v-if="data">
          {{ totalLabel }}
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <div v-if="isLoading" class="flex items-center justify-center py-16">
          <div class="text-muted-foreground text-sm">
            Carregando veículos...
          </div>
        </div>

        <div v-else-if="!vehicles.length" class="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p class="text-lg font-medium">Nenhum veículo encontrado</p>
          <p class="text-muted-foreground max-w-md text-sm">
            Tente ajustar os filtros ou cadastre um novo veículo.
          </p>
          <Button as-child>
            <RouterLink to="/vehicles/new">
              Cadastrar veículo
            </RouterLink>
          </Button>
        </div>

        <template v-else>
          <div class="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead class="text-right">KM</TableHead>
                  <TableHead class="text-right">Valor</TableHead>
                  <TableHead class="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow v-for="vehicle in vehicles" :key="vehicle.id">
                  <TableCell>
                    <div class="flex flex-col">
                      <span class="font-medium">
                        {{ vehicle.marca }} {{ vehicle.modelo }}
                      </span>
                      <span class="text-muted-foreground text-xs">
                        ID #{{ vehicle.id }}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{{ vehicle.placa }}</TableCell>

                  <TableCell class="text-right">
                    {{ formatKm(vehicle.km) }}
                  </TableCell>

                  <TableCell class="text-right">
                    {{ formatCurrency(vehicle.valor_venda) }}
                  </TableCell>

                  <TableCell class="text-right">
                    <Button variant="outline" size="sm" as-child>
                      <RouterLink :to="`/vehicles/${vehicle.id}`">
                        Ver detalhes
                      </RouterLink>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div class="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-muted-foreground text-sm">
              Página {{ currentPage }} de {{ lastPage }}
            </p>

            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                :disabled="currentPage <= 1"
                @click="goToPage(currentPage - 1)"
              >
                Anterior
              </Button>

              <Button
                variant="outline"
                :disabled="currentPage >= lastPage"
                @click="goToPage(currentPage + 1)"
              >
                Próxima
              </Button>
            </div>
          </div>
        </template>
      </CardContent>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getErrorMessage } from '@/lib/api/errors'
import { useVehicles } from '../composables/useVehicles'

type SortValue = 'km' | 'valor_venda'
type DirectionValue = 'asc' | 'desc'

const route = useRoute()
const router = useRouter()

const filters = computed(() => ({
  page: route.query.page ? Number(route.query.page) : 1,
  q: typeof route.query.q === 'string' ? route.query.q : '',
  marca: typeof route.query.marca === 'string' ? route.query.marca : '',
  modelo: typeof route.query.modelo === 'string' ? route.query.modelo : '',
  placa: typeof route.query.placa === 'string' ? route.query.placa : '',
  sort: route.query.sort === 'km' || route.query.sort === 'valor_venda'
    ? route.query.sort
    : undefined,
  direction: route.query.direction === 'desc' ? 'desc' : 'asc',
}))

const searchForm = reactive({
  q: '',
  marca: '',
  modelo: '',
  placa: '',
  sort: 'km' as SortValue,
  direction: 'asc' as DirectionValue,
})

watch(
  filters,
  (value) => {
    searchForm.q = value.q ?? ''
    searchForm.marca = value.marca ?? ''
    searchForm.modelo = value.modelo ?? ''
    searchForm.placa = value.placa ?? ''
    searchForm.sort = (value.sort ?? 'km') as SortValue
    searchForm.direction = value.direction ?? 'asc'
  },
  { immediate: true },
)

const { data, isLoading, error } = useVehicles(filters)

const vehicles = computed(() => data.value?.data ?? [])
const currentPage = computed(() => data.value?.meta.current_page ?? 1)
const lastPage = computed(() => data.value?.meta.last_page ?? 1)

const totalLabel = computed(() => {
  if (!data.value) return 'Carregando resultados...'

  const total = data.value.meta.total ?? vehicles.value.length
  return `${total} veículo${total === 1 ? '' : 's'} encontrado${total === 1 ? '' : 's'}`
})

const errorMessage = computed(() =>
  error.value ? getErrorMessage(error.value, 'Não foi possível carregar os veículos.') : '',
)

function updateField(field: 'q' | 'marca' | 'modelo' | 'placa', value: string | number) {
  searchForm[field] = String(value)
}

function updateSort(value: string) {
  searchForm.sort = (value as SortValue) || 'km'
}

function updateDirection(value: string) {
  searchForm.direction = (value as DirectionValue) || 'asc'
}

async function pushQuery(page = 1) {
  await router.push({
    name: 'vehicles-list',
    query: {
      ...(searchForm.q ? { q: searchForm.q } : {}),
      ...(searchForm.marca ? { marca: searchForm.marca } : {}),
      ...(searchForm.modelo ? { modelo: searchForm.modelo } : {}),
      ...(searchForm.placa ? { placa: searchForm.placa } : {}),
      ...(searchForm.sort ? { sort: searchForm.sort } : {}),
      ...(searchForm.direction ? { direction: searchForm.direction } : {}),
      page: String(page),
    },
  })
}

async function applyFilters() {
  await pushQuery(1)
}

async function clearFilters() {
  searchForm.q = ''
  searchForm.marca = ''
  searchForm.modelo = ''
  searchForm.placa = ''
  searchForm.sort = 'km'
  searchForm.direction = 'asc'

  await router.push({
    name: 'vehicles-list',
    query: {
      sort: 'km',
      direction: 'asc',
      page: '1',
    },
  })
}

async function goToPage(page: number) {
  await pushQuery(page)
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
</script>
