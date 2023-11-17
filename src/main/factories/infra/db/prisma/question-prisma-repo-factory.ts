import { QuestionPrismaRepo } from '@/infra/db/prisma/question/question-prisma-repo'

export const questionPrismaRepoFactory = (): QuestionPrismaRepo => {
  return new QuestionPrismaRepo()
}
