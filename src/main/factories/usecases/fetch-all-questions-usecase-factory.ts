import type { FetchAllQuestions } from '@/domain/contracts'
import { FetchAllQuestionsUseCase } from '@/interactions/usecases/question'
import { questionRedisCacheFactory } from '../infra/cache/question-redis-cache-factory'

export const fetchAllQuestionsUseCaseFactory = (): FetchAllQuestions => {
  return new FetchAllQuestionsUseCase(questionRedisCacheFactory())
}
