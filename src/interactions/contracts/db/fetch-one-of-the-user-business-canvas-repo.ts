import type { FetchOneOfTheUserBusinessCanvasDto } from '@/domain/contracts'
import type { BusinessCanvasModel } from '@/domain/models/db-models'

export interface FetchOneOfTheUserBusinessCanvasRepo {
  fetchOneOfTheUser: (dto: FetchOneOfTheUserBusinessCanvasDto) => Promise<null | BusinessCanvasModel>
}
