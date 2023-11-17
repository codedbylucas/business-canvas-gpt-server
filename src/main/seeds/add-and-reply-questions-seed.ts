import 'module-alias/register'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { addManyQuestionsUseCaseFactory } from '../factories/usecases/question/add-many-questions-usecase-factory'
import { replyQuestionsUseCaseFactory } from '../factories/usecases/question/reply-questions-usecase-factory'

const addAndReplyQuestionsSeed = async (): Promise<void> => {
  await PrismaHelper.connect()
  await addManyQuestionsUseCaseFactory().perform()
  await replyQuestionsUseCaseFactory().perform()
}

export default addAndReplyQuestionsSeed()
  .then(() => { console.log('Questions added to the DB and replicated to the Cache successfully!') })
  .catch(console.error)
  .finally(async () => { await PrismaHelper.disconnect() })
