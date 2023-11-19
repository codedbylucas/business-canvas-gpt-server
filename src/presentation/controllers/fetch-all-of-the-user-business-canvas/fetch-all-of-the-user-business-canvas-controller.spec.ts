import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http/http'
import { ServerError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helpers'
import { left, right, type Either } from '@/shared/either'
import { FetchAllOfTheUserBusinessCanvasController } from './fetch-all-of-the-user-business-canvas-controller'

const makeFakeRequest = (): HttpRequest => ({
  headers: { userId: 'any_user_id' }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: FetchAllOfTheUserBusinessCanvasController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new FetchAllOfTheUserBusinessCanvasController(validationStub)
  return { sut, validationStub }
}

describe('FetchAllOfTheUserBusinessCanvas Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
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
})
