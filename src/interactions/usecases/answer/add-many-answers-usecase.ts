import type { AddManyAnswers, AddManyAnswersDto } from '@/domain/contracts'
import type { AnswerModel } from '@/domain/models/db-models'
import type { AddManyAnswersRepo } from '@/interactions/contracts/db'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'

export class AddManyAnswersUseCase implements AddManyAnswers {
  constructor (
    private readonly idBuilder: IdBuilder,
    private readonly addManyAnswersRepo: AddManyAnswersRepo
  ) {}

  async perform (dto: AddManyAnswersDto): Promise<void> {
    const { userId } = dto
    const answers: Array<Omit<AnswerModel, 'userId'>> = []
    const createdAt = new Date()
    for (const response of dto.answers) {
      const { questionId, alternativeId, answer } = response
      const { id } = this.idBuilder.build()
      answers.push({
        id,
        createdAt,
        questionId,
        ...(alternativeId && { alternativeId }),
        ...(answer && { description: answer })
      })
    }
    await this.addManyAnswersRepo.add({ userId, answers })
  }
}
