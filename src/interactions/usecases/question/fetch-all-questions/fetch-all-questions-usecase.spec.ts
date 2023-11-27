import type { QuestionModel } from '@/domain/models/db-models'
import type { FetchAllQuestionsRepo } from '@/interactions/contracts/db'
import { FetchAllQuestionsUseCase } from './fetch-all-questions-usecase'
import { QuestionsNotFoundError } from '@/domain/errors'

const makeFakeQuestions = (): QuestionModel[] => ([
  { id: 'any_id', content: 'any_content', type: 'text' },
  { id: 'other_id', content: 'other_content', type: 'text' }
])

const makeFetchAllQuestionsRepo = (): FetchAllQuestionsRepo => {
  class FetchAllQuestionsRepoStub implements FetchAllQuestionsRepo {
    async fetchAll (): Promise<QuestionModel[]> {
      return await Promise.resolve(makeFakeQuestions())
    }
  }
  return new FetchAllQuestionsRepoStub()
}

interface SutTypes {
  sut: FetchAllQuestionsUseCase
  fetchAllQuestionsRepoStub: FetchAllQuestionsRepo
}

const makeSut = (): SutTypes => {
  const fetchAllQuestionsRepoStub = makeFetchAllQuestionsRepo()
  const sut = new FetchAllQuestionsUseCase(fetchAllQuestionsRepoStub)
  return { sut, fetchAllQuestionsRepoStub }
}

describe('FetchAllQuestions UseCase', () => {
  it('Should call FetchAllQuestionsRepo', async () => {
    const { sut, fetchAllQuestionsRepoStub } = makeSut()
    const fetchAllSpy = jest.spyOn(fetchAllQuestionsRepoStub, 'fetchAll')
    await sut.perform()
    expect(fetchAllSpy).toHaveBeenCalled()
  })

  it('Should return QuestionsNotFoundError if FetchAllQuestionsRepo returns empty list', async () => {
    const { sut, fetchAllQuestionsRepoStub } = makeSut()
    jest.spyOn(fetchAllQuestionsRepoStub, 'fetchAll').mockReturnValueOnce(
      Promise.resolve([])
    )
    const result = await sut.perform()
    expect(result.value).toEqual(new QuestionsNotFoundError())
  })

  it('Should throw if FetchAllQuestionsRepo throws', async () => {
    const { sut, fetchAllQuestionsRepoStub } = makeSut()
    jest.spyOn(fetchAllQuestionsRepoStub, 'fetchAll').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  it('Should return QuestionModel list if FetchAllQuestionsRepo is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform()
    expect(result.value).toEqual(makeFakeQuestions())
  })
})
