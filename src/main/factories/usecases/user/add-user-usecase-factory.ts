import type { AddUser } from '@/domain/contracts'
import { AddUserUseCase } from '@/interactions/usecases/user'
import { bcryptAdapterFactory } from '@/main/factories/infra/cryptography/bcrypt-adapter-factory'
import { userPrismaRepoFactory } from '@/main/factories/infra/db/prisma/user-prisma-repo-factory'
import { uuidAdapterFactory } from '@/main/factories/infra/id/uuid-adapter-factory'
import { accessTokenBuilderUseCaseFactory } from '../access/access-token-builder-usecase-factory'

export const addUserUseCaseFactory = (): AddUser => {
  return new AddUserUseCase(
    userPrismaRepoFactory(),
    bcryptAdapterFactory(),
    uuidAdapterFactory(),
    userPrismaRepoFactory(),
    accessTokenBuilderUseCaseFactory()
  )
}
