import { type AddUserResModel } from '@/domain/models/output-models'

export interface AddRandomUserRes extends AddUserResModel {
  id: string
}

export interface AddRandomUser {
  perform: () => Promise<AddRandomUserRes>
}
