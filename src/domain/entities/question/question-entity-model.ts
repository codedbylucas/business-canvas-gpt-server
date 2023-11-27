import type { Alternative } from '../alternative/alternative'

export type QuestionFieldType = 'select' | 'text' | 'text-area'

export interface QuestionEntityModel {
  content: string
  alternatives?: Alternative[]
  type: QuestionFieldType
}
