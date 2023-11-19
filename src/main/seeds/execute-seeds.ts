import 'module-alias/register'
import { addAllComponentsSeed } from './add-all-components/add-all-components-seed'
import { addAndReplyQuestionsSeed } from './add-and-reply-questions/add-and-reply-questions-seed'

export const executeSeeds = async (): Promise<void> => {
  await addAllComponentsSeed()
  await addAndReplyQuestionsSeed()
}

executeSeeds()
  .then()
  .catch(console.error)
