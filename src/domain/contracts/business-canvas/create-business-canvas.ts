import type { Either } from '@/shared/either'
import type { BusinessCanvasOutputModel } from '@/domain/models/output-models'
import type { AnswerErrors } from '@/domain/entities/answer/answer-response'

export interface BusinessCanvasAnswer {
  questionId: string
  alternativeId?: string
  answer?: string
}

export interface CreateBusinessCanvasDto {
  userId: string
  answers: BusinessCanvasAnswer[]
}

export type CreateBusinessCanvasRes = Either<AnswerErrors, BusinessCanvasOutputModel>

export interface CreateBusinessCanvas {
  perform: (dto: CreateBusinessCanvasDto) => Promise<CreateBusinessCanvasRes>
}
