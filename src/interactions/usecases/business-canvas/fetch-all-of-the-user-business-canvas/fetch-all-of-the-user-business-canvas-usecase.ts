import type { FetchAllOfTheUserBusinessCanvas, FetchAllOfTheUserBusinessCanvasRes } from '@/domain/contracts'
import { NotAllBusinessCanvasError } from '@/domain/errors'
import type { FetchAllBusinessCanvasByUserIdRepo } from '@/interactions/contracts/db'
import { left, right } from '@/shared/either'

export class FetchAllOfTheUserBusinessCanvasUseCase implements FetchAllOfTheUserBusinessCanvas {
  constructor (private readonly fetchAllBusinessCanvasByUserIdRepo: FetchAllBusinessCanvasByUserIdRepo) {}

  async perform (userId: string): Promise<FetchAllOfTheUserBusinessCanvasRes> {
    const businessCavnas = await this.fetchAllBusinessCanvasByUserIdRepo.fetchByUserId(userId)
    if (businessCavnas.length === 0) {
      return left(new NotAllBusinessCanvasError())
    }
    return right([])
  }
}
