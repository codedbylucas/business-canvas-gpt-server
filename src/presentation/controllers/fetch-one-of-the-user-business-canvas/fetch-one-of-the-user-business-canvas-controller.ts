import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http/http'
import type { FetchOneOfTheUserBusinessCanvas } from '@/domain/contracts'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helpers'

export class FetchOneOfTheUserBusinessCanvasController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly fetchOneOfTheUserBusinessCanvas: FetchOneOfTheUserBusinessCanvas
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(httpRequest.params)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const businessCanvasResult = await this.fetchOneOfTheUserBusinessCanvas.perform({
        userId: httpRequest.headers.userId,
        businessCanvasId: httpRequest.params.businessCanvasId
      })
      if (businessCanvasResult.isLeft()) {
        return notFound(businessCanvasResult.value)
      }
      return ok(businessCanvasResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
