import type { Controller } from '@/presentation/contracts'
import { FetchAllQuestionsController } from '@/presentation/controllers/question/fetch-all-questions-controller'
import { fetchAllQuestionsUseCaseFactory } from '@/main/factories/usecases/question/fetch-all-questions-usecase-factory'

export const fetchAllQuestionsControllerFactory = (): Controller => {
  return new FetchAllQuestionsController(fetchAllQuestionsUseCaseFactory())
}
