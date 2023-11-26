import type { Auth, AuthDto, AuthRes } from '@/domain/contracts'
import type { Validation } from '@/presentation/contracts/validation'
import type { HttpRequest } from '@/presentation/http/http'
import { right, type Either, left } from '@/shared/either'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helpers'
import { InvalidCredentialsError } from '@/domain/errors'
import { LoginController } from './login-controller'
import { ServerError } from '@/presentation/errors'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

const makeAuth = (): Auth => {
  class AuthStub implements Auth {
    async perform (dto: AuthDto): Promise<AuthRes> {
      return await Promise.resolve(right({ token: 'any_token', userName: 'any_name' }))
    }
  }
  return new AuthStub()
}

interface SutTypes {
  sut: LoginController
  validationStub: Validation
  authStub: Auth
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authStub = makeAuth()
  const sut = new LoginController(validationStub, authStub)
  return { sut, validationStub, authStub }
}

describe('Login Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com', password: 'any_password'
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

  it('Should call Auth with correct values', async () => {
    const { sut, authStub } = makeSut()
    const performSpy = jest.spyOn(authStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com', password: 'any_password'
    })
  })

  it('Should return 400 if Auth fails', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 401 if Auth returns InvalidCredentialsError', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new InvalidCredentialsError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized(new InvalidCredentialsError()))
  })

  it('Should return 500 if Auth throws', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'perform').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should return 200 if Auth is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ userName: 'any_name', token: 'any_token' }))
  })
})
