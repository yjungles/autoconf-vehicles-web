<template>
  <section class="mx-auto flex w-full flex-col gap-6 p-4 md:p-6">
    <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <h1 class="text-3xl font-semibold tracking-tight">Veículos</h1>
        <p class="text-muted-foreground text-sm">Gerencie os veículos cadastrados na plataforma.</p>
      </div>

      <Button as-child>
        <RouterLink to="/vehicles/new"> Novo veículo </RouterLink>
      </Button>
    </header>

    <Card class="border-border/60 shadow-sm">
      <CardHeader class="gap-3">
        <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div class="space-y-1">
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Busque por texto livre e refine por marca, modelo, placa e ordenação.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-6">
        <FieldGroup class="gap-5">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field>
              <FieldLabel for="q">Busca</FieldLabel>
              <Input
                id="q"
                :model-value="searchForm.q"
                placeholder="Ex.: Onix, hatch, Chevrolet..."
                @update:model-value="updateField('q', $event)"
              />
            </Field>

            <Field>
              <FieldLabel for="marca">Marca</FieldLabel>
              <Input
                id="marca"
                :model-value="searchForm.marca"
                placeholder="Ex.: Fiat"
                @update:model-value="updateField('marca', $event)"
              />
            </Field>

            <Field>
              <FieldLabel for="modelo">Modelo</FieldLabel>
              <Input
                id="modelo"
                :model-value="searchForm.modelo"
                placeholder="Ex.: Argo"
                @update:model-value="updateField('modelo', $event)"
              />
            </Field>

            <Field>
              <FieldLabel for="placa">Placa</FieldLabel>
              <Input
                id="placa"
                :model-value="searchForm.placa"
                placeholder="ABC1D23"
                @update:model-value="updateField('placa', $event)"
              />
            </Field>
          </div>

          <Separator />

          <FieldGroup class="gap-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="space-y-1">
                <FieldLabel>Ordenar por</FieldLabel>
              </div>

              <Button variant="outline" size="sm" type="button" @click="addSort">
                Adicionar ordenação
              </Button>
            </div>

            <div class="space-y-3">
              <div
                v-for="(sort, index) in searchForm.sorts"
                :key="`sort-${index}`"
                class="bg-muted/30 border-border/60 rounded-lg border p-2 mb-2!"
              >
                <div class="flex flex-col md:flex-row gap-4">
                  <Field>
                    <FieldLabel :for="`sort-field-${index}`" class="text-xs">Campo</FieldLabel>
                    <Select
                      :model-value="sort.field"
                      @update:model-value="
                        (value) => updateSortField(index, String(value) ?? DEFAULT_SORT_FIELD)
                      "
                    >
                      <SelectTrigger :id="`sort-field-${index}`" class="w-full bg-background">
                        <SelectValue placeholder="Selecione o campo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">ID</SelectItem>
                        <SelectItem value="km">KM</SelectItem>
                        <SelectItem value="valor_venda">Valor de venda</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel :for="`sort-direction-${index}`" class="text-xs">Direção</FieldLabel>
                    <Select
                      :model-value="sort.direction"
                      @update:model-value="
                        (value) =>
                          updateSortDirection(index, String(value) ?? DEFAULT_SORT_DIRECTION)
                      "
                    >
                      <SelectTrigger :id="`sort-direction-${index}`" class="w-full bg-background">
                        <SelectValue placeholder="Selecione a direção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Crescente</SelectItem>
                        <SelectItem value="desc">Decrescente</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <div class="flex items-end gap-2">
                    <Button
                      variant="outline"
                      type="button"
                      :disabled="searchForm.sorts.length === 1"
                      @click="removeSort(index)"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </FieldGroup>
        </FieldGroup>
      </CardContent>

      <CardFooter class="flex flex-col gap-3 pt-2 md:flex-row md:justify-end md:items-center" >
          <Button class="w-full md:w-fit" variant="outline" type="button" @click="clearFilters"
            >Limpar filtros</Button
          >
          <Button class="w-full md:w-fit "  type="button" @click="applyFilters"
            >Aplicar filtros</Button
          >
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
        <CardDescription>{{ totalLabel }}</CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <div v-if="isLoading" class="flex items-center justify-center py-16">
          <div class="text-muted-foreground text-sm">Carregando veículos...</div>
        </div>

        <div
          v-else-if="!vehicles.length"
          class="flex flex-col items-center justify-center gap-3 py-16 text-center"
        >
          <p class="text-lg font-medium">Nenhum veículo encontrado</p>
          <p class="text-muted-foreground max-w-md text-sm">
            Tente ajustar os filtros ou cadastre um novo veículo.
          </p>
          <Button as-child>
            <RouterLink to="/vehicles/new"> Cadastrar veículo </RouterLink>
          </Button>
        </div>

        <template v-else>
          <div class="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Câmbio</TableHead>
                  <TableHead>Combustível</TableHead>
                  <TableHead class="text-right">KM</TableHead>
                  <TableHead class="text-right">Valor</TableHead>
                  <TableHead class="w-30 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow v-for="vehicle in vehicles" :key="vehicle.id">
                  <TableCell>
                    <Avatar>
                      <AvatarImage :src="getCoverImage(vehicle.images ?? [])" />
                      <AvatarFallback>
                        <Car class="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" class="rounded font-mono text-md">
                      {{ vehicle.placa }}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div class="flex flex-col">
                      <span class="font-medium"> {{ vehicle.marca }} {{ vehicle.modelo }} </span>
                      <span class="text-muted-foreground text-xs">
                        {{ vehicle.versao }}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Cog />
                      {{ getVehicleCambioLabel(vehicle.cambio) }}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Fuel />
                      {{ getVehicleCombustivelLabel(vehicle.combustivel) }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-right">
                    {{ formatKm(vehicle.km) }}
                  </TableCell>
                  <TableCell class="text-right">
                    {{ formatCurrency(vehicle.valor_venda) }}
                  </TableCell>
                  <TableCell class="text-right">
                    <Button variant="outline" size="sm" as-child>
                      <RouterLink :to="`/vehicles/${vehicle.id}`"> Ver detalhes </RouterLink>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </template>
      </CardContent>

      <CardFooter class="flex w-full items-center justify-between gap-4">
        <p class="text-muted-foreground text-sm text-nowrap">
          Página {{ currentPage }} de {{ lastPage }}
        </p>

        <Pagination
          v-slot="{ page }"
          :page="currentPage"
          :total="paginationTotal"
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          show-edges
          @update:page="goToPage"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="`${item.type}-${index}`">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>

              <PaginationEllipsis v-else :index="index" />
            </template>

            <PaginationNext />
          </PaginationContent>
        </Pagination>

        <div class="flex flex-col justify-items-center gap-2 sm:flex-row">
          <span class="text-muted-foreground text-sm text-nowrap">Itens por página</span>
          <Select
            :model-value="String(searchForm.perPage)"
            @update:model-value="(value) => handlePerPageChange(String(value) ?? DEFAULT_PER_PAGE)"
          >
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowUpDown, Car, Cog, Fuel } from 'lucide-vue-next'
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'
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
import {
  getVehicleCambioLabel,
  getVehicleCombustivelLabel,
  type VehicleImage,
  type VehicleSortField,
  type VehicleSortValue,
} from '@/features/vehicles/types/vehicle.types.ts'
import { storageUrl } from '@/utils/storage'

type DirectionValue = 'asc' | 'desc'

type SortFormItem = {
  field: VehicleSortField
  direction: DirectionValue
}

const DEFAULT_SORT_FIELD: VehicleSortField = 'id'
const DEFAULT_SORT_DIRECTION: DirectionValue = 'desc'
const DEFAULT_PER_PAGE = 15

const route = useRoute()
const router = useRouter()

function createDefaultSort(): SortFormItem {
  return {
    field: DEFAULT_SORT_FIELD,
    direction: DEFAULT_SORT_DIRECTION,
  }
}

function parsePage(value: unknown) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

function parsePerPage(value: unknown) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_PER_PAGE
}

function isSortField(value: string): value is VehicleSortField {
  return value === 'id' || value === 'km' || value === 'valor_venda'
}

function parseSortItem(value: string): VehicleSortValue | undefined {
  const normalized = value.trim()
  if (!normalized) return undefined

  const field = normalized.startsWith('-') ? normalized.slice(1) : normalized

  if (!isSortField(field)) return undefined
  return normalized as VehicleSortValue
}

function buildSort(field: VehicleSortField, direction: DirectionValue): VehicleSortValue {
  return `${direction === 'desc' ? '-' : ''}${field}` as VehicleSortValue
}

function parseSort(value: unknown): VehicleSortValue[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [buildSort(DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION)]
  }

  const items = value
    .split(',')
    .map((item) => parseSortItem(item))
    .filter((item): item is VehicleSortValue => Boolean(item))

  return items.length
    ? [...new Set(items)]
    : [buildSort(DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION)]
}

function getSortField(sort: VehicleSortValue): VehicleSortField {
  return (sort.startsWith('-') ? sort.slice(1) : sort) as VehicleSortField
}

function getSortDirection(sort: VehicleSortValue): DirectionValue {
  return sort.startsWith('-') ? 'desc' : 'asc'
}

function buildSortList(sorts: SortFormItem[]) {
  const normalized = sorts
    .map((sort) => buildSort(sort.field, sort.direction))
    .filter((value, index, array) => array.indexOf(value) === index)

  return normalized.length ? normalized : [buildSort(DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION)]
}

function stringifySort(sorts: SortFormItem[]) {
  return buildSortList(sorts).join(',')
}

function mapSortsToFormItems(sorts: VehicleSortValue[]): SortFormItem[] {
  return sorts.map((sort) => ({
    field: getSortField(sort),
    direction: getSortDirection(sort),
  }))
}

const filters = computed(() => ({
  page: parsePage(route.query.page),
  per_page: parsePerPage(route.query.per_page),
  q: typeof route.query.q === 'string' ? route.query.q : '',
  marca: typeof route.query.marca === 'string' ? route.query.marca : '',
  modelo: typeof route.query.modelo === 'string' ? route.query.modelo : '',
  placa: typeof route.query.placa === 'string' ? route.query.placa : '',
  sort: stringifySort(mapSortsToFormItems(parseSort(route.query.sort))),
}))

const searchForm = reactive({
  q: '',
  marca: '',
  modelo: '',
  placa: '',
  sorts: [createDefaultSort()] as SortFormItem[],
  perPage: DEFAULT_PER_PAGE,
})

const formSignature = computed(() =>
  JSON.stringify({
    q: searchForm.q,
    marca: searchForm.marca,
    modelo: searchForm.modelo,
    placa: searchForm.placa,
    sort: stringifySort(searchForm.sorts),
    per_page: searchForm.perPage,
  }),
)

const routeSignature = computed(() =>
  JSON.stringify({
    q: filters.value.q,
    marca: filters.value.marca,
    modelo: filters.value.modelo,
    placa: filters.value.placa,
    sort: filters.value.sort,
    per_page: filters.value.per_page,
  }),
)

const sortPreview = computed(() => stringifySort(searchForm.sorts))

watch(
  filters,
  (value) => {
    const nextSignature = JSON.stringify({
      q: value.q,
      marca: value.marca,
      modelo: value.modelo,
      placa: value.placa,
      sort: value.sort,
      per_page: value.per_page,
    })

    if (nextSignature === formSignature.value) return

    searchForm.q = value.q
    searchForm.marca = value.marca
    searchForm.modelo = value.modelo
    searchForm.placa = value.placa
    searchForm.sorts = mapSortsToFormItems(parseSort(value.sort))
    searchForm.perPage = value.per_page
  },
  { immediate: true },
)

const { data, isLoading, error } = useVehicles(filters)

const vehicles = computed(() => data.value?.data ?? [])
const currentPage = computed(() => data.value?.meta.current_page ?? 1)
const lastPage = computed(() => data.value?.meta.last_page ?? 1)
const itemsPerPage = computed(() => data.value?.meta.per_page ?? searchForm.perPage)
const paginationTotal = computed(() => data.value?.meta.total ?? 0)

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

function addSort() {
  searchForm.sorts = [...searchForm.sorts, createDefaultSort()]
}

function removeSort(index: number) {
  if (searchForm.sorts.length === 1) {
    searchForm.sorts = [createDefaultSort()]
    return
  }

  searchForm.sorts = searchForm.sorts.filter((_, currentIndex) => currentIndex !== index)
}

function updateSortField(index: number, value: string) {
  if (!isSortField(value)) return

  searchForm.sorts = searchForm.sorts.map((sort, currentIndex) =>
    currentIndex === index ? { ...sort, field: value } : sort,
  )
}

function updateSortDirection(index: number, value: string) {
  const direction: DirectionValue = value === 'desc' ? 'desc' : 'asc'

  searchForm.sorts = searchForm.sorts.map((sort, currentIndex) =>
    currentIndex === index ? { ...sort, direction } : sort,
  )
}

async function pushQuery(page = 1) {
  const nextQuery = {
    ...(searchForm.q ? { q: searchForm.q } : {}),
    ...(searchForm.marca ? { marca: searchForm.marca } : {}),
    ...(searchForm.modelo ? { modelo: searchForm.modelo } : {}),
    ...(searchForm.placa ? { placa: searchForm.placa } : {}),
    sort: stringifySort(searchForm.sorts),
    page: String(page),
    per_page: String(searchForm.perPage),
  }

  const nextSignature = JSON.stringify({
    q: nextQuery.q ?? '',
    marca: nextQuery.marca ?? '',
    modelo: nextQuery.modelo ?? '',
    placa: nextQuery.placa ?? '',
    sort: nextQuery.sort,
    per_page: Number(nextQuery.per_page),
  })

  if (page === filters.value.page && nextSignature === routeSignature.value) return

  await router.push({
    name: 'vehicles-list',
    query: nextQuery,
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
  searchForm.sorts = [createDefaultSort()]
  searchForm.perPage = DEFAULT_PER_PAGE

  await pushQuery(1)
}

async function handlePerPageChange(value: string) {
  const nextPerPage = parsePerPage(value)

  if (nextPerPage === searchForm.perPage && filters.value.page === 1) return

  searchForm.perPage = nextPerPage
  await pushQuery(1)
}

async function goToPage(page: number) {
  if (page < 1 || page > lastPage.value || page === currentPage.value) return
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

function getCoverImage(images: VehicleImage[]) {
  const image = images?.find((img) => img.is_cover)?.path ?? null
  if (image) return storageUrl(image)
  return ''
}
</script>
