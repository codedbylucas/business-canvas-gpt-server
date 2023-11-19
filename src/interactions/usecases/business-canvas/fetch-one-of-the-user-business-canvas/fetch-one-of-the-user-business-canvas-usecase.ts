import type { FetchOneOfTheUserBusinessCanvas, FetchOneOfTheUserBusinessCanvasDto, FetchOneOfTheUserBusinessCanvasRes } from '@/domain/contracts'
import type { FetchOneOfTheUserBusinessCanvasRepo } from '@/interactions/contracts/db'
import { BusinessCanvasNotFoundError } from '@/domain/errors'
import { left, right } from '@/shared/either'

export class FetchOneOfTheUserBusinessCanvasUseCase implements FetchOneOfTheUserBusinessCanvas {
  constructor (private readonly fetchOneOfTheUserBusinessCanvasRepo: FetchOneOfTheUserBusinessCanvasRepo) {}

  async perform (dto: FetchOneOfTheUserBusinessCanvasDto): Promise<FetchOneOfTheUserBusinessCanvasRes> {
    const businessCanvnas = await this.fetchOneOfTheUserBusinessCanvasRepo.fetchOneOfTheUser(dto)
    if (!businessCanvnas) {
      return left(new BusinessCanvasNotFoundError(dto.businessCanvasId))
    }
    const t = '' as any
    return right(t)
  }
}
