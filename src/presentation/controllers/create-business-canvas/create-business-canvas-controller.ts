import type { CreateBusinessCanvas } from '@/domain/contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, created, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http/http'

export class CreateBusinessCanvasController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly createBusinessCanvas: CreateBusinessCanvas
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const userId = httpRequest.headers?.userId
      const createBusinessCanvasResult = await this.createBusinessCanvas.perform({
        ...(userId && { userId }), answers: httpRequest.body
      })
      if (createBusinessCanvasResult.isLeft()) {
        return badRequest(createBusinessCanvasResult.value)
      }
      return created(createBusinessCanvasResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
