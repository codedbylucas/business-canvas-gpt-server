import type { FetchAllQuestions, FetchAllQuestionsRes } from '@/domain/contracts'
import type { QuestionModel } from '@/domain/models/db-models'
import { notFound, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { FetchAllQuestionsController } from './fetch-all-questions-controller'
import { QuestionsNotFoundError } from '@/domain/errors'
import { left, right } from '@/shared/either'
import { ServerError } from '@/presentation/errors'

const makeFakeQuestions = (): QuestionModel[] => ([
  { id: 'any_id', content: 'any_content', type: 'text' },
  { id: 'other_id', content: 'other_content', type: 'text' }
])

const makeFetchAllQuestions = (): FetchAllQuestions => {
  class FetchAllQuestionsStub implements FetchAllQuestions {
    async perform (): Promise<FetchAllQuestionsRes> {
      return await Promise.resolve(right(makeFakeQuestions()))
    }
  }
  return new FetchAllQuestionsStub()
}

interface SutTypes {
  sut: FetchAllQuestionsController
  fetchAllQuestionsStub: FetchAllQuestions
}

const makeSut = (): SutTypes => {
  const fetchAllQuestionsStub = makeFetchAllQuestions()
  const sut = new FetchAllQuestionsController(fetchAllQuestionsStub)
  return { sut, fetchAllQuestionsStub }
}

describe('FetchAllQuestions Controller', () => {
  it('Should call FetchAllQuestions', async () => {
    const { sut, fetchAllQuestionsStub } = makeSut()
    const performSpy = jest.spyOn(fetchAllQuestionsStub, 'perform')
    await sut.handle({})
    expect(performSpy).toHaveBeenCalled()
  })

  it('Should return 404 if FetchAllQuestions returns QuestionsNotFoundError', async () => {
    const { sut, fetchAllQuestionsStub } = makeSut()
    jest.spyOn(fetchAllQuestionsStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new QuestionsNotFoundError()))
    )
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(notFound(new QuestionsNotFoundError()))
  })

  it('Should return 500 if FetchAllQuestions throws', async () => {
    const { sut, fetchAllQuestionsStub } = makeSut()
    jest.spyOn(fetchAllQuestionsStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle({})
    const error = new Error()
    error.stack = 'any_stack'
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should return 200 if FetchAllQuestions is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeQuestions()))
  })
})
