import type { FetchAllBusinessCanvasByUserIdRepo, UserBusinessCanvasSummaryRepo } from '@/interactions/contracts/db'
import { FetchAllOfTheUserBusinessCanvasUseCase } from './fetch-all-of-the-user-business-canvas-usecase'

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
})
