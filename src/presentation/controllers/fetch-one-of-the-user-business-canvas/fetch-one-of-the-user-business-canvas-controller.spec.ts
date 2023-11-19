import type { FetchOneOfTheUserBusinessCanvasDto, FetchOneOfTheUserBusinessCanvas, FetchOneOfTheUserBusinessCanvasRes } from '@/domain/contracts'
import type { HttpRequest } from '@/presentation/http/http'
import type { Validation } from '@/presentation/contracts'
import { type Either, right, left } from '@/shared/either'
import { FetchOneOfTheUserBusinessCanvasController } from './fetch-one-of-the-user-business-canvas-controller'
import { badRequest, notFound, serverError } from '@/presentation/helpers/http/http-helpers'
import { ServerError } from '@/presentation/errors'

const makeFakeRequest = (): HttpRequest => ({
  headers: { userId: 'any_user_id' },
  params: { businessCanvasId: 'any_business_canvas_id' }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

const makeFetchOneOfTheUserBusinessCanvas = (): FetchOneOfTheUserBusinessCanvas => {
  class FetchOneOfTheUserBusinessCanvasStub implements FetchOneOfTheUserBusinessCanvas {
    async perform (dto: FetchOneOfTheUserBusinessCanvasDto): Promise<FetchOneOfTheUserBusinessCanvasRes> {
      return await Promise.resolve(right('' as any))
    }
  }
  return new FetchOneOfTheUserBusinessCanvasStub()
}

interface SutTypes {
  sut: FetchOneOfTheUserBusinessCanvasController
  validationStub: Validation
  fetchOneOfTheUserBusinessCanvasStub: FetchOneOfTheUserBusinessCanvas
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const fetchOneOfTheUserBusinessCanvasStub = makeFetchOneOfTheUserBusinessCanvas()
  const sut = new FetchOneOfTheUserBusinessCanvasController(
    validationStub, fetchOneOfTheUserBusinessCanvasStub
  )
  return { sut, validationStub, fetchOneOfTheUserBusinessCanvasStub }
}

describe('FetchOneOfTheUserBusinessCanvas Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith({
      businessCanvasId: 'any_business_canvas_id'
    })
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    error.stack = 'any_stack'
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should call FetchOneOfTheUserBusinessCanvas with correct values', async () => {
    const { sut, fetchOneOfTheUserBusinessCanvasStub } = makeSut()
    const performSpy = jest.spyOn(fetchOneOfTheUserBusinessCanvasStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id',
      businessCanvasId: 'any_business_canvas_id'
    })
  })

  it('Should return 404 if FetchOneOfTheUserBusinessCanvas not found business canvas', async () => {
    const { sut, fetchOneOfTheUserBusinessCanvasStub } = makeSut()
    jest.spyOn(fetchOneOfTheUserBusinessCanvasStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound(new Error('any_message')))
  })

  it('Should return 500 if FetchOneOfTheUserBusinessCanvas throws', async () => {
    const { sut, fetchOneOfTheUserBusinessCanvasStub } = makeSut()
    jest.spyOn(fetchOneOfTheUserBusinessCanvasStub, 'perform').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })
})
