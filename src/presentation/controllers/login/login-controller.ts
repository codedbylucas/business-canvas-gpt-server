import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http/http'
import type { Auth } from '@/domain/contracts'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helpers'
import { InvalidCredentialsError } from '@/domain/errors'

export class LoginController implements Controller {
  constructor (
    private readonly validationComposite: Validation,
    private readonly auth: Auth
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validationComposite.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const { email, password } = httpRequest.body
      const authResult = await this.auth.perform({ email, password })
      if (authResult.isLeft()) {
        if (authResult.value instanceof InvalidCredentialsError) {
          return unauthorized(authResult.value)
        }
        return badRequest(authResult.value)
      }
      return ok({ token: authResult.value.token })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
