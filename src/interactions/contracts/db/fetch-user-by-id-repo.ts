import type { UserModel } from '@/domain/models/db-models'

export interface FetchUserByIdRepo {
  fetchById: (id: string) => Promise<null | UserModel>
}
