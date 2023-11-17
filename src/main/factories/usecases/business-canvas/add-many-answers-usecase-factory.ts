import type { AddBusinessCanvas } from '@/domain/contracts'
import { AddBusinessCanvasUseCase } from '@/interactions/usecases/business-canvas/add-business-canvas/add-business-canvas-usecase'
import { uuidAdapterFactory } from '@/main/factories/infra/id/uuid-adapter-factory'
import { businessCanvasPrismaRepoFactory } from '@/main/factories/infra/db/prisma/business-canvas-prisma-repo-factory'

export const addBusinessCanvasUseCaseFactory = (): AddBusinessCanvas => {
  return new AddBusinessCanvasUseCase(
    uuidAdapterFactory(), businessCanvasPrismaRepoFactory()
  )
}
