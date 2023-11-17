import type { HashedModel } from '@/domain/models/output-models'

export interface Hasher {
  hashing: (value: string) => Promise<HashedModel>
}
