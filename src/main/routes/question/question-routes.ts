import type { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { fetchAllQuestionsControllerFactory } from '@/main/factories/controllers/question/fetch-all-questions-controller-factory'

export default async (router: Router): Promise<void> => {
  router.get('/question', adaptRoute(fetchAllQuestionsControllerFactory()))
}
