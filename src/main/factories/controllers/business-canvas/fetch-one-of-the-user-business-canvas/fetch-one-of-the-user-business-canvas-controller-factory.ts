import type { Controller } from '@/presentation/contracts'
import { fetchOneOfTheUserBusinessCanvasUseCaseFactory } from '@/main/factories/usecases/business-canvas/fetch-all-one-the-user-business-canvas-usecase-factory'
import { FetchOneOfTheUserBusinessCanvasController } from '@/presentation/controllers'
import { uuidTypeValidationFactory } from '@/main/factories/validations'

export const fetchOneOfTheUserBusinessCanvasControllerFactory = (): Controller => {
  return new FetchOneOfTheUserBusinessCanvasController(
    uuidTypeValidationFactory('businessCanvasId'),
    fetchOneOfTheUserBusinessCanvasUseCaseFactory()
  )
}
