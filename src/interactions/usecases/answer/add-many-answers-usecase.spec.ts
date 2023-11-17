import type { IdModel } from '@/domain/models/output-models'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import type { AddManyAnswersDto } from '@/domain/contracts'
import type { AddManyAnswersRepo, AddManyAnswersRepoDto } from '@/interactions/contracts/db'
import { AddManyAnswersUseCase } from './add-many-answers-usecase'
import MockeDate from 'mockdate'

const makeFakeAddManyAnswersDto = (): AddManyAnswersDto => ({
  userId: 'any_user_id',
  answers: [
    { questionId: 'any_question_id', alternativeId: 'any_alternative_id' },
    { questionId: 'other_question_id', answer: 'any_answer' },
    { questionId: 'another_question_id', answer: 'other_answer' }
  ]
})

const date = new Date()

const makeFakeAddManyAnswersRepoDto = (): AddManyAnswersRepoDto => ({
  userId: 'any_user_id',
  answers: [{
    id: 'any_id_1',
    createdAt: date,
    questionId: 'any_question_id',
    alternativeId: 'any_alternative_id'
  }, {
    id: 'any_id_2',
    createdAt: date,
    questionId: 'other_question_id',
    description: 'any_answer'
  }, {
    id: 'any_id_3',
    createdAt: date,
    questionId: 'another_question_id',
    description: 'other_answer'
  }]
})

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    private callsCount = 0
    build (): IdModel {
      this.callsCount++
      return { id: `any_id_${this.callsCount}` }
    }
  }
  return new IdBuilderStub()
}

const makeAddManyAnswersRepo = (): AddManyAnswersRepo => {
  class AddManyAnswersRepoStub implements AddManyAnswersRepo {
    async add (data: AddManyAnswersRepoDto): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddManyAnswersRepoStub()
}

interface SutTypes {
  sut: AddManyAnswersUseCase
  idBuilderStub: IdBuilder
  addManyAnswersRepoStub: AddManyAnswersRepo
}

const makeSut = (): SutTypes => {
  const idBuilderStub = makeIdBuilder()
  const addManyAnswersRepoStub = makeAddManyAnswersRepo()
  const sut = new AddManyAnswersUseCase(idBuilderStub, addManyAnswersRepoStub)
  return { sut, idBuilderStub, addManyAnswersRepoStub }
}

describe('AddManyAnswers UseCase', () => {
  beforeAll(() => {
    MockeDate.set(date)
  })

  afterAll(() => {
    MockeDate.reset()
  })

  it('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const buildSpy = jest.spyOn(idBuilderStub, 'build')
    await sut.perform(makeFakeAddManyAnswersDto())
    expect(buildSpy).toHaveBeenCalled()
  })

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderStub } = makeSut()
    jest.spyOn(idBuilderStub, 'build').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeAddManyAnswersDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddManyAnswersRepo with correct values', async () => {
    const { sut, addManyAnswersRepoStub } = makeSut()
    const addSpy = jest.spyOn(addManyAnswersRepoStub, 'add')
    await sut.perform(makeFakeAddManyAnswersDto())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddManyAnswersRepoDto())
  })

  it('Should throw if AddManyAnswersRepo throws', async () => {
    const { sut, addManyAnswersRepoStub } = makeSut()
    jest.spyOn(addManyAnswersRepoStub, 'add').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAddManyAnswersDto())
    await expect(promise).rejects.toThrow()
  })
})
