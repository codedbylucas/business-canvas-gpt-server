import type { AccessControl, AccessControlDto, AccessControlRes } from '@/domain/contracts'
import type { HttpRequest } from '../http/http'
import { AccessTokenNotInformedError, ServerError } from '../errors'
import { forbidden, ok, serverError, unauthorized } from '../helpers/http/http-helpers'
import { AccessControlMiddleware } from './access-control-middleware'
import { left, right } from '@/shared/either'
import { AccessDeniedError, InvalidTokenError } from '@/domain/errors'

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

const makeFakeAccessControlDto = (): AccessControlDto => ({
  accessToken: 'any_token',
  requiredRole: 'admin'
})

const makeAccessControl = (): AccessControl => {
  class AccessControlStub implements AccessControl {
    async perform (data: AccessControlDto): Promise<AccessControlRes> {
      return await Promise.resolve(right({ userId: 'any_id' }))
    }
  }
  return new AccessControlStub()
}

interface SutTypes {
  sut: AccessControlMiddleware
  accessControlStub: AccessControl
}

const makeSut = (): SutTypes => {
  const accessControlStub = makeAccessControl()
  const sut = new AccessControlMiddleware(accessControlStub, 'admin')
  return { sut, accessControlStub }
}

describe('AccessControl Middleware', () => {
  it('Should return 401 if x-access-token not provided in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized(new AccessTokenNotInformedError()))
  })

  it('Should call AccessControl with correct values', async () => {
    const { sut, accessControlStub } = makeSut()
    const performSpy = jest.spyOn(accessControlStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith(makeFakeAccessControlDto())
  })

  it('Should return 401 if AccessControl return InvalidTokenError', async () => {
    const { sut, accessControlStub } = makeSut()
    jest.spyOn(accessControlStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new InvalidTokenError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized(new InvalidTokenError()))
  })

  it('Should return 403 if AccessControl return AccessDeniedError', async () => {
    const { sut, accessControlStub } = makeSut()
    jest.spyOn(accessControlStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new AccessDeniedError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 500 if AccessControl throws', async () => {
    const { sut, accessControlStub } = makeSut()
    jest.spyOn(accessControlStub, 'perform').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    error.stack = 'any_stack'
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should return 200 if AccessControl is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ userId: 'any_id' }))
  })
})
