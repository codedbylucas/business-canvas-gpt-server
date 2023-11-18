import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { addManyQuestionsUseCaseFactory } from '../../factories/usecases/question/add-many-questions-usecase-factory'
import { replyQuestionsUseCaseFactory } from '../../factories/usecases/question/reply-questions-usecase-factory'

export const addAndReplyQuestionsSeed = async (): Promise<void> => {
  const prisma = await PrismaHelper.getCli()
  const questions = await prisma.question.findMany()
  if (!questions || questions.length === 0) {
    await addManyQuestionsUseCaseFactory().perform()
    await replyQuestionsUseCaseFactory().perform()
    console.log('Questions added and replicated successfully!')
  }
  console.log('Questions not added, as they already exist in the DB!')
}
