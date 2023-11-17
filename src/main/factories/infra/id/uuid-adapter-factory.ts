import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import { UuidAdapter } from '@/infra/id/uuid-adapter/uuid-adapter'

export const uuidAdapterFactory = (): IdBuilder => {
  return new UuidAdapter()
}
