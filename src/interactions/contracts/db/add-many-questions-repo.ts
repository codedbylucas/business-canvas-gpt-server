import type { QuestionModel } from '@/domain/models/db-models'

export interface AddManyQuestionsRepo {
  addMany: (data: QuestionModel[]) => Promise<void>
}
