import type { Controller } from '@/presentation/contracts'
import { fetchAllOfTheUserBusinessCanvasUseCaseFactory } from '@/main/factories/usecases/business-canvas/fetch-all-of-the-user-business-canvas-usecase-factory'
import { FetchAllOfTheUserBusinessCanvasController } from '@/presentation/controllers'

export const fetchAllOfTheUserBusinessCanvasControllerFactory = (): Controller => {
  return new FetchAllOfTheUserBusinessCanvasController(
    fetchAllOfTheUserBusinessCanvasUseCaseFactory()
  )
}
