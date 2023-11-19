import type { Controller } from '@/presentation/contracts'
import { CreateBusinessCanvasController } from '@/presentation/controllers'
import { createBusinessCanvasValidationFactory } from './create-business-canvas-validation-factory'
import { createBusinessCanvasUseCaseFactory } from '@/main/factories/usecases/business-canvas/create-business-canvas-usecase-factory'

export const createBusinessCanvasControllerFactory = (): Controller => {
  return new CreateBusinessCanvasController(
    createBusinessCanvasValidationFactory(),
    createBusinessCanvasUseCaseFactory()
  )
}
