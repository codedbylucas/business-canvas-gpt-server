import { BusinessCanvasPrismaRepo } from '@/infra/db/prisma/business-canvas/business-canvas-repo'

export const businessCanvasPrismaRepoFactory = (): BusinessCanvasPrismaRepo => {
  return new BusinessCanvasPrismaRepo()
}
