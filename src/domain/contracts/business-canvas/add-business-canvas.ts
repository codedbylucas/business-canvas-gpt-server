import type { BusinessCanvasApiModel } from '@/domain/models/output-models'

export type AddBusinessCanvasDto = BusinessCanvasApiModel & { userId: string }

export interface BusinessCanvasId {
  id: string
}

export interface AddBusinessCanvas {
  perform: (dto: AddBusinessCanvasDto) => Promise<BusinessCanvasId>
}
