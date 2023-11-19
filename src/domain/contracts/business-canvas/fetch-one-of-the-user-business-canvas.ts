import type { BusinessCanvasNotFoundError } from '@/domain/errors'
import type { BusinessCanvasApiModel } from '@/domain/models/output-models'
import type { Either } from '@/shared/either'

export interface FetchOneOfTheUserBusinessCanvasDto {
  userId: string
  businessCanvasId: string
}

export interface BusinessCanvasOfTheUser extends BusinessCanvasApiModel {
  id: string
  createdAt: string
}

export type FetchOneOfTheUserBusinessCanvasRes = Either<BusinessCanvasNotFoundError, BusinessCanvasOfTheUser>

export interface FetchOneOfTheUserBusinessCanvas {
  perform: (dto: FetchOneOfTheUserBusinessCanvasDto) => Promise<FetchOneOfTheUserBusinessCanvasRes>
}
