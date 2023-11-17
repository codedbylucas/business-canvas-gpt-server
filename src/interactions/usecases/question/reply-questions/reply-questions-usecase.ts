import type { AddManyQuestionsRepo, FetchAllQuestionsRepo } from '@/interactions/contracts/db'
import type { ReplyQuestions } from '@/domain/contracts'
import { QuestionsNotFoundError } from '@/domain/errors'

export class ReplyQuestionsUseCase implements ReplyQuestions {
  constructor (
    private readonly fetchAllQuestionsRepo: FetchAllQuestionsRepo,
    private readonly addManyQuestionsRepo: AddManyQuestionsRepo
  ) {}

  async perform (): Promise<void> {
    const questions = await this.fetchAllQuestionsRepo.fetchAll()
    if (questions.length === 0) {
      throw new QuestionsNotFoundError()
    }
    await this.addManyQuestionsRepo.addMany(questions)
  }
}
