import { UuidAdapter } from '@/infra/id/uuid-adapter/uuid-adapter'

export const uuidAdapterFactory = (): UuidAdapter => {
  return new UuidAdapter()
}
