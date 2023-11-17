import type { Controller } from '@/presentation/contracts'
import { CreateBusinessCanvasController } from '@/presentation/controllers/create-business-canvas/create-business-canvas-controller'
import { createBusinessCanvasValidationFactory } from './create-business-canvas-validation-factory'
import { createBusinessCanvasUseCaseFactory } from '../../usecases/business-canvas/create-business-canvas-usecase-factory'

export const createBusinessCanvasControllerFactory = (): Controller => {
  return new CreateBusinessCanvasController(
    createBusinessCanvasValidationFactory(),
    createBusinessCanvasUseCaseFactory()
  )
}
