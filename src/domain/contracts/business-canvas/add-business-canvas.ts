import type { BusinessCanvasApiModel } from '@/domain/models/output-models'

export type AddBusinessCanvasDto = BusinessCanvasApiModel & { userId: string }

export interface AddBusinessCanvas {
  perform: (dto: AddBusinessCanvasDto) => Promise<void>
}
