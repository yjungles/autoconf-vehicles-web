<template>
  <div class="space-y-6">
    <div class="space-y-3">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-lg font-semibold">Imagens do veículo</h3>
          <p class="text-muted-foreground text-sm">
            Faça upload de múltiplas imagens, defina a capa e exclua arquivos.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <Input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            class="max-w-xs"
            @change="handleFileChange"
          />
          <Button
            :disabled="!selectedFiles.length || uploadMutation.isPending.value"
            @click="handleUpload"
          >
            {{ uploadMutation.isPending.value ? 'Enviando...' : 'Enviar' }}
          </Button>
        </div>
      </div>

      <Alert v-if="uploadErrorMessage" variant="destructive">
        <AlertTitle>Erro no upload</AlertTitle>
        <AlertDescription>
          {{ uploadErrorMessage }}
        </AlertDescription>
      </Alert>
    </div>

    <div
      v-if="!images.length"
      class="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm"
    >
      Nenhuma imagem cadastrada para este veículo.
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card v-for="image in images" :key="image.id" class="overflow-hidden py-0">
        <div class="bg-muted aspect-4/3 overflow-hidden">
          <img
            :src="storageUrl(image.path)"
            :alt="`Imagem ${image.id} do veículo`"
            class="h-full w-full object-cover"
          />
        </div>

        <CardContent class="space-y-4 p-4">
          <div class="flex items-center justify-between gap-2">
            <Badge :variant="image.is_cover ? 'default' : 'secondary'">
              {{ image.is_cover ? 'Capa' : 'Imagem' }}
            </Badge>

            <span class="text-muted-foreground text-xs"> ID #{{ image.id }} </span>
          </div>

          <div class="flex flex-col gap-2">
            <Button
              variant="outline"
              :disabled="image.is_cover || setCoverMutation.isPending.value"
              @click="handleSetCover(image.id)"
            >
              {{ image.is_cover ? 'Imagem de capa' : 'Definir como capa' }}
            </Button>

            <Dialog>
              <DialogTrigger as-child>
                <Button variant="destructive"> Excluir imagem </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Excluir imagem</DialogTitle>
                  <DialogDescription>
                    Essa ação não pode ser desfeita. Deseja realmente excluir esta imagem?
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <DialogClose as-child>
                    <Button variant="outline"> Cancelar </Button>
                  </DialogClose>

                  <Button
                    variant="destructive"
                    :disabled="deleteImageMutation.isPending.value"
                    @click="handleDeleteImage(image.id)"
                  >
                    {{
                      deleteImageMutation.isPending.value ? 'Excluindo...' : 'Confirmar exclusão'
                    }}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/api/errors'
import { useVehicleImages } from '../composables/useVehicleImages'
import type { VehicleImage } from '../types/vehicle.types'
import { storageUrl } from '@/utils/storage'

const props = defineProps<{
  vehicleId: number | string
  images: VehicleImage[]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])

const { uploadMutation, setCoverMutation, deleteImageMutation } = useVehicleImages(props.vehicleId)

const uploadErrorMessage = computed(() =>
  uploadMutation.error.value
    ? getErrorMessage(uploadMutation.error.value, 'Não foi possível enviar as imagens.')
    : '',
)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  selectedFiles.value = Array.from(target.files ?? [])
}

async function handleUpload() {
  if (!selectedFiles.value.length) return

  try {
    await uploadMutation.mutateAsync(selectedFiles.value)
    toast.success('Imagens enviadas com sucesso.')
    selectedFiles.value = []

    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    toast.error(getErrorMessage(error, 'Não foi possível enviar as imagens.'))
  }
}

async function handleSetCover(imageId: number) {
  try {
    await setCoverMutation.mutateAsync(imageId)
    toast.success('Imagem de capa atualizada com sucesso.')
  } catch (error) {
    toast.error(getErrorMessage(error, 'Não foi possível definir a imagem de capa.'))
  }
}

async function handleDeleteImage(imageId: number) {
  try {
    await deleteImageMutation.mutateAsync(imageId)
    toast.success('Imagem excluída com sucesso.')
  } catch (error) {
    toast.error(getErrorMessage(error, 'Não foi possível excluir a imagem.'))
  }
}
</script>
