import type { NotAllBusinessCanvasError } from '@/domain/errors'
import type { UserBusinessCanvasSummary } from '@/domain/models/output-models'
import type { Either } from '@/shared/either'

export type FetchAllOfTheUserBusinessCanvasRes = Either<NotAllBusinessCanvasError, UserBusinessCanvasSummary[]>

export interface FetchAllOfTheUserBusinessCanvas {
  perform: (userId: string) => Promise<FetchAllOfTheUserBusinessCanvasRes>
}
