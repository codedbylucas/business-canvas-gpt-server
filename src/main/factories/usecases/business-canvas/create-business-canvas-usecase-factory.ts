import type { CreateBusinessCanvas } from '@/domain/contracts'
import { CreateBusinessCanvasUseCase } from '@/interactions/usecases/business-canvas/create-business-canvas/create-business-canvas-usecase'
import { businessCanvasOpenAiApiFactory } from '@/main/factories/infra/api/business-canvas-open-ai-api-factory'
import { questionPrismaRepoFactory } from '@/main/factories/infra/db/prisma/question-prisma-repo-factory'
import { addManyAnswersUseCaseFactory } from '../answer/add-many-answers-usecase-factory'
import { addRandomUserUseCaseFactory } from '../user/add-random-user-usecase-factory'
import { addBusinessCanvasUseCaseFactory } from './add-many-answers-usecase-factory'

export const createBusinessCanvasUseCaseFactory = (): CreateBusinessCanvas => {
  return new CreateBusinessCanvasUseCase(
    questionPrismaRepoFactory(),
    addRandomUserUseCaseFactory(),
    addManyAnswersUseCaseFactory(),
    businessCanvasOpenAiApiFactory(),
    addBusinessCanvasUseCaseFactory()
  )
}
