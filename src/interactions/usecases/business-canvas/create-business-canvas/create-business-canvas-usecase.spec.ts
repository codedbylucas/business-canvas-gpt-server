import type { AddManyAnswers, AddManyAnswersDto, AddBusinessCanvas, AddBusinessCanvasDto, AddRandomUser, CreateBusinessCanvas, CreateBusinessCanvasDto, AddRandomUserRes, BusinessCanvasId } from '@/domain/contracts'
import type { CreateBusinessCanvasApi, CreateBusinessCanvasApiDto } from '@/interactions/contracts/api'
import type { BusinessCanvasApiModel } from '@/domain/models/output-models'
import type { QuestionModel } from '@/domain/models/db-models'
import type { FetchAllQuestionsRepo } from '@/interactions/contracts/db'
import type { CreateManyAnswersDto } from '@/domain/entities/answer/answer-dto'
import type { BusinessCanvasDataBuilderRes, BusinessCanvasDataBuilderDto, GenerateInputToCreateBusinessCanvasDto } from '@/domain/processes'
import { BusinessCanvasDataBuilder, GenerateInputToCreateBusinessCanvas } from '@/domain/processes'
import { CreateBusinessCanvasUseCase } from './create-business-canvas-usecase'
import { left, right } from '@/shared/either'
import { QuestionsNotFoundError } from '@/domain/errors'
import { Answer } from '@/domain/entities/answer/answer'

jest.mock('@/domain/entities/answer/answer', () => ({
  Answer: {
    createMany: jest.fn((dto: CreateManyAnswersDto) => (
      right(makeFakeCreateBusinessCanvasDto().answers)
    ))
  }
}))

jest.mock('@/domain/processes/business-canvas-data-builder/business-canvas-data-builder', () => ({
  BusinessCanvasDataBuilder: {
    execute: jest.fn((dto: BusinessCanvasDataBuilderDto) => (
      makeFakeBusinessCanvasDataBuilderRes()
    ))
  }
}))

jest.mock('@/domain/processes/generate-input-to-create-business-canvas/generate-input-to-create-business-canvas', () => ({
  GenerateInputToCreateBusinessCanvas: {
    execute: jest.fn((dto: GenerateInputToCreateBusinessCanvasDto) => ({
      text: 'any_input_text'
    }))
  }
}))

const makeFakeCreateBusinessCanvasDto = (): CreateBusinessCanvasDto => ({
  userId: 'any_user_id',
  answers: [
    { questionId: 'type_question_id', alternativeId: 'in_person_alternative_id' },
    { questionId: 'location_question_id', answer: 'location_answer' },
    { questionId: 'description_question_id', answer: 'description_answer' }
  ]
})

const makeFakeQuestionsModel = (): QuestionModel[] => ([{
  id: 'type_question_id',
  content: 'Qual o tipo do seu negócio?',
  type: 'select',
  alternatives: [{
    id: 'in_person_alternative_id',
    description: 'in_person',
    questionId: 'type_question_id'
  }, {
    id: 'online_alternative_id',
    description: 'online',
    questionId: 'type_question_id'
  }]
}, {
  id: 'location_question_id',
  content: 'Qual a localização ou público para o qual deseja trabalhar (Cidade, estado ou país)?',
  type: 'text'
}, {
  id: 'description_question_id',
  content: 'Descreva seu negócio:',
  type: 'text-area'
}])

const makeFakeBusinessCanvasDataBuilderRes = (): BusinessCanvasDataBuilderRes => ({
  businessDescription: 'description_answer',
  typeOfBusiness: 'in_person',
  locationOrTargetAudience: 'location_answer'
})

const makeFakeBusinessCanvasApiModel = (): BusinessCanvasApiModel => ({
  name: 'any_business_canvas_name',
  customerSegments: ['any_customer_segments'],
  valuePropositions: ['any_value_propositions'],
  channels: ['any_channels'],
  customerRelationships: ['any_customer_relationships'],
  revenueStreams: ['any_revenue_streams'],
  keyResources: ['any_key_resources'],
  keyActivities: ['any_key_activities'],
  keyPartnerships: ['any_key_partnerships'],
  costStructure: ['any_cost_structure']
})

const makeFetchAllQuestionsRepo = (): FetchAllQuestionsRepo => {
  class FetchAllQuestionsRepoStub implements FetchAllQuestionsRepo {
    async fetchAll (): Promise<QuestionModel[]> {
      return await Promise.resolve(makeFakeQuestionsModel())
    }
  }
  return new FetchAllQuestionsRepoStub()
}

const makeAddRandomUser = (): AddRandomUser => {
  class AddRandomUserStub implements AddRandomUser {
    async perform (): Promise<AddRandomUserRes> {
      return await Promise.resolve({
        id: 'any_random_user_id', token: 'any_token', userName: 'any_random_user_name'
      })
    }
  }
  return new AddRandomUserStub()
}

const makeAddManyAnswers = (): AddManyAnswers => {
  class AddManyAnswersStub implements AddManyAnswers {
    async perform (dto: AddManyAnswersDto): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddManyAnswersStub()
}

const makeCreateBusinessCanvasApi = (): CreateBusinessCanvasApi => {
  class CreateBusinessCanvasApiStub implements CreateBusinessCanvasApi {
    async create (dto: CreateBusinessCanvasApiDto): Promise<BusinessCanvasApiModel> {
      return await Promise.resolve(makeFakeBusinessCanvasApiModel())
    }
  }
  return new CreateBusinessCanvasApiStub()
}

const makeAddBusinessCanvas = (): AddBusinessCanvas => {
  class AddBusinessCanvasStub implements AddBusinessCanvas {
    async perform (dto: AddBusinessCanvasDto): Promise<BusinessCanvasId> {
      return await Promise.resolve({ id: 'any_business_canvas_id' })
    }
  }
  return new AddBusinessCanvasStub()
}

interface SutTypes {
  sut: CreateBusinessCanvas
  fetchAllQuestionsRepoStub: FetchAllQuestionsRepo
  addRandomUserStub: AddRandomUser
  addManyAnswersStub: AddManyAnswers
  createBusinessCanvasApiStub: CreateBusinessCanvasApi
  addBusinessCanvasStub: AddBusinessCanvas
}

const makeSut = (): SutTypes => {
  const fetchAllQuestionsRepoStub = makeFetchAllQuestionsRepo()
  const addRandomUserStub = makeAddRandomUser()
  const addManyAnswersStub = makeAddManyAnswers()
  const createBusinessCanvasApiStub = makeCreateBusinessCanvasApi()
  const addBusinessCanvasStub = makeAddBusinessCanvas()
  const sut = new CreateBusinessCanvasUseCase(
    fetchAllQuestionsRepoStub,
    addRandomUserStub,
    addManyAnswersStub,
    createBusinessCanvasApiStub,
    addBusinessCanvasStub
  )
  return {
    sut,
    fetchAllQuestionsRepoStub,
    addRandomUserStub,
    addManyAnswersStub,
    createBusinessCanvasApiStub,
    addBusinessCanvasStub
  }
}

describe('CreateBusinessCanvas UseCase', () => {
  it('Should call FetchAllQuestionsRepo', async () => {
    const { sut, fetchAllQuestionsRepoStub } = makeSut()
    const fetchAllSpy = jest.spyOn(fetchAllQuestionsRepoStub, 'fetchAll')
    await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(fetchAllSpy).toHaveBeenCalled()
  })

  it('Should throw if FetchAllQuestionsRepo returns empty list', async () => {
    const { sut, fetchAllQuestionsRepoStub } = makeSut()
    jest.spyOn(fetchAllQuestionsRepoStub, 'fetchAll').mockReturnValueOnce(
      Promise.resolve([])
    )
    const promise = sut.perform(makeFakeCreateBusinessCanvasDto())
    await expect(promise).rejects.toThrow(QuestionsNotFoundError)
  })

  it('Should throw if QuestionsNotFoundError throws', async () => {
    const { sut, fetchAllQuestionsRepoStub } = makeSut()
    jest.spyOn(fetchAllQuestionsRepoStub, 'fetchAll').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeCreateBusinessCanvasDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call Answer Entity with correct values', async () => {
    const { sut } = makeSut()
    const createManySpy = jest.spyOn(Answer, 'createMany')
    await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(createManySpy).toHaveBeenCalledWith({
      userAnswers: makeFakeCreateBusinessCanvasDto().answers,
      questions: makeFakeQuestionsModel()
    })
  })

  it('Should return a Error if create many Answers fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(Answer, 'createMany').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const result = await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should throw if Answer Entity throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(Answer, 'createMany').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeCreateBusinessCanvasDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddRandomUser if userId not provided', async () => {
    const { sut, addRandomUserStub } = makeSut()
    const performSpy = jest.spyOn(addRandomUserStub, 'perform')
    await sut.perform({ answers: makeFakeCreateBusinessCanvasDto().answers })
    expect(performSpy).toHaveBeenCalled()
  })

  it('Should not call AddRandomUser if userId is provided', async () => {
    const { sut, addRandomUserStub } = makeSut()
    const performSpy = jest.spyOn(addRandomUserStub, 'perform')
    await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(performSpy).not.toHaveBeenCalled()
  })

  it('Should throw if AddRandomUser throws', async () => {
    const { sut, addRandomUserStub } = makeSut()
    jest.spyOn(addRandomUserStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform({ answers: makeFakeCreateBusinessCanvasDto().answers })
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddManyAnswers with correct values', async () => {
    const { sut, addManyAnswersStub } = makeSut()
    const performSpy = jest.spyOn(addManyAnswersStub, 'perform')
    await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(performSpy).toHaveBeenCalledWith(makeFakeCreateBusinessCanvasDto())
  })

  it('Should throw if AddManyAnswers throws', async () => {
    const { sut, addManyAnswersStub } = makeSut()
    jest.spyOn(addManyAnswersStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeCreateBusinessCanvasDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddManyAnswers with random user id if userId not provided', async () => {
    const { sut, addManyAnswersStub } = makeSut()
    const performSpy = jest.spyOn(addManyAnswersStub, 'perform')
    await sut.perform({ answers: makeFakeCreateBusinessCanvasDto().answers })
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_random_user_id',
      answers: makeFakeCreateBusinessCanvasDto().answers
    })
  })

  it('Should call BusinessCanvasDataBuilder with correct values', async () => {
    const { sut } = makeSut()
    const createManySpy = jest.spyOn(BusinessCanvasDataBuilder, 'execute')
    await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(createManySpy).toHaveBeenCalledWith({
      userAnswers: makeFakeCreateBusinessCanvasDto().answers,
      questions: makeFakeQuestionsModel()
    })
  })

  it('Should throw if BusinessCanvasDataBuilder throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(BusinessCanvasDataBuilder, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeCreateBusinessCanvasDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call GenerateInputToCreateBusinessCanvas with correct values', async () => {
    const { sut } = makeSut()
    const executeSpy = jest.spyOn(GenerateInputToCreateBusinessCanvas, 'execute')
    await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(executeSpy).toHaveBeenCalledWith(makeFakeBusinessCanvasDataBuilderRes())
  })

  it('Should throw if GenerateInputToCreateBusinessCanvas throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(GenerateInputToCreateBusinessCanvas, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeCreateBusinessCanvasDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call CreateBusinessCanvasApi with correct input', async () => {
    const { sut, createBusinessCanvasApiStub } = makeSut()
    const createSpy = jest.spyOn(createBusinessCanvasApiStub, 'create')
    await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(createSpy).toHaveBeenCalledWith({ input: 'any_input_text' })
  })

  it('Should throw if CreateBusinessCanvasApi throws', async () => {
    const { sut, createBusinessCanvasApiStub } = makeSut()
    jest.spyOn(createBusinessCanvasApiStub, 'create').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeCreateBusinessCanvasDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddBusinessCanvas with correct values', async () => {
    const { sut, addBusinessCanvasStub } = makeSut()
    const performSpy = jest.spyOn(addBusinessCanvasStub, 'perform')
    await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id', ...makeFakeBusinessCanvasApiModel()
    })
  })

  it('Should throw if AddBusinessCanvas throws', async () => {
    const { sut, addBusinessCanvasStub } = makeSut()
    jest.spyOn(addBusinessCanvasStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeCreateBusinessCanvasDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should return BusinessCanvasApiModel if AddBusinessCanvas is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeCreateBusinessCanvasDto())
    expect(result.value).toEqual({
      id: 'any_business_canvas_id', ...makeFakeBusinessCanvasApiModel()
    })
  })

  it('Should return BusinessCanvasApiModel with token and userName if AddBusinessCanvas is a success and userId not provided in request', async () => {
    const { sut } = makeSut()
    const result = await sut.perform({ answers: makeFakeCreateBusinessCanvasDto().answers })
    expect(result.value).toEqual({
      id: 'any_business_canvas_id',
      token: 'any_token',
      userName: 'any_random_user_name',
      ...makeFakeBusinessCanvasApiModel()
    })
  })
})
