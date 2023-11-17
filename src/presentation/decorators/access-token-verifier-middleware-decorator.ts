import type { Middleware } from '../contracts'
import type { HttpRequest, HttpResponse } from '../http/http'

export class AccessTokenVerifierMiddlewareDecorator implements Middleware {
  constructor (private readonly middleware: Middleware) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.middleware.handle(httpRequest)
    return { body: '', statusCode: 0 }
  }
}
