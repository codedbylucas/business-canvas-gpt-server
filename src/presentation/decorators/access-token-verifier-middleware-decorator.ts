import type { HttpRequest, HttpResponse } from '../http/http'
import type { Middleware } from '../contracts'
import { noContent } from '../helpers/http/http-helpers'

export class AccessTokenVerifierMiddlewareDecorator implements Middleware {
  constructor (private readonly middleware: Middleware) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.headers?.['x-access-token']) {
      return await this.middleware.handle(httpRequest)
    }
    return noContent()
  }
}
