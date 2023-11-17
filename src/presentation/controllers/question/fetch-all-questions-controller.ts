import type { HttpRequest, HttpResponse } from '@/presentation/http/http'
import type { FetchAllQuestions } from '@/domain/contracts'
import type { Controller } from '@/presentation/contracts'
import { notFound, ok, serverError } from '@/presentation/helpers/http/http-helpers'

export class FetchAllQuestionsController implements Controller {
  constructor (private readonly fetchAllQuestions: FetchAllQuestions) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fetchAllQuestionsResult = await this.fetchAllQuestions.perform()
      if (fetchAllQuestionsResult.isLeft()) {
        return notFound(fetchAllQuestionsResult.value)
      }
      return ok(fetchAllQuestionsResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
