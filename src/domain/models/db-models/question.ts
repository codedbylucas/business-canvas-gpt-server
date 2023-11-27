import type { QuestionFieldType } from '@/domain/entities/question/question-entity-model'
import type { AlternativeModel } from './alternative'

export interface QuestionModel {
  id: string
  content: string
  type: QuestionFieldType
  alternatives?: AlternativeModel[]
}
