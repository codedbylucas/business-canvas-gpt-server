import { UserPrismaRepo } from '@/infra/db/prisma/user/user-prisma-repo'

export const userPrismaRepoFactory = (): UserPrismaRepo => {
  return new UserPrismaRepo()
}
