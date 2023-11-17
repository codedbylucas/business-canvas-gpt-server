import type { Middleware } from '../contracts'
import type { HttpRequest, HttpResponse } from '../http/http'
import { noContent, ok } from '../helpers/http/http-helpers'
import { AccessTokenVerifierMiddlewareDecorator } from './access-token-verifier-middleware-decorator'

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

const makeMiddleware = (): Middleware => {
  class MiddlewareStub implements Middleware {
    async handle (data: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok({ userId: 'any_id' }))
    }
  }
  return new MiddlewareStub()
}

interface SutTypes {
  sut: AccessTokenVerifierMiddlewareDecorator
  middlewareStub: Middleware
}

const makeSut = (): SutTypes => {
  const middlewareStub = makeMiddleware()
  const sut = new AccessTokenVerifierMiddlewareDecorator(middlewareStub)
  return { sut, middlewareStub }
}

describe('AccessTokenVerifierMiddleware Decorator', () => {
  it('Should call Middleware if x-access-token is provided at headers', async () => {
    const { sut, middlewareStub } = makeSut()
    const handleSpy = jest.spyOn(middlewareStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  it('Should not call Middleware if headers not provided', async () => {
    const { sut, middlewareStub } = makeSut()
    const handleSpy = jest.spyOn(middlewareStub, 'handle')
    await sut.handle({})
    expect(handleSpy).not.toHaveBeenCalled()
  })

  it('Should not call Middleware if x-access-token not provided at headers', async () => {
    const { sut, middlewareStub } = makeSut()
    const handleSpy = jest.spyOn(middlewareStub, 'handle')
    await sut.handle({ headers: {} })
    expect(handleSpy).not.toHaveBeenCalled()
  })

  it('Should return the Middleware response if x-access-token is provided at headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ userId: 'any_id' }))
  })

  it('Should return 204 if headers not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  it('Should return 204 if x-access-token not provided at headers', async () => {
    const { sut, middlewareStub } = makeSut()
    jest.spyOn(middlewareStub, 'handle')
    const httpResponse = await sut.handle({ headers: {} })
    expect(httpResponse).toEqual(noContent())
  })
})
