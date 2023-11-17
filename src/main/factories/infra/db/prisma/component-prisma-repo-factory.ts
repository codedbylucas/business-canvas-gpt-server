import { ComponentPrismaRepo } from '@/infra/db/prisma/component/component-prisma-repo'

export const componentPrismaRepoFactory = (): ComponentPrismaRepo => {
  return new ComponentPrismaRepo()
}
