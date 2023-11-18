import type { AccessTokenModel } from '@/domain/models/output-models'

export interface AddRandomUser {
  perform: () => Promise<AccessTokenModel>
}
