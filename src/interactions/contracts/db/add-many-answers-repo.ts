import type { AnswerModel } from '@/domain/models/db-models'

export interface AddManyAnswersRepoDto {
  userId: string
  answers: Array<Omit<AnswerModel, 'userId'>>
}

export interface AddManyAnswersRepo {
  add: (dto: AddManyAnswersRepoDto) => Promise<void>
}
