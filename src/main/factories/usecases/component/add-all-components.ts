import type { AddAllComponents } from '@/domain/contracts'
import { AddAllComponentsUseCase } from '@/interactions/usecases/component'
import { uuidAdapterFactory } from '@/main/factories/infra/id/uuid-adapter-factory'
import { componentPrismaRepoFactory } from '@/main/factories/infra/db/prisma/component-prisma-repo-factory'

export const addAllComponentsUseCaseFactory = (): AddAllComponents => {
  return new AddAllComponentsUseCase(
    uuidAdapterFactory(), componentPrismaRepoFactory()
  )
}
