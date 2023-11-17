import type { QuestionModel } from '@/domain/models/db-models'

export interface UserAnswer {
  questionId: string
  alternativeId?: string
  answer?: string
}

export interface AnswerDto {
  userAnswer: UserAnswer
  questions: QuestionModel[]
}

export interface CreateManyAnswersDto {
  userAnswers: UserAnswer[]
  questions: QuestionModel[]
}
