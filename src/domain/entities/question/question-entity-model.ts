import type { Alternative } from '../alternative/alternative'

export interface QuestionEntityModel {
  content: string
  alternatives?: Alternative[]
}
