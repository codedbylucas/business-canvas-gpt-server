import { type QuestionEntityModel } from '@/domain/entities/question/question-entity-model'
import type { AlternativeModel } from './alternative'

export interface QuestionModel extends Omit<QuestionEntityModel, 'alternatives'> {
  id: string
  alternatives?: AlternativeModel[]
}
