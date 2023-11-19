import type { FetchAllBusinessCanvasByUserIdRepo, UserBusinessCanvasSummaryRepo } from '@/interactions/contracts/db'
import { FetchAllOfTheUserBusinessCanvasUseCase } from './fetch-all-of-the-user-business-canvas-usecase'
import { NotAllBusinessCanvasError } from '@/domain/errors'
import { FormatDate } from '@/domain/processes/format-date/format-date'
import MockDate from 'mockdate'

jest.mock('@/domain/processes/format-date/format-date', () => ({
  FormatDate: {
    execute: jest.fn(() => (`${10}/${12}/${2023}`))
  }
}))

const makeFakeUserBusinessCanvasSummaryListRepo = (): UserBusinessCanvasSummaryRepo[] => [{
  id: 'any_business_canvas_id',
  name: 'any_business_canvas_name',
  createdAt: new Date()
}, {
  id: 'other_business_canvas_id',
  name: 'other_business_canvas_name',
  createdAt: new Date()
}]

const makeFetchAllBusinessCanvasByUserIdRepo = (): FetchAllBusinessCanvasByUserIdRepo => {
  class FetchAllBusinessCanvasByUserIdRepoStub implements FetchAllBusinessCanvasByUserIdRepo {
    async fetchByUserId (userId: string): Promise<UserBusinessCanvasSummaryRepo[]> {
      return await Promise.resolve(makeFakeUserBusinessCanvasSummaryListRepo())
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
  beforeAll(() => {
    MockDate.set(new Date('2023-12-10T00:00:00'))
  })

  afterAll(() => {
    MockDate.reset()
  })

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

  it('Should call FormatDate with correct dates', async () => {
    const { sut } = makeSut()
    const executeSpy = jest.spyOn(FormatDate, 'execute')
    await sut.perform('any_user_id')
    expect(executeSpy).toHaveBeenCalledWith(new Date())
    expect(executeSpy).toHaveBeenCalledWith(new Date())
  })

  it('Should call FormatDate twice', async () => {
    const { sut } = makeSut()
    const executeSpy = jest.spyOn(FormatDate, 'execute')
    await sut.perform('any_user_id')
    expect(executeSpy).toHaveBeenCalledTimes(2)
  })
})
