import type { AddManyAnswers } from '@/domain/contracts'
import { AddManyAnswersUseCase } from '@/interactions/usecases/answer'
import { uuidAdapterFactory } from '@/main/factories/infra/id/uuid-adapter-factory'
import { answerPrismaRepoFactory } from '@/main/factories/infra/db/prisma/answer-prisma-repo-factory'

export const addManyAnswersUseCaseFactory = (): AddManyAnswers => {
  return new AddManyAnswersUseCase(
    uuidAdapterFactory(), answerPrismaRepoFactory()
  )
}
