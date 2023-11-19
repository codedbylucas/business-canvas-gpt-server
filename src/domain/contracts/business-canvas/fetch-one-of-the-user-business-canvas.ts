import type { ComponentName } from '@/domain/entities/component'
import type { BusinessCanvasNotFoundError } from '@/domain/errors'
import type { Either } from '@/shared/either'

export interface FetchOneOfTheUserBusinessCanvasDto {
  userId: string
  businessCanvasId: string
}

export interface BusinessCanvasOfTheUser {
  id: string
  name: string
  createdAt: string
  components: Record<ComponentName, string[]>
}

export type FetchOneOfTheUserBusinessCanvasRes = Either<BusinessCanvasNotFoundError, BusinessCanvasOfTheUser>

export interface FetchOneOfTheUserBusinessCanvas {
  perform: (dto: FetchOneOfTheUserBusinessCanvasDto) => Promise<FetchOneOfTheUserBusinessCanvasRes>
}
