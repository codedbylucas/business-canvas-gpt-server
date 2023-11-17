import type { BusinessCanvasAnswer } from '../business-canvas/create-business-canvas'

export interface AddManyAnswersDto {
  userId: string
  answers: BusinessCanvasAnswer[]
}

export interface AddManyAnswers {
  perform: (dto: AddManyAnswersDto) => Promise<void>
}
