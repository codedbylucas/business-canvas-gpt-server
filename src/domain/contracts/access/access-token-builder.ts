import type { AccessTokenModel } from '../../models/output-models'

export interface AccessTokenBuilder {
  perform: (value: string) => Promise<AccessTokenModel>
}
