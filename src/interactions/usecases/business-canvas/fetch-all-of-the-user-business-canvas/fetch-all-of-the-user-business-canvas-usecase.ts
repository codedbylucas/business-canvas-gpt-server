import type { FetchAllOfTheUserBusinessCanvas, FetchAllOfTheUserBusinessCanvasRes } from '@/domain/contracts'
import type { UserBusinessCanvasSummary } from '@/domain/models/output-models'
import type { FetchAllBusinessCanvasByUserIdRepo } from '@/interactions/contracts/db'
import { NotAllBusinessCanvasError } from '@/domain/errors'
import { FormatDate } from '@/domain/processes/format-date/format-date'
import { left, right } from '@/shared/either'

export class FetchAllOfTheUserBusinessCanvasUseCase implements FetchAllOfTheUserBusinessCanvas {
  constructor (private readonly fetchAllBusinessCanvasByUserIdRepo: FetchAllBusinessCanvasByUserIdRepo) {}

  async perform (userId: string): Promise<FetchAllOfTheUserBusinessCanvasRes> {
    const businessCanvnas = await this.fetchAllBusinessCanvasByUserIdRepo.fetchByUserId(userId)
    if (businessCanvnas.length === 0) {
      return left(new NotAllBusinessCanvasError())
    }
    const canvasOfTheUser: UserBusinessCanvasSummary[] = businessCanvnas.map(
      canvas => ({
        id: canvas.id,
        name: canvas.name,
        createdAt: FormatDate.execute(canvas.createdAt)
      }))
    return right([])
  }
}
