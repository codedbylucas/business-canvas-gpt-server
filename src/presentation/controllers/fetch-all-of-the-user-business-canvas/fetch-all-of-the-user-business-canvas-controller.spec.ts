import type { FetchAllOfTheUserBusinessCanvas, FetchAllOfTheUserBusinessCanvasRes } from '@/domain/contracts'
import type { UserBusinessCanvasSummary } from '@/domain/models/output-models'
import type { HttpRequest } from '@/presentation/http/http'
import { notFound, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { left, right } from '@/shared/either'
import { FetchAllOfTheUserBusinessCanvasController } from './fetch-all-of-the-user-business-canvas-controller'
import { ServerError } from '@/presentation/errors'

const makeFakeRequest = (): HttpRequest => ({
  headers: { userId: 'any_user_id' }
})

const makeFakeUserBusinessCanvasSummaryList = (): UserBusinessCanvasSummary[] => [{
  id: 'any_business_canvas_id',
  name: 'any_business_canvas_name',
  createdAt: '10/12/2023'
}, {
  id: 'other_business_canvas_id',
  name: 'other_business_canvas_name',
  createdAt: '10/12/2023'
}]

const makeFetchAllOfTheUserBusinessCanvas = (): FetchAllOfTheUserBusinessCanvas => {
  class FetchAllOfTheUserBusinessCanvasStub implements FetchAllOfTheUserBusinessCanvas {
    async perform (userId: string): Promise<FetchAllOfTheUserBusinessCanvasRes> {
      return await Promise.resolve(right(makeFakeUserBusinessCanvasSummaryList()))
    }
  }
  return new FetchAllOfTheUserBusinessCanvasStub()
}

interface SutTypes {
  sut: FetchAllOfTheUserBusinessCanvasController
  fetchAllOfTheUserBusinessCanvasStub: FetchAllOfTheUserBusinessCanvas
}

const makeSut = (): SutTypes => {
  const fetchAllOfTheUserBusinessCanvasStub = makeFetchAllOfTheUserBusinessCanvas()
  const sut = new FetchAllOfTheUserBusinessCanvasController(
    fetchAllOfTheUserBusinessCanvasStub
  )
  return { sut, fetchAllOfTheUserBusinessCanvasStub }
}

describe('FetchAllOfTheUserBusinessCanvas Controller', () => {
  it('Should call FetchAllOfTheUserBusinessCanvas with correct values', async () => {
    const { sut, fetchAllOfTheUserBusinessCanvasStub } = makeSut()
    const performSpy = jest.spyOn(fetchAllOfTheUserBusinessCanvasStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should return 404 if FetchAllOfTheUserBusinessCanvas not found business canvas', async () => {
    const { sut, fetchAllOfTheUserBusinessCanvasStub } = makeSut()
    jest.spyOn(fetchAllOfTheUserBusinessCanvasStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound(new Error('any_message')))
  })

  it('Should return 500 if FetchAllOfTheUserBusinessCanvas throws', async () => {
    const { sut, fetchAllOfTheUserBusinessCanvasStub } = makeSut()
    jest.spyOn(fetchAllOfTheUserBusinessCanvasStub, 'perform').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should return 200 if FetchAllOfTheUserBusinessCanvas is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeUserBusinessCanvasSummaryList()))
  })
})
