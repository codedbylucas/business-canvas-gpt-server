import type { AddManyQuestions } from '@/domain/contracts'
import { AddManyQuestionsUseCase } from '@/interactions/usecases/question'
import { questionPrismaRepoFactory } from '@/main/factories/infra/db/prisma/question-prisma-repo-factory'
import { uuidAdapterFactory } from '@/main/factories/infra/id/uuid-adapter-factory'

export const addManyQuestionsUseCaseFactory = (): AddManyQuestions => {
  return new AddManyQuestionsUseCase(
    uuidAdapterFactory(), questionPrismaRepoFactory()
  )
}
