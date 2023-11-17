import { AnswerPrismaRepo } from '@/infra/db/prisma/answer/answer-prisma-repo'

export const answerPrismaRepoFactory = (): AnswerPrismaRepo => {
  return new AnswerPrismaRepo()
}
