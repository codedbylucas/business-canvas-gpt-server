import type { BusinessCanvasApiModel } from '@/domain/models/output-models'

export interface CreateBusinessCanvasApiDto {
  input: string
}

export interface CreateBusinessCanvasApi {
  create: (dto: CreateBusinessCanvasApiDto) => Promise<BusinessCanvasApiModel>
}
