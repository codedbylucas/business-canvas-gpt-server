import type { UserModel } from '@/domain/models/db-models'
import type { AddUserRepo, FetchUserByEmailRepo, FetchUserByIdRepo } from '@/interactions/contracts/db'
import { PrismaHelper as prisma } from '../helpers/prisma-helper'

export class UserPrismaRepo implements AddUserRepo, FetchUserByEmailRepo, FetchUserByIdRepo {
  async add (data: UserModel): Promise<void> {
    await (await prisma.getCli()).user.create({ data })
  }

  async fetchByEmail (email: string): Promise<null | UserModel> {
    const userOrNull = await (await prisma.getCli()).user.findUnique({ where: { email } })
    return userOrNull
  }

  async fetchById (id: string): Promise<null | UserModel> {
    const userOrNull = await (await prisma.getCli()).user.findUnique({ where: { id } })
    return userOrNull
  }
}
