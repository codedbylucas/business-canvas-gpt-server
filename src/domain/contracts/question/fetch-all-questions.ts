import type { QuestionsNotFoundError } from '../../errors'
import type { QuestionModel } from '../../models/db-models'
import type { Either } from '@/shared/either'

export type FetchAllQuestionsRes = Either<QuestionsNotFoundError, QuestionModel[]>

export interface FetchAllQuestions {
  perform: () => Promise<FetchAllQuestionsRes>
}
