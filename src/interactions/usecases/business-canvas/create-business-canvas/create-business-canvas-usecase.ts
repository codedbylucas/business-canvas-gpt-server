import type { AddManyAnswers, AddBusinessCanvas, AddRandomUser, CreateBusinessCanvas, CreateBusinessCanvasDto, CreateBusinessCanvasRes } from '@/domain/contracts'
import type { FetchAllQuestionsRepo } from '@/interactions/contracts/db'
import type { CreateBusinessCanvasApi } from '@/interactions/contracts/api'
import { BusinessCanvasDataBuilder, GenerateInputToCreateBusinessCanvas } from '@/domain/processes'
import { QuestionsNotFoundError } from '@/domain/errors'
import { left, right } from '@/shared/either'
import { Answer } from '@/domain/entities/answer/answer'

export class CreateBusinessCanvasUseCase implements CreateBusinessCanvas {
  constructor (
    private readonly fetchAllQuestionsRepo: FetchAllQuestionsRepo,
    private readonly addRandomUser: AddRandomUser,
    private readonly addManyAnswers: AddManyAnswers,
    private readonly createBusinessCanvasApi: CreateBusinessCanvasApi,
    private readonly addBusinessCanvas: AddBusinessCanvas
  ) {}

  async perform (dto: CreateBusinessCanvasDto): Promise<CreateBusinessCanvasRes> {
    const questions = await this.fetchAllQuestionsRepo.fetchAll()
    if (questions.length === 0) {
      throw new QuestionsNotFoundError()
    }
    const answerResult = Answer.createMany({ userAnswers: dto.answers, questions })
    if (answerResult.isLeft()) {
      return left(answerResult.value)
    }
    let userId = dto.userId as string
    let token: string = ''
    let userName: string = ''
    if (!dto.userId) {
      const randomUserResult = await this.addRandomUser.perform()
      userId = randomUserResult.id
      token = randomUserResult.token
      userName = randomUserResult.userName
    }
    const addManyAnswersDto = { userId, answers: dto.answers }
    await this.addManyAnswers.perform(addManyAnswersDto)
    const dataToInput = BusinessCanvasDataBuilder.execute({ userAnswers: dto.answers, questions })
    const { text: input } = GenerateInputToCreateBusinessCanvas.execute(dataToInput)
    const businessCanvasOutputModel = await this.createBusinessCanvasApi.create({ input })
    const { id } = await this.addBusinessCanvas.perform({ userId, ...businessCanvasOutputModel })
    if (!dto.userId) {
      return right({ id, token, userName, ...businessCanvasOutputModel })
    }
    return right({ id, ...businessCanvasOutputModel })
  }
}
