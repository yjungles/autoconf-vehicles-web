import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteVehicleImage, setVehicleCover, uploadVehicleImages } from '../api/vehicle-images.api'

export function useVehicleImages(vehicleId: number | string) {
  const queryClient = useQueryClient()

  const invalidateVehicle = async () => {
    await queryClient.invalidateQueries({ queryKey: ['vehicle', String(vehicleId)] })
    await queryClient.invalidateQueries({ queryKey: ['vehicles'] })
  }

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => uploadVehicleImages(vehicleId, files),
    onSuccess: invalidateVehicle,
  })

  const setCoverMutation = useMutation({
    mutationFn: (imageId: number | string) => setVehicleCover(vehicleId, imageId),
    onSuccess: invalidateVehicle,
  })

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number | string) => deleteVehicleImage(vehicleId, imageId),
    onSuccess: invalidateVehicle,
  })

  return {
    uploadMutation,
    setCoverMutation,
    deleteImageMutation,
  }
}
