import type { AlternativeModel } from './alternative'

export interface QuestionModel {
  id: string
  content: string
  alternatives?: AlternativeModel[]
}
