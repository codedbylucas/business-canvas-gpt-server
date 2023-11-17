import type { BusinessCanvasModel } from '@/domain/models/db-models'

export interface AddBusinessCanvasRepo {
  add: (dto: BusinessCanvasModel) => Promise<void>
}
