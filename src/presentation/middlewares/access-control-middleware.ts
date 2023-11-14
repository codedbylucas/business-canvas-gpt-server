import type { HttpRequest, HttpResponse } from '../http/http'
import type { Middleware } from '../contracts'
import type { AccessControl } from '@/domain/contracts'
import type { Role } from '@/domain/models/db-models'
import { AccessTokenNotInformedError } from '../errors'
import { forbidden, serverError, unauthorized } from '../helpers/http/http-helpers'
import { InvalidTokenError } from '@/domain/errors'

export class AccessControlMiddleware implements Middleware {
  constructor (
    private readonly accessControl: AccessControl,
    private readonly requiredRole: Role
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) {
        return unauthorized(new AccessTokenNotInformedError())
      }
      const accessControlResul = await this.accessControl.perform({
        accessToken, requiredRole: this.requiredRole
      })
      if (accessControlResul.isLeft()) {
        if (accessControlResul.value instanceof InvalidTokenError) {
          return unauthorized(accessControlResul.value)
        }
        return forbidden(accessControlResul.value)
      }
      return { body: '', statusCode: 0 }
    } catch (error: any) {
      return serverError(error)
    }
  }
}
