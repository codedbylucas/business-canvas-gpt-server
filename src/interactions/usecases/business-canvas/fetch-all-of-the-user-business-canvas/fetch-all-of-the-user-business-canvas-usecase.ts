import type { FetchAllOfTheUserBusinessCanvas, FetchAllOfTheUserBusinessCanvasRes } from '@/domain/contracts'
import type { FetchAllBusinessCanvasByUserIdRepo } from '@/interactions/contracts/db'
import { right } from '@/shared/either'

export class FetchAllOfTheUserBusinessCanvasUseCase implements FetchAllOfTheUserBusinessCanvas {
  constructor (private readonly fetchAllBusinessCanvasByUserIdRepo: FetchAllBusinessCanvasByUserIdRepo) {}

  async perform (userId: string): Promise<FetchAllOfTheUserBusinessCanvasRes> {
    await this.fetchAllBusinessCanvasByUserIdRepo.fetchByUserId(userId)
    return right([])
  }
}
