import type { QuestionModel } from '@/domain/models/db-models'
import type { FetchAllQuestionsRepo } from '@/interactions/contracts/db'
import { FetchQuestionsUseCase } from './fetch-questions-usecase'
import { QuestionsNotFoundError } from '@/domain/errors'

const makeFakeQuestions = (): QuestionModel[] => ([
  { id: 'any_id', content: 'any_content' },
  { id: 'other_id', content: 'other_content' }
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
  sut: FetchQuestionsUseCase
  fetchAllQuestionsRepoStub: FetchAllQuestionsRepo
}

const makeSut = (): SutTypes => {
  const fetchAllQuestionsRepoStub = makeFetchAllQuestionsRepo()
  const sut = new FetchQuestionsUseCase(fetchAllQuestionsRepoStub)
  return { sut, fetchAllQuestionsRepoStub }
}

describe('FetchQuestions UseCase', () => {
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
})
