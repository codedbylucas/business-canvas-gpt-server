import type { UserModel } from '@/domain/models/db-models'

export interface FetchUserByEmailRepo {
  fetchByEmail: (email: string) => Promise<null | UserModel>
}
