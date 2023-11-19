import type { FetchAllOfTheUserBusinessCanvas } from '@/domain/contracts'
import { FetchAllOfTheUserBusinessCanvasUseCase } from '@/interactions/usecases/business-canvas'
import { businessCanvasPrismaRepoFactory } from '@/main/factories/infra/db/prisma/business-canvas-prisma-repo-factory'

export const fetchAllOfTheUserBusinessCanvasUseCaseFactory = (): FetchAllOfTheUserBusinessCanvas => {
  return new FetchAllOfTheUserBusinessCanvasUseCase(
    businessCanvasPrismaRepoFactory()
  )
}
