import type { FetchAllBusinessCanvasByUserIdRepo, UserBusinessCanvasSummaryRepo } from '@/interactions/contracts/db'
import { FetchAllOfTheUserBusinessCanvasUseCase } from './fetch-all-of-the-user-business-canvas-usecase'
import { NotAllBusinessCanvasError } from '@/domain/errors'

const makeFetchAllBusinessCanvasByUserIdRepo = (): FetchAllBusinessCanvasByUserIdRepo => {
  class FetchAllBusinessCanvasByUserIdRepoStub implements FetchAllBusinessCanvasByUserIdRepo {
    async fetchByUserId (userId: string): Promise<UserBusinessCanvasSummaryRepo[]> {
      return await Promise.resolve([])
    }
  }
  return new FetchAllBusinessCanvasByUserIdRepoStub()
}

interface SutTypes {
  sut: FetchAllOfTheUserBusinessCanvasUseCase
  fetchAllBusinessCanvasByUserIdRepoStub: FetchAllBusinessCanvasByUserIdRepo
}

const makeSut = (): SutTypes => {
  const fetchAllBusinessCanvasByUserIdRepoStub = makeFetchAllBusinessCanvasByUserIdRepo()
  const sut = new FetchAllOfTheUserBusinessCanvasUseCase(fetchAllBusinessCanvasByUserIdRepoStub)
  return { sut, fetchAllBusinessCanvasByUserIdRepoStub }
}

describe('FetchAllOfTheUserBusinessCanvas UseCase', () => {
  it('Should call FetchAllBusinessCanvasByUserIdRepo with correct user id', async () => {
    const { sut, fetchAllBusinessCanvasByUserIdRepoStub } = makeSut()
    const fetchByUserIdSpy = jest.spyOn(fetchAllBusinessCanvasByUserIdRepoStub, 'fetchByUserId')
    await sut.perform('any_user_id')
    expect(fetchByUserIdSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should return NotAllBusinessCanvasError if FetchAllBusinessCanvasByUserIdRepo returns empty list', async () => {
    const { sut, fetchAllBusinessCanvasByUserIdRepoStub } = makeSut()
    jest.spyOn(fetchAllBusinessCanvasByUserIdRepoStub, 'fetchByUserId').mockReturnValueOnce(
      Promise.resolve([])
    )
    const result = await sut.perform('any_user_id')
    expect(result.value).toEqual(new NotAllBusinessCanvasError())
  })

  it('Should throw if FetchAllBusinessCanvasByUserIdRepo throws', async () => {
    const { sut, fetchAllBusinessCanvasByUserIdRepoStub } = makeSut()
    jest.spyOn(fetchAllBusinessCanvasByUserIdRepoStub, 'fetchByUserId').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform('any_user_id')
    await expect(promise).rejects.toThrow()
  })
})
