import type { NotAllBusinessCanvasError } from '@/domain/errors'
import type { UserBusinessCanvasList } from '@/domain/models/output-models'
import type { Either } from '@/shared/either'

export type FetchAllOfTheUserBusinessCanvasRes = Either<NotAllBusinessCanvasError, UserBusinessCanvasList>

export interface FetchAllOfTheUserBusinessCanvas {
  perform: (userId: string) => Promise<FetchAllOfTheUserBusinessCanvasRes>
}
