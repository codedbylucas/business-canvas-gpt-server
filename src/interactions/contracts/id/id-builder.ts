import type { IdModel } from '@/domain/models/output-models'

export interface IdBuilder {
  build: () => IdModel
}
