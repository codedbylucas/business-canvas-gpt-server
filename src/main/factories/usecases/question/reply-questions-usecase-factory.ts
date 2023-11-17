import type { ReplyQuestions } from '@/domain/contracts'
import { ReplyQuestionsUseCase } from '@/interactions/usecases/question'
import { questionRedisCacheFactory } from '@/main/factories/infra/cache/question-redis-cache-factory'
import { questionPrismaRepoFactory } from '@/main/factories/infra/db/prisma/question-prisma-repo-factory'

export const replyQuestionsUseCaseFactory = (): ReplyQuestions => {
  return new ReplyQuestionsUseCase(questionPrismaRepoFactory(), questionRedisCacheFactory())
}
