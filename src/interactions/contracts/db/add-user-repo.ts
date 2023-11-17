import type { UserModel } from '@/domain/models/db-models'

export interface AddUserRepo {
  add: (data: UserModel) => Promise<void>
}
