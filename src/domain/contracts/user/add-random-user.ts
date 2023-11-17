import type { IdModel } from '@/domain/models/output-models'

export interface AddRandomUser {
  perform: () => Promise<IdModel>
}
