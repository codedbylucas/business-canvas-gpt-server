import type { QuestionModel } from '@/domain/models/db-models'

export interface FetchAllQuestionsRepo {
  fetchAll: () => Promise<QuestionModel[]>
}
