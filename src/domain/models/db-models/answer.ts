import type { BaseModel } from './util/base-model'

export interface AnswerModel extends BaseModel {
  description?: string
  userId: string
  questionId: string
  alternativeId?: string
}
