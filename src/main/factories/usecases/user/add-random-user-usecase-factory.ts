import type { AddRandomUser } from '@/domain/contracts'
import { AddRandomUserUseCase } from '@/interactions/usecases/user'
import { bcryptAdapterFactory } from '@/main/factories/infra/cryptography/bcrypt-adapter-factory'
import { userPrismaRepoFactory } from '@/main/factories/infra/db/prisma/user-prisma-repo-factory'
import { uuidAdapterFactory } from '@/main/factories/infra/id/uuid-adapter-factory'

export const addRandomUserUseCaseFactory = (): AddRandomUser => {
  return new AddRandomUserUseCase(
    bcryptAdapterFactory(),
    uuidAdapterFactory(),
    userPrismaRepoFactory()
  )
}
