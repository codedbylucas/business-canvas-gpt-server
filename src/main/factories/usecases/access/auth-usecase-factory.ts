import type { Auth } from '@/domain/contracts'
import { AuthUseCase } from '@/interactions/usecases/access'
import { bcryptAdapterFactory } from '@/main/factories/infra/cryptography/bcrypt-adapter-factory'
import { userPrismaRepoFactory } from '@/main/factories/infra/db/prisma/user-prisma-repo-factory'
import { accessTokenBuilderUseCaseFactory } from './access-token-builder-usecase-factory'

export const authUseCaseFactory = (): Auth => {
  return new AuthUseCase(
    userPrismaRepoFactory(),
    bcryptAdapterFactory(),
    accessTokenBuilderUseCaseFactory()
  )
}
