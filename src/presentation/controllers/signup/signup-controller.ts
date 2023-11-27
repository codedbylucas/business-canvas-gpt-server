import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http/http'
import type { AddUser } from '@/domain/contracts'
import { badRequest, created, serverError } from '@/presentation/helpers/http/http-helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addUser: AddUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const { name, email, password } = httpRequest.body
      const addUserResult = await this.addUser.perform({ name, email, password })
      if (addUserResult.isLeft()) {
        return badRequest(addUserResult.value)
      }
      return created(addUserResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
