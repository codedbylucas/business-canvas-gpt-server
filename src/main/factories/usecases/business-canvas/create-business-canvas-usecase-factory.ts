import type { CreateBusinessCanvas } from '@/domain/contracts'
import { CreateBusinessCanvasUseCase } from '@/interactions/usecases/business-canvas'
import { businessCanvasOpenAiApiFactory } from '@/main/factories/infra/api/business-canvas-open-ai-api-factory'
import { questionRedisCacheFactory } from '@/main/factories/infra/cache/question-redis-cache-factory'
import { addManyAnswersUseCaseFactory } from '../answer/add-many-answers-usecase-factory'
import { addRandomUserUseCaseFactory } from '../user/add-random-user-usecase-factory'
import { addBusinessCanvasUseCaseFactory } from './add-many-answers-usecase-factory'

export const createBusinessCanvasUseCaseFactory = (): CreateBusinessCanvas => {
  return new CreateBusinessCanvasUseCase(
    questionRedisCacheFactory(),
    addRandomUserUseCaseFactory(),
    addManyAnswersUseCaseFactory(),
    businessCanvasOpenAiApiFactory(),
    addBusinessCanvasUseCaseFactory()
  )
}
