import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { addAllComponentsSeed } from './add-all-components/add-all-components-seed'
import { addAndReplyQuestionsSeed } from './add-and-reply-questions/add-and-reply-questions-seed'

export const executeSeeds = async (): Promise<void> => {
  await PrismaHelper.connect()
  await addAllComponentsSeed()
  await addAndReplyQuestionsSeed()
}

executeSeeds()
  .then()
  .catch(console.error)
  .finally(async () => { await PrismaHelper.disconnect() })
