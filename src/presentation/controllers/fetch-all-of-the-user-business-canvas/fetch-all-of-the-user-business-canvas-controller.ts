import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http/http'

export class FetchAllOfTheUserBusinessCanvasController implements Controller {
  constructor (
    private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      return { statusCode: 2, body: '' }
    } catch (error: any) {
      return serverError(error)
    }
  }
}
