import type { FetchAllOfTheUserBusinessCanvas } from '@/domain/contracts'
import type { Controller } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http/http'
import { notFound, serverError } from '@/presentation/helpers/http/http-helpers'

export class FetchAllOfTheUserBusinessCanvasController implements Controller {
  constructor (
    private readonly fetchAllOfTheUserBusinessCanvas: FetchAllOfTheUserBusinessCanvas
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.fetchAllOfTheUserBusinessCanvas.perform(
        httpRequest.headers?.userId
      )
      if (result.isLeft()) {
        return notFound(result.value)
      }
      return { statusCode: 2, body: '' }
    } catch (error: any) {
      return serverError(error)
    }
  }
}
