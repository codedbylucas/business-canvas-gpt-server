import type { AccessControl } from '@/domain/contracts'
import { AccessControlUseCase } from '@/interactions/usecases/access/access-control/access-control-usecase'
import { jwtAdapterFactory } from '../../infra/cryptography/jwt-adapter-factory'
import { userPrismaRepoFactory } from '../../infra/db/prisma/user-prisma-repo-factory'

export const accessControlUseCaseFactory = (): AccessControl => {
  return new AccessControlUseCase(
    jwtAdapterFactory(), userPrismaRepoFactory()
  )
}
