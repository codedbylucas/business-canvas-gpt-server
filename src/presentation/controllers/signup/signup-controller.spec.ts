import type { Validation } from '@/presentation/contracts/validation'
import type { HttpRequest } from '@/presentation/http/http'
import { right, type Either, left } from '@/shared/either'
import { SignUpController } from './signup-controller'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helpers'
import { ServerError } from '@/presentation/errors'
import { type AddUser, type AddUserRes } from '@/domain/contracts'
import { type UserDto } from '@/domain/entities/user'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeValidationComposite = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    async perform (account: UserDto): Promise<AddUserRes> {
      return await Promise.resolve(right({ token: 'any_token' }))
    }
  }
  return new AddUserStub()
}

interface SutTypes {
  sut: SignUpController
  validationStub: Validation
  addUserStub: AddUser
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationComposite()
  const addUserStub = makeAddUser()
  const sut = new SignUpController(validationStub, addUserStub)
  return { sut, validationStub, addUserStub }
}

describe('SignUp Controller', () => {
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

  it('Should call AddUser with correct values', async () => {
    const { sut, addUserStub } = makeSut()
    const performSpy = jest.spyOn(addUserStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('Should return 400 if AddUser fails', async () => {
    const { sut, addUserStub } = makeSut()
    jest.spyOn(addUserStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })
})
